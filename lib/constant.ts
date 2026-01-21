import {
  BarChart3,
  BookOpen,
  Cpu,
  Database,
  Heart,
  Info,
  Newspaper,
  Share2,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface SidebarMenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { name: "User Intake", href: "/", icon: Users },
  // { name: "User Database", href: "/user-database", icon: Database },
  // { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Research Evidence", href: "/research-evidence", icon: BookOpen },
  { name: "Newsletter", href: "/newsletter", icon: Newspaper },
  { name: "About", href: "/about", icon: Info },
];

export const QUOTE = `"Where words fail, music speaks — not to the mind, but to the soul."`;
export const QUOTE_WRITTER = "— Hans Christian Andersen";

// ==========About Page==========
export const pillars = [
  {
    icon: Cpu,
    title: "Hybrid Intelligence Stack",
    description:
      "Blends deterministic therapy heuristics with Linear Thompson Sampling, capturing feedback to progressively personalise playlists.",
  },
  {
    icon: Share2,
    title: "Knowledge Graph",
    description:
      "Enriched query pipelines surface culturally aligned performances, long-form recordings, and therapy-specific arrangements.",
  },
  {
    icon: Shield,
    title: "Clinical Observability",
    description:
      "Full telemetry covering patient intake, feedback audit trails, and reinforcement learning counters for compliance reviews.",
  },
];

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Users,
    title: "Patient Assessment",
    description:
      "Comprehensive intake forms capturing demographics, Big Five personality traits, cultural preferences, and clinical history to build detailed therapeutic profiles.",
  },
  {
    icon: Cpu,
    title: "Adaptive Algorithms",
    description:
      "Machine learning models deployed through Next.js API routes, enabling real-time music recommendations and dynamic playlist optimization.",
  },
  {
    icon: Shield,
    title: "Data Management",
    description:
      "Secure SQLite-based persistence layer for managing patient records, therapy sessions, and clinical analytics with HIPAA-compliant protocols.",
  },
  {
    icon: Heart,
    title: "Continuous Optimization",
    description:
      "Interactive feedback system (like/skip/dislike) integrated with reinforcement learning to continually enhance therapy outcomes.",
  },
];

// ==========Home Page==========
