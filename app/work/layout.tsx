import { SubTabs } from "@/components/nav/SubTabs";

const WORK_TABS = [
  { href: "/work/shifts", label: "🕒 勤務記録" },
  { href: "/work/places", label: "📇 バイト図鑑" },
  { href: "/work/summary", label: "📊 集計・実績" },
  { href: "/work/ranking", label: "💰 時給ランキング" },
  { href: "/work/tenure", label: "📅 勤続記録" },
  { href: "/work/paidleave", label: "🌴 有給管理" },
];

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SubTabs items={WORK_TABS} />
      <div className="p-4 max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
