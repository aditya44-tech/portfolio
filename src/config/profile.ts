/**
 * Single source of truth for personal profile data.
 *
 * Fill in the placeholder values below, then every app
 * (GitHub, LinkedIn, Mail) picks them up automatically.
 * No component should hardcode these links — always import from here.
 */
export interface ProjectEntry {
  /** Exact GitHub repository name, e.g. "Sentinel". */
  repo: string;
  /** Display title used for the folder, e.g. "Sentinel". */
  title: string;
  /** Branch to browse. Omit to use the repo's default branch. */
  branch?: string;
}

export interface ProfileConfig {
  name: string;
  email: string;
  location: string;
  /** GitHub username — used by the GitHub app, Projects folder and sync script. */
  githubUser: string;
  github: {
    username: string;
    url: string;
  };
  resume: {
    /** Public URL of the resume PDF. */
    file: string;
    /** Display name shown in the Resume folder. */
    displayName: string;
  };
  /** One line per project to mirror from GitHub. */
  projects: ProjectEntry[];
  linkedin: {
    /** Display name shown in the LinkedIn app. */
    name: string;
    /** Headline shown under the name, e.g. "Software Engineer | React & TypeScript". */
    headline: string;
    /** Full URL to the LinkedIn profile, e.g. "https://www.linkedin.com/in/your-handle". */
    url: string;
    /** Location line shown under the headline, e.g. "Bengaluru, India". */
    location: string;
  };
}

const GITHUB_USER = "aditya44-tech";

const profile: ProfileConfig = {
  name: "Aditya Salunkhe",
  // Picks up everywhere (Mail "To" field, compose, copy-email).
  email: "adityasalunkhe126@gmail.com",
  location: "India",
  githubUser: GITHUB_USER,
  github: {
    username: GITHUB_USER,
    url: `https://github.com/${GITHUB_USER}`,
  },
  resume: {
    // Place your PDF at public/resume/Aditya_Salunkhe_Resume.pdf
    // (copied from the repo root as a working default — replace it).
    file: "/resume/Aditya_Salunkhe_Resume.pdf",
    displayName: "Resume.pdf",
  },
  // TODO: confirm these repo names. Adding a project = one line here.
  projects: [
    { repo: "Sentinel", title: "Sentinel" },
    { repo: "SwasthyaSetu", title: "SwasthyaSetu" },
    { repo: "LeetCode-Tracker-Extension", title: "LeetCode Tracker Extension" },
  ],
  linkedin: {
    name: "Aditya Salunkhe",
    // TODO: e.g. "Software Engineer | React & TypeScript".
    headline: "YOUR_HEADLINE_HERE",
    // TODO: e.g. "https://www.linkedin.com/in/your-handle".
    url: "YOUR_LINKEDIN_URL_HERE",
    // TODO: e.g. "Mumbai, India".
    location: "YOUR_LOCATION_HERE",
  },
};

export default profile;
