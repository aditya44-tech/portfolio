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
        file: "markdown/projects/portfolio.md",
        icon: "i-ph:desktop",
        excerpt: "This site — a complete macOS Tahoe desktop recreated on the web...",
        link: "https://github.com/aditya44-tech/portfolio"
      },
      {
        id: "sentinel",
        title: "Sentinel — AI Dropout Prediction",
        file: "markdown/projects/sentinel.md",
        icon: "i-ph:graduation-cap",
        excerpt: "Flags at-risk students with 0–100 scoring + AI narratives. Hack2Ignite 2026...",
        link: "https://github.com/aditya44-tech/Sentinel"
      },
      {
        id: "editing-portfolio",
        title: "ADITYA44 Editing Portfolio",
        file: "markdown/projects/editing-portfolio.md",
        icon: "i-ph:browser",
        excerpt: "Dark-mode video editing portfolio — 3D carousel, hover previews, live site...",
        link: "https://github.com/aditya44-tech/Editing-Portfolio"
      },
      {
        id: "safesearch",
        title: "SafeSignal — AI Safety System",
        file: "markdown/projects/safesearch.md",
        icon: "i-ph:shield-check",
        excerpt: "Workplace safety early warnings — dual AI assessment + SMS alerts...",
        link: "https://github.com/aditya44-tech/SafeSearch"
      },
      {
        id: "leetcode-tracker",
        title: "LeetCode Tracker Extension",
        file: "markdown/projects/leetcode-tracker-extension.md",
        icon: "i-ph:trophy",
        excerpt: "Chrome extension tracking solves, difficulty and company-wise questions...",
        link: "https://github.com/aditya44-tech/leetcode-tracker-extension"
      },
      {
        id: "airwatch",
        title: "AirWatch — AQI Dashboard",
        file: "markdown/projects/airwatch.md",
        icon: "i-ph:cloud",
        excerpt: "Real-time air quality for Indian cities — maps, forecasts, AI advisories...",
        link: "https://github.com/aditya44-tech/AirWatch"
      },
      {
        id: "civicconnect",
        title: "CivicConnect",
        file: "markdown/projects/civicconnect.md",
        icon: "i-ph:lightbulb",
        excerpt: "Citizens report local issues and track resolution end to end...",
        link: "https://github.com/aditya44-tech/CivicConnect"
      },
      {
        id: "swasthyasetu",
        title: "SwasthyaSetu — Rural AI Doctor",
        file: "markdown/projects/swasthyasetu.md",
        icon: "i-ph:shield",
        excerpt: "AI triage for ASHA workers and doctors — multilingual, offline-ready...",
        link: "https://github.com/aditya44-tech/SwasthyaSetu"
      }
    ]
  }
];

export default bear;
