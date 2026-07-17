import { SubTabs } from "@/components/nav/SubTabs";

const LOVE_TABS = [
  { href: "/love/album", label: "💑 恋愛アルバム" },
  { href: "/love/anniversary", label: "🎉 記念日" },
  { href: "/love/timeline", label: "📜 恋愛年表" },
  { href: "/love/dates", label: "📸 デート記録" },
  { href: "/love/trips", label: "✈️ 旅行記録" },
  { href: "/love/map", label: "🗾 日本地図" },
  { href: "/love/ai", label: "🤖 AIサポート" },
];

export default function LoveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SubTabs items={LOVE_TABS} />
      <div className="p-4 max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
