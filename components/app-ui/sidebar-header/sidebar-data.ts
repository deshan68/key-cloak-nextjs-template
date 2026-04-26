export type Project = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  updatedAt: string;
  status: "active" | "paused" | "archived";
};

export type TeamMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  online: boolean;
};

export type RecentItem = {
  id: string;
  title: string;
  type: "doc" | "sheet" | "task" | "link";
  visitedAt: string;
};

export const PROJECTS: Project[] = Array.from({ length: 80 }, (_, i) => {
  const emojis = ["🚀", "🎯", "💡", "🔥", "⚡", "🌿", "🎨", "🛠️", "📦", "🔮"];
  const colors = ["blue", "purple", "teal", "amber", "coral", "green"];
  const statuses: Project["status"][] = [
    "active",
    "active",
    "active",
    "paused",
    "archived",
  ];
  const names = [
    "Apollo Redesign",
    "Brand Refresh",
    "CLI Tooling",
    "Data Pipeline",
    "Edge Runtime",
    "Form Builder",
    "Growth Dashboard",
    "Hire Portal",
    "Invoice Engine",
    "Jobs Queue",
    "K8s Migration",
    "Localization",
    "Mobile App",
    "Notifications",
    "OAuth Flow",
    "Payment Gateway",
    "QA Automation",
    "Rate Limiter",
    "Search Index",
    "Theme System",
    "UI Components",
    "Vault Service",
    "Webhook Relay",
    "XML Parser",
    "YAML Config",
    "Zero Downtime",
    "Audit Logs",
    "Beta Program",
    "Cache Layer",
    "Deploy Pipeline",
  ];
  return {
    id: `proj-${i}`,
    name:
      names[i % names.length] +
      (i >= names.length ? ` v${Math.floor(i / names.length) + 1}` : ""),
    emoji: emojis[i % emojis.length],
    color: colors[i % colors.length],
    updatedAt: new Date(Date.now() - i * 3600000 * 24).toISOString(),
    status: statuses[i % statuses.length],
  };
});

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "u1",
    name: "Alice Chen",
    initials: "AC",
    role: "Engineering Lead",
    online: true,
  },
  {
    id: "u2",
    name: "Ben Okafor",
    initials: "BO",
    role: "Product Designer",
    online: true,
  },
  {
    id: "u3",
    name: "Clara Kim",
    initials: "CK",
    role: "Backend Engineer",
    online: false,
  },
  { id: "u4", name: "David Luo", initials: "DL", role: "DevOps", online: true },
  {
    id: "u5",
    name: "Eva Martins",
    initials: "EM",
    role: "Frontend Engineer",
    online: false,
  },
  {
    id: "u6",
    name: "Frank Osei",
    initials: "FO",
    role: "Data Analyst",
    online: true,
  },
  {
    id: "u7",
    name: "Grace Park",
    initials: "GP",
    role: "QA Engineer",
    online: false,
  },
  {
    id: "u8",
    name: "Henry Wu",
    initials: "HW",
    role: "Mobile Engineer",
    online: true,
  },
];

export const RECENT_ITEMS: RecentItem[] = [
  {
    id: "r1",
    title: "Q3 Roadmap",
    type: "doc",
    visitedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "r2",
    title: "Sprint Tracker",
    type: "sheet",
    visitedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "r3",
    title: "Fix auth redirect bug",
    type: "task",
    visitedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "r4",
    title: "Design System Docs",
    type: "link",
    visitedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "r5",
    title: "Revenue Dashboard",
    type: "sheet",
    visitedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "r6",
    title: "API Spec v2",
    type: "doc",
    visitedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];
