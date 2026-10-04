import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-me",
        title: "intro.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Hi, I'm Aditya Salunkhe (@aditya44-tech / adi44).
              Senior Software Engineer, AI Systems Builder, and Tech Advisor.
              I specialize in designing AI-native products, building agentic workflows,
              and architecting resilient cloud-native backend and Web3 infrastructure.
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content:
          "Agentic AI / Multi-Agent Systems / RAG & Knowledge Graphs / Cloud-Native Architecture (AWS, K8s) / Web3 & Blockchain (Solidity, Polygon)"
      },
      {
        id: "about-who-cares",
        title: "experience.txt",
        type: "file",
        content:
          "Founding Engineer @ MetaKeep | Senior Software Engineer (AI) @ NWN | 2nd Prize Winner @ Polygon Open DeFi Hackathon | Master's in Data Science & PG Diploma in Data Engineering"
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="mailto:adityasalunkhe126@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                adityasalunkhe126@gmail.com
              </a>
            </li>
            <li>
              Github:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/aditya44-tech"
                target="_blank"
                rel="noreferrer"
              >
                @aditya44-tech
              </a>
            </li>
            <li>
              Linkedin:{" "}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/adityasalunkhe"
                target="_blank"
                rel="noreferrer"
              >
                in/adityasalunkhe
              </a>
            </li>
            <li>
              Medium:{" "}
              <a
                className="text-blue-300"
                href="https://medium.com/@adityasalunkhe97"
                target="_blank"
                rel="noreferrer"
              >
                @adityasalunkhe97
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "about-dream",
    title: "agentic-loop.ts",
    type: "file",
    content: (
      <div className="py-1">
        <div>
          <span className="text-yellow-400">while</span>(
          <span className="text-blue-400">agent.hasGoal()</span>) <span>{"{"}</span>
        </div>
        <div>
          <span className="text-blue-400 ml-9">await agent.reasonAndExecute()</span>;
        </div>
        <div>
          <span>{"}"}</span>
        </div>
      </div>
    )
  }
];

export default terminal;
