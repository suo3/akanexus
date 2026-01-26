export const CATEGORIES = [
  "All",
  "React",
  "JavaScript",
  "TypeScript",
  "Python",
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
  "Design",
  "Mobile",
  "General",
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  React: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  JavaScript: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  TypeScript: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  Python: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  Frontend: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  Backend: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  DevOps: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  "AI/ML": { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
  Design: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  Mobile: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  General: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
};

export const getCategoryColorClasses = (category: string): string => {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

export const getCategoryButtonClasses = (category: string, isSelected: boolean): string => {
  if (isSelected || category === "All") return "";
  const colors = CATEGORY_COLORS[category];
  if (!colors) return "";
  return `hover:${colors.bg} hover:${colors.text} hover:${colors.border}`;
};
