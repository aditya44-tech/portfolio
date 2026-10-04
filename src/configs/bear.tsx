import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-ph:paw-print",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-ph:shield-star",
        excerpt: "Hey there! I'm the one who is building his own universe..."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: "i-fa6-brands:github",
        excerpt: "Here are some status about my github account..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-ph:browser",
        excerpt: "Something about this personal portfolio site..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects & Work",
    icon: "i-ph:git-branch",
    md: [
      {
        id: "portfolio-macos",
        title: "macOS 26 Tahoe Portfolio",
        file: "markdown/about-site.md",
        icon: "i-ph:desktop",
        excerpt: "macOS 26 Tahoe Liquid Glass web OS portfolio interface...",
        link: "https://github.com/aditya44-tech/portfolio"
      },
      {
        id: "metakeep",
        title: "MetaKeep Web3 Infrastructure",
        file: "markdown/about-me.md",
        icon: "i-ph:shield-check",
        excerpt: "Enterprise hardware-backed Web3 wallet & developer infrastructure...",
        link: "https://metakeep.com/"
      },
      {
        id: "agentic-ai",
        title: "Agentic AI & Multi-Agent Systems",
        file: "markdown/about-me.md",
        icon: "i-ph:cpu",
        excerpt: "Autonomous agent workflows, RAG systems, and Amazon Bedrock / OpenAI integrations...",
        link: "https://github.com/aditya44-tech"
      },
      {
        id: "polygon-defi",
        title: "Polygon Open DeFi Hackathon",
        file: "markdown/about-me.md",
        icon: "i-ph:trophy",
        excerpt: "2nd Prize Winner — High-performance decentralized finance protocol on Polygon...",
        link: "https://polygon.technology/"
      },
      {
        id: "nwn-ai",
        title: "NWN AI Platform",
        file: "markdown/about-me.md",
        icon: "i-ph:cloud",
        excerpt: "Production cloud-native SaaS and AI-enabled enterprise backend architecture...",
        link: "https://github.com/aditya44-tech"
      },
      {
        id: "medium-articles",
        title: "Engineering & AI Articles",
        file: "markdown/about-me.md",
        icon: "i-ph:article",
        excerpt: "Deep-dives on Agentic AI, system design, software engineering, and blockchain...",
        link: "https://medium.com/@adityasalunkhe97"
      }
    ]
  }
];

export default bear;
