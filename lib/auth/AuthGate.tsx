"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// 単一ユーザー専用アプリのため、メールアドレスは固定し合言葉(パスワード)のみ入力させる。
const OWNER_EMAIL = "kenta.yoshida.bocs@gmail.com";

export function useAuthUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return user;
}

export function signOutOwner() {
  return signOut(auth);
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();

  if (user === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-sm text-black/40 dark:text-white/40">
        読み込み中…
      </div>
    );
  }
  if (user === null) {
    return <LoginForm />;
  }
  return <>{children}</>;
}

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, OWNER_EMAIL, password);
    } catch {
      setError("合言葉が正しくありません。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <h1 className="text-xl font-bold text-center">🎓 Life Suite</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="合言葉"
          autoFocus
          className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "確認中…" : "入る"}
        </button>
      </form>
    </div>
  );
}
