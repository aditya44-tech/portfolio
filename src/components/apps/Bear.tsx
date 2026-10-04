import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";

interface ContentProps {
  contentID: string;
  contentURL: string;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface BearState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div style={{ color: "var(--bear-sidebar-text)" }}>
      <div className="h-12 pr-3 hstack space-x-3 justify-end" style={{ color: "var(--bear-sidebar-muted)" }}>
        <span className="i-ph:cloud-slash text-xl" />
        <span className="i-ph:sliders-horizontal text-xl" />
      </div>
      <ul>
        {bear.map((item, index) => (
          <li
            key={`bear-sidebar-${item.id}`}
            className={`bear-sidebar-item pl-4 h-8 hstack cursor-default text-[13px] ${cur === index ? "font-semibold" : ""}`}
            style={
              cur === index
                ? { background: "var(--bear-sidebar-active)", color: "var(--bear-sidebar-text)" }
                : { color: "var(--bear-sidebar-muted)" }
            }
            onClick={() => setMidBar(item.md, index)}
          >
            <span className={item.icon} />
            <span className="ml-2">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <ul>
      {items.map((item: BearMdData, index: number) => (
        <li
          key={`bear-midbar-${item.id}`}
          className="bear-note-item min-h-24 flex flex-col cursor-default py-1"
          style={
            cur === index
              ? { background: "var(--bear-editor-bg)", boxShadow: "inset 3px 0 0 var(--bear-accent)" }
              : undefined
          }
          onClick={() => setContent(item.id, item.file, index)}
        >
          <div className="min-h-8 mt-3 hstack items-start">
            <div className="-mt-1 w-10 vstack" style={{ color: "var(--c-text-tertiary)" }}>
              <span className={item.icon} />
            </div>
            <span className="relative flex-1 font-bold pr-8 leading-snug line-clamp-2" style={{ color: "var(--c-text)" }}>
              {item.title}
              {item.link && (
                <a
                  pos="absolute top-1 right-4"
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="i-ph:link" style={{ color: "var(--c-text-tertiary)" }} />
                </a>
              )}
            </span>
          </div>
          <div className="flex-1 ml-10 line-clamp-2 leading-snug text-sm" style={{ color: "var(--c-text-secondary)", borderBottom: "1px solid var(--c-border)", paddingBottom: 8, paddingRight: 4 }}>
            {item.excerpt}
          </div>
        </li>
      ))}
    </ul>
  );
};

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            storeMd[id] = fixImageURL(text, url);
            setStoreMd({ ...storeMd });
          })
          .catch((error) => { /* console.error(error) */ });
      }
    },
    [storeMd]
  );

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  return (
    <div className="markdown w-2/3 mx-auto px-2 py-6" style={{ color: "var(--c-text)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
        ]}
        components={Highlighter(dark as boolean)}
      >
        {storeMd[contentID]}
      </ReactMarkdown>
    </div>
  );
};

const Bear = () => {
  const [state, setState] = useState<BearState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
  };

  return (
    <div className="bear flex h-full" style={{ fontFamily: "var(--font-system)" }}>
      <div className="w-44 overflow-auto" style={{ background: "var(--bear-sidebar-bg)" }}>
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>
      <div className="w-60 overflow-auto" style={{ background: "var(--bear-list-bg)", borderRight: "1px solid var(--c-border)" }}>
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>
      <div className="flex-1 overflow-auto" style={{ background: "var(--bear-editor-bg)" }}>
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default Bear;
