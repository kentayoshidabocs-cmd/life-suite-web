import { SubTabs } from "@/components/nav/SubTabs";

const CAMPUS_TABS = [
  { href: "/campus/timetable", label: "🗓 時間割" },
  { href: "/campus/credits", label: "🎓 単位管理" },
  { href: "/campus/courses", label: "📖 授業情報" },
  { href: "/campus/rakutan", label: "🍀 楽単DB" },
  { href: "/campus/assignments", label: "📝 課題管理" },
];

export default function CampusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SubTabs items={CAMPUS_TABS} />
      <div className="p-4 max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
