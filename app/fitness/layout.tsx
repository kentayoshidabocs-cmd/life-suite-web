import { SubTabs } from "@/components/nav/SubTabs";

const FITNESS_TABS = [
  { href: "/fitness/workouts", label: "💪 トレーニング記録" },
  { href: "/fitness/progress", label: "📈 成長グラフ" },
  { href: "/fitness/gym", label: "🏋️ ジム記録" },
  { href: "/fitness/advice", label: "🤖 AIアドバイス" },
  { href: "/fitness/protein", label: "🥤 プロテイン管理" },
  { href: "/fitness/body", label: "⚖️ 体重・サイズ" },
  { href: "/fitness/goals", label: "🎯 目標管理" },
  { href: "/fitness/meals", label: "🍽️ 食事記録" },
  { href: "/fitness/life", label: "🛌 生活管理" },
];

export default function FitnessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SubTabs items={FITNESS_TABS} />
      <div className="p-4 max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
