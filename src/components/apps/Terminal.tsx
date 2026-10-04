import React from "react";
import terminal from "~/configs/terminal";
import type { TerminalData } from "~/types";
import { useStore } from "~/stores";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const EMOJIS = ["\\(o_o)/", "(˚Δ˚)b", "(^-^*)", "(‵′)", "\\(°ˊДˋ°)/", "(‵′)"];

const getEmoji = () => {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};

interface TerminalState {
  rmrf: boolean;
  content: JSX.Element[];
}

// rain animation is adopted from: https://codepen.io/P3R0/pen/MwgoKv
const HowDare = ({ setRMRF }: { setRMRF: (value: boolean) => void }) => {
  const FONT_SIZE = 12;

  const [emoji, setEmoji] = useState("");
  const [drops, setDrops] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    canvas.height = container.offsetHeight;
    canvas.width = container.offsetWidth;

    const columns = Math.floor(canvas.width / FONT_SIZE);
    setDrops(Array(columns).fill(1));

    setEmoji(getEmoji());
  }, []);

  const rain = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#A1A1A6";
    ctx.font = `${FONT_SIZE}px arial`;

    drops.forEach((y, x) => {
      const text = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      ctx.fillText(text, x * FONT_SIZE, y * FONT_SIZE);
    });

    setDrops(
      drops.map((y) => {
        // sends the drop back to the top randomly after it has crossed the screen
        // adding randomness to the reset to make the drops scattered on the Y axis
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) return 1;
        // increments Y coordinate
        else return y + 1;
      })
    );
  };

  useInterval(rain, 33);

  return (
    <div
      ref={containerRef}
      className="fixed size-full bg-black text-white"
      onClick={() => setRMRF(false)}
    >
      <canvas ref={canvasRef}></canvas>
      <div className="font-avenir absolute h-28 text-center space-y-4 m-auto inset-0">
        <div text-4xl>{emoji}</div>
        <div text-3xl>HOW DARE YOU!</div>
        <div>Click to go back</div>
      </div>
    </div>
  );
};

export default class Terminal extends React.Component<{}, TerminalState> {
  private history = [] as string[];
  private curHistory = 0;
  private curInputTimes = 0;
  private curDirPath = [] as any;
  private curChildren = terminal as any;
  private commands: {
    [key: string]: { (): void } | { (arg?: string): void };
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      content: [],
      rmrf: false
    };
    this.commands = {
      cd: this.cd,
      ls: this.ls,
      cat: this.cat,
      clear: this.clear,
      help: this.help,
      neofetch: this.neofetch,
      bonfire: this.bonfire,
      bankai: this.bankai,
    };
  }

  componentDidMount() {
    this.reset();
    this.generateInputRow(this.curInputTimes);
  }

  reset = () => {
    this.setState({ content: [] });
  };

  addRow = (row: JSX.Element) => {
    this.setState((prev) => {
      if (prev.content.find((item) => item.key === row.key)) return null;
      return { content: [...prev.content, row] };
    });
  };

  getCurDirName = () => {
    if (this.curDirPath.length === 0) return "~";
    else return this.curDirPath[this.curDirPath.length - 1];
  };

  getCurChildren = () => {
    let children = terminal as any;
    for (const name of this.curDirPath) {
      children = children.find((item: TerminalData) => {
        return item.title === name && item.type === "folder";
      }).children;
    }
    return children;
  };

  // move into a specified folder
  cd = (args?: string) => {
    if (args === undefined || args === "~") {
      // move to root
      this.curDirPath = [];
      this.curChildren = terminal;
    } else if (args === ".") {
      // stay in the current folder
      return;
    } else if (args === "..") {
      // move to parent folder
      if (this.curDirPath.length === 0) return;
      this.curDirPath.pop();
      this.curChildren = this.getCurChildren();
    } else {
      // move to certain child folder
      const target = this.curChildren.find((item: TerminalData) => {
        return item.title === args && item.type === "folder";
      });
      if (target === undefined) {
        this.generateResultRow(
          this.curInputTimes,
          <span>{`cd: no such file or directory: ${args}`}</span>
        );
      } else {
        this.curChildren = target.children;
        this.curDirPath.push(target.title);
      }
    }
  };

  // display content of a specified folder
  ls = () => {
    const result = [];
    for (const item of this.curChildren) {
      result.push(
        <span
          key={`terminal-result-ls-${this.curInputTimes}-${item.id}`}
          className={`${item.type === "file" ? "" : "font-bold"}`}
        >
          {item.title}
        </span>
      );
    }
    this.generateResultRow(
      this.curInputTimes,
      <div className="grid grid-cols-4 w-full">{result}</div>
    );
  };

  // display content of a specified file
  cat = (args?: string) => {
    const file = this.curChildren.find((item: TerminalData) => {
      return item.title === args && item.type === "file";
    });

    if (file === undefined) {
      this.generateResultRow(
        this.curInputTimes,
        <span>{`cat: ${args}: No such file or directory`}</span>
      );
    } else {
      this.generateResultRow(this.curInputTimes, <span>{file.content}</span>);
    }
  };

  // clear terminal
  clear = () => {
    this.curInputTimes += 1;
    this.reset();
  };

  help = () => {
    const help = (
      <ul className="list-disc ml-6 pb-1.5">
        <li>
          <span className="font-bold">cat {"<file>"}</span> - See the content of {"<file>"}
        </li>
        <li>
          <span className="font-bold">cd {"<dir>"}</span> - Move into
          {" <dir>"}, "cd .." to move to the parent directory, "cd" or "cd ~" to return to
          root
        </li>
        <li>
          <span className="font-bold">ls</span> - See files and directories in the current
          directory
        </li>
        <li>
          <span className="font-bold">clear</span> - Clear the screen
        </li>
        <li>
          <span className="font-bold">neofetch</span> - System specs &amp; Aditya's AI/Web3 stack
        </li>
        <li>
          <span className="font-bold">bonfire</span> - Kindle the flame &amp; rest
        </li>
        <li>
          <span className="font-bold">bankai</span> - Unleash Tensa Zangetsu spiritual pressure
        </li>
        <li>
          <span className="font-bold">help</span> - Display this help menu
        </li>
        <li>
          <span className="font-bold">rm -rf /</span> - :)
        </li>
        <li>
          press <span className="font-bold">up arrow / down arrow</span> - Select history commands
        </li>
        <li>
          press <span className="font-bold">tab</span> - Auto complete
        </li>
      </ul>
    );
    this.generateResultRow(this.curInputTimes, help);
  };

  neofetch = () => {
    const art = (
      <div className="flex flex-col sm:flex-row gap-4 py-2 font-mono text-xs">
        <div className="term-text font-bold whitespace-pre leading-none select-none">
{`       .:'
     __ :'__
  .'\`__\`-'__\`'.
 :__________.-'
 :_________:
  :_________\`-.__
   \`.__.-.__.'`}
        </div>
        <div className="space-y-1">
          <div><span className="font-bold">aditya</span><span className="term-muted font-bold">@</span><span className="font-bold">macbook-pro</span></div>
          <div className="term-faint">--------------------------</div>
          <div><span className="term-muted font-semibold">OS:</span> macOS 26.0 Tahoe (Apple Silicon M-Series)</div>
          <div><span className="term-muted font-semibold">Role:</span> Senior Engineer &amp; AI Systems Builder</div>
          <div><span className="term-muted font-semibold">Uptime:</span> 5+ years building production software</div>
          <div><span className="term-muted font-semibold">AI Stack:</span> Agentic AI, Multi-Agent Systems, Amazon Bedrock, RAG</div>
          <div><span className="term-muted font-semibold">Cloud/Backend:</span> Python, TypeScript, Node.js, AWS, Kubernetes, Kafka</div>
          <div><span className="term-muted font-semibold">Web3:</span> Solidity, Ethereum, Polygon (Hackathon 2nd Prize)</div>
          <div><span className="term-muted font-semibold">Terminal:</span> zsh 5.9 (x86_64-apple-darwin25.0)</div>
          <div className="flex gap-1 pt-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#FFFFFF", border: "1px solid var(--term-faint)" }} />
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#D4D4D4", border: "1px solid var(--term-faint)" }} />
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#A3A3A3", border: "1px solid var(--term-faint)" }} />
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#737373", border: "1px solid var(--term-faint)" }} />
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#404040", border: "1px solid var(--term-faint)" }} />
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#000000", border: "1px solid var(--term-faint)" }} />
          </div>
        </div>
      </div>
    );
    this.generateResultRow(this.curInputTimes, art);
  };

  bonfire = () => {
    useStore.getState().pushNotification({
      title: "BONFIRE LIT",
      message: "Rest at the bonfire. Estus Flasks refilled. FP restored.",
      app: "Dark Souls",
      icon: "img/icons/games.svg",
    });

    const bonfireDisplay = (
      <div className="py-2 space-y-2 font-mono text-xs">
        <div className="term-text font-bold animate-bonfire-ember whitespace-pre leading-none">
{`         (
        ) )
       ( ( (
      '. ___ .'
     ' (___) '
      /|\\|/\\
     / \\|/  \\
       /|\\`}
        </div>
        <div className="term-text font-serif text-sm font-bold tracking-widest uppercase">
          BONFIRE LIT
        </div>
        <div className="term-muted text-xs">
          HP and FP restored. Souls retrieved. Estus Flask (5/5).
        </div>
      </div>
    );
    this.generateResultRow(this.curInputTimes, bonfireDisplay);
  };

  bankai = () => {
    window.dispatchEvent(new CustomEvent("siri:bankaiFlash"));

    useStore.getState().pushNotification({
      title: "BAN... KAI!",
      message: "Tensa Zangetsu unleashed. Colossal spiritual pressure overflowing.",
      app: "Bleach",
      icon: "img/icons/anime.svg",
    });

    const bankaiDisplay = (
      <div className="py-2 space-y-2 font-mono text-xs">
        <div className="term-text font-bold whitespace-pre leading-none">
{`      |\\
      | \\
      |  \\  TENSA ZANGETSU (天鎖斬月)
=====[###]==============================>
      |  /
      | /
      |/`}
        </div>
        <div className="term-text font-bold text-sm tracking-wider uppercase">
          "BAN... KAI! TENSA ZANGETSU!"
        </div>
        <div className="term-muted text-xs">
          Spiritual Pressure: <span className="term-text font-bold">120,000 Reiatsu</span> • Getsuga Tensho primed.
        </div>
      </div>
    );
    this.generateResultRow(this.curInputTimes, bankaiDisplay);
  };

  autoComplete = (text: string) => {
    if (text === "") return text;

    const input = text.split(" ");
    const cmd = input[0];
    const args = input[1];

    let result = text;

    if (args === undefined) {
      const guess = Object.keys(this.commands).find((item) => {
        return item.substring(0, cmd.length) === cmd;
      });
      if (guess !== undefined) result = guess;
    } else if (cmd === "cd" || cmd === "cat") {
      const type = cmd === "cd" ? "folder" : "file";
      const guess = this.curChildren.find((item: TerminalData) => {
        return item.type === type && item.title.substring(0, args.length) === args;
      });
      if (guess !== undefined) result = cmd + " " + guess.title;
    }
    return result;
  };

  keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    const inputElement = document.querySelector(
      `#terminal-input-${this.curInputTimes}`
    ) as HTMLInputElement;
    const inputText = inputElement.value.trim();
    const input = inputText.split(" ");

    if (keyCode === "Enter") {
      // ----------- run command -----------
      this.history.push(inputText);

      const cmd = input[0];
      const args = input[1];

      // we can't edit the past input
      inputElement.setAttribute("readonly", "true");

      if (inputText.substring(0, 6) === "rm -rf") this.setState({ rmrf: true });
      else if (cmd && Object.keys(this.commands).includes(cmd)) {
        this.commands[cmd](args);
      } else {
        this.generateResultRow(
          this.curInputTimes,
          <span>{`zsh: command not found: ${cmd}`}</span>
        );
      }

      // point to the last history command
      this.curHistory = this.history.length;

      // generate new input row
      this.curInputTimes += 1;
      this.generateInputRow(this.curInputTimes);
    } else if (keyCode === "ArrowUp") {
      // ----------- previous history command -----------
      if (this.history.length > 0) {
        if (this.curHistory > 0) this.curHistory--;
        const historyCommand = this.history[this.curHistory];
        inputElement.value = historyCommand;
      }
    } else if (keyCode === "ArrowDown") {
      // ----------- next history command -----------
      if (this.history.length > 0) {
        if (this.curHistory < this.history.length) this.curHistory++;
        if (this.curHistory === this.history.length) inputElement.value = "";
        else {
          const historyCommand = this.history[this.curHistory];
          inputElement.value = historyCommand;
        }
      }
    } else if (keyCode === "Tab") {
      // ----------- auto complete -----------
      inputElement.value = this.autoComplete(inputText);
      // prevent tab outside the terminal
      e.preventDefault();
    }
  };

  focusOnInput = (id: number) => {
    const input = document.querySelector(`#terminal-input-${id}`) as HTMLInputElement;
    input.focus();
  };

  generateInputRow = (id: number) => {
    const newRow = (
      <div key={`terminal-input-row-${id}`} flex>
        <div className="w-max hstack space-x-1.5">
          <span className="font-bold">
            @aditya <span className="term-muted">{this.getCurDirName()}</span>
          </span>
          <span className="font-bold">{">"}</span>
        </div>
        <input
          id={`terminal-input-${id}`}
          className="flex-1 px-1 outline-none bg-transparent term-text"
          onKeyDown={this.keyPress}
          autoFocus={true}
        />
      </div>
    );
    this.addRow(newRow);
  };

  generateResultRow = (id: number, result: JSX.Element) => {
    const newRow = (
      <div key={`terminal-result-row-${id}`} break-all>
        {result}
      </div>
    );
    this.addRow(newRow);
  };

  render() {
    return (
      <div
        className="terminal font-terminal font-normal relative h-full term-bg term-text overflow-y-scroll text-sm"
        onClick={() => this.focusOnInput(this.curInputTimes)}
      >
        {this.state.rmrf && (
          <HowDare setRMRF={(value: boolean) => this.setState({ rmrf: value })} />
        )}
        <div p="y-2 x-1.5">
          <span className="font-bold">help</span>: Hey, you found the terminal!
          Type `help` to get started.
        </div>
        <div id="terminal-content" p="x-1.5 b-2">
          {this.state.content}
        </div>
      </div>
    );
  }
}
