"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useFirestoreCollection<T extends DocumentData>(collectionName: string) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, collectionName), (snap) => {
      setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) })));
      setLoading(false);
    });
    return unsub;
  }, [collectionName]);

  const add = useCallback(
    (item: T) => addDoc(collection(db, collectionName), item),
    [collectionName]
  );

  const update = useCallback(
    (id: string, item: Partial<T>) => updateDoc(doc(db, collectionName, id), item),
    [collectionName]
  );

  const remove = useCallback(
    (id: string) => deleteDoc(doc(db, collectionName, id)),
    [collectionName]
  );

  return { data, loading, add, update, remove };
}
