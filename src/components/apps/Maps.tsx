import React, { useState } from "react";

/* ------------------------------------------------------------------
   Maps — illustrated fake map UI. Fully local (inline SVG, zero
   network) in an Apple-Maps-inspired style: sidebar favorites,
   zoomable / recenterable canvas, Map-vs-Satellite palettes.
   Icons only — no emojis.
------------------------------------------------------------------- */

type Place = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  icon: string;
  x: number;
  y: number;
};

const PLACES: Place[] = [
  {
    id: "mbm",
    name: "MBM University",
    category: "University",
    blurb: "Home campus — engineering blocks, the old clock tower building and late-night canteen runs.",
    icon: "i-ph:graduation-cap",
    x: 400,
    y: 300,
  },
  {
    id: "ghanta",
    name: "Ghanta Ghar (Clock Tower)",
    category: "Landmark",
    blurb: "The blue city's beating heart — Sardar Market's spice lanes start right here.",
    icon: "i-ph:clock",
    x: 482,
    y: 228,
  },
  {
    id: "mehran",
    name: "Mehrangarh Fort",
    category: "Fort",
    blurb: "The 500-year-old citadel towering over the old blue town. The view at sunset is unreal.",
    icon: "i-ph:castle-turret",
    x: 318,
    y: 162,
  },
  {
    id: "umaid",
    name: "Umaid Bhawan Palace",
    category: "Palace",
    blurb: "Art-deco royal residence, half museum, half the fanciest hotel in Rajasthan.",
    icon: "i-ph:bank",
    x: 572,
    y: 376,
  },
  {
    id: "sardar",
    name: "Sardarpura Market",
    category: "Shopping",
    blurb: "Cafés, street food and bookshops — the city's favourite evening hangout strip.",
    icon: "i-ph:shopping-bag",
    x: 414,
    y: 452,
  },
];

const LIGHT = {
  land: "#f2efe9",
  block: "#e8e3d5",
  water: "#aad3df",
  park: "#cde6cb",
  casing: "#dbd6c8",
  road: "#ffffff",
  minorCasing: "#e3ded1",
  minor: "#fdfdfb",
  hwyCasing: "#f0ad55",
  hwy: "#ffd9a0",
  label: "#8f8c84",
  placeLabel: "#6e6b63",
};

const DARK = {
  land: "#16251f",
  block: "#1d3027",
  water: "#0d2a3b",
  park: "#24503a",
  casing: "#2c4037",
  road: "#466058",
  minorCasing: "#26352f",
  minor: "#33463d",
  hwyCasing: "#7a6a2f",
  hwy: "#a89a4e",
  label: "#8fa89b",
  placeLabel: "#c2d4c9",
};

const MAJORS = [
  "M-20,180 C150,170 300,190 500,180 C620,175 720,185 820,178",
  "M-20,300 C180,288 380,312 600,300 C700,295 760,302 820,298",
  "M250,-20 C244,150 258,320 248,480 C245,540 247,580 246,620",
  "M552,-20 C560,140 542,330 556,480 C560,540 558,580 557,620",
  "M40,620 L760,40",
  "M-20,522 C200,506 420,536 820,512",
];

const MINORS = [
  "M-20,70 C200,62 420,78 820,68",
  "M-20,120 C220,112 460,128 820,118",
  "M-20,240 C200,232 480,248 820,238",
  "M-20,360 C240,352 480,368 820,358",
  "M-20,432 C220,424 480,440 820,430",
  "M-20,566 C240,558 500,574 820,564",
  "M110,-20 C104,180 118,380 108,620",
  "M180,-20 C186,160 174,360 182,620",
  "M335,-20 C330,170 340,380 333,620",
  "M468,-20 C474,180 462,380 470,620",
  "M645,-20 C640,170 650,380 643,620",
  "M722,-20 C728,180 716,380 724,620",
  "M110,620 L335,300 L300,40",
  "M722,620 L560,430 L640,60",
];

const BLOCKS = [
  { x: 58, y: 198, w: 108, h: 82 },
  { x: 292, y: 318, w: 112, h: 62 },
  { x: 498, y: 198, w: 118, h: 88 },
  { x: 596, y: 448, w: 112, h: 100 },
  { x: 130, y: 448, w: 120, h: 92 },
  { x: 362, y: 56, w: 140, h: 88 },
  { x: 200, y: 96, w: 96, h: 44 },
];

const HIGHWAY = "M-20,404 C180,392 340,414 520,398 C640,388 730,404 820,394";

export default function Maps() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Place>(PLACES[0]);
  const [satellite, setSatellite] = useState(false);
  const [view, setView] = useState({ x: 400, y: 300, k: 1 });

  const P = satellite ? DARK : LIGHT;
  const filtered = PLACES.filter((p) =>
    (p.name + " " + p.category).toLowerCase().includes(query.toLowerCase())
  );

  const zoom = (f: number) =>
    setView((v) => ({ ...v, k: Math.min(4, Math.max(1, +(v.k * f).toFixed(2))) }));

  const pick = (p: Place) => {
    setSelected(p);
    setView((v) => ({ x: p.x, y: p.y, k: Math.max(v.k, 1.6) }));
  };

  const reset = () => setView({ x: 400, y: 300, k: 1 });
  const g = `translate(${400 - view.x * view.k} ${300 - view.y * view.k}) scale(${view.k})`;

  return (
    <div className="flex h-full overflow-hidden select-none" style={{ background: P.land }}>
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r border-black/10"
        style={{ width: 236, background: "rgba(246,246,248,0.95)" }}
      >
        <div className="p-3">
          <div
            className="flex items-center rounded-lg px-2.5"
            style={{ background: "#e4e4e9", height: 34 }}
          >
            <span className="i-ph:magnifying-glass mr-1.5" style={{ fontSize: 14, color: "#8e8e93" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Maps"
              className="bg-transparent border-none w-full focus:outline-none"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>
        <div
          className="px-4 pb-1 font-semibold"
          style={{ fontSize: 11, color: "#8e8e93", letterSpacing: "0.04em" }}
        >
          Favorites
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {filtered.map((p) => {
            const active = selected.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => pick(p)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg"
                style={{ background: active ? "#e5e5ea" : "transparent" }}
              >
                <span className={`${p.icon} flex-shrink-0`} style={{ fontSize: 20, color: "#007aff" }} />
                <span className="min-w-0">
                  <span
                    className="block truncate font-medium"
                    style={{ fontSize: 13, color: "#1c1c1e" }}
                  >
                    {p.name}
                  </span>
                  <span className="block" style={{ fontSize: 11, color: "#8e8e93" }}>
                    {p.category}
                  </span>
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-xs" style={{ color: "#8e8e93" }}>
              No places match “{query}”.
            </div>
          )}
        </div>
        <div className="px-4 py-2.5 text-[10px]" style={{ color: "#aeaeb2" }}>
          Illustrated demo map · not to scale
        </div>
      </aside>

      {/* Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
        >
          <rect x="-2000" y="-2000" width="5000" height="5000" fill={P.land} />
          <g transform={g}>
            {BLOCKS.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={5} fill={P.block} />
            ))}
            <ellipse cx={648} cy={128} rx={92} ry={56} fill={P.park} />
            <ellipse cx={208} cy={492} rx={72} ry={44} fill={P.park} />
            <circle cx={470} cy={330} r={24} fill={P.park} />
            <path
              d="M120,-20 C100,150 182,220 150,352 C130,462 182,540 170,620"
              fill="none"
              stroke={P.water}
              strokeWidth={26}
              strokeLinecap="round"
            />
            {MINORS.map((d, i) => (
              <React.Fragment key={i}>
                <path d={d} fill="none" stroke={P.minorCasing} strokeWidth={4} />
                <path d={d} fill="none" stroke={P.minor} strokeWidth={2.2} />
              </React.Fragment>
            ))}
            {MAJORS.map((d, i) => (
              <React.Fragment key={i}>
                <path d={d} fill="none" stroke={P.casing} strokeWidth={7.5} />
                <path d={d} fill="none" stroke={P.road} strokeWidth={5} />
              </React.Fragment>
            ))}
            <path d={HIGHWAY} fill="none" stroke={P.hwyCasing} strokeWidth={12} />
            <path d={HIGHWAY} fill="none" stroke={P.hwy} strokeWidth={9} />

            <text x={400} y={352} textAnchor="middle" fill={P.label} fontSize={22} letterSpacing={8} opacity={0.9}>
              JODHPUR
            </text>
            <text x={604} y={168} fill={P.label} fontSize={11}>MG Road</text>
            <text x={262} y={108} fill={P.label} fontSize={11}>Station Rd</text>
            <text x={120} y={372} fill={P.label} fontSize={11} transform="rotate(-3 120 372)">Pal Rd</text>
            <text x={452} y={472} fill={P.label} fontSize={11}>Sardarpura</text>
            <text x={150} y={548} fill={P.label} fontSize={11}>Ratanada</text>
            <text x={598} y={414} fill={P.label} fontSize={11}>Circuit House Rd</text>
            <text x={348} y={120} fill={P.label} fontSize={11}>Fort Rd</text>

            {PLACES.map((p) => {
              const active = selected.id === p.id;
              return (
                <g
                  key={p.id}
                  onClick={() => pick(p)}
                  style={{ cursor: "pointer" }}
                >
                  {active && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      fill="#f04438"
                      opacity={0.35}
                      className="animate-ping"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 11 : 8.5}
                    fill="#f04438"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                  />
                  <circle cx={p.x} cy={p.y} r={2.6} fill="#ffffff" />
                  {active && (
                    <text
                      x={p.x}
                      y={p.y - 18}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill={P.placeLabel}
                      stroke={satellite ? "#16251f" : "#ffffff"}
                      strokeWidth={3.5}
                      style={{ paintOrder: "stroke" }}
                    >
                      {p.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Map / Satellite toggle */}
        <div
          className="absolute top-3 right-3 flex rounded-lg overflow-hidden shadow-md text-[12px] font-medium"
          style={{ background: "rgba(255,255,255,0.95)" }}
        >
          {(["Map", "Satellite"] as const).map((m) => {
            const on = satellite === (m === "Satellite");
            return (
              <button
                key={m}
                onClick={() => setSatellite(m === "Satellite")}
                className="px-3.5 py-1.5"
                style={{ color: on ? "#000" : "#8e8e93", background: on ? "#e5e5ea" : "transparent" }}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Zoom controls */}
        <div className="absolute right-3 bottom-4 flex flex-col gap-2">
          {[
            { label: "+", fn: () => zoom(1.45) },
            { label: "−", fn: () => zoom(1 / 1.45) },
            { label: "◎", fn: reset },
          ].map((b) => (
            <button
              key={b.label}
              onClick={b.fn}
              className="rounded-full shadow-md font-semibold"
              style={{ width: 36, height: 36, background: "rgba(255,255,255,0.95)", fontSize: 17, color: "#3a3a3c", lineHeight: 1 }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Place card */}
        <div
          className="absolute left-4 bottom-4 rounded-xl shadow-xl p-4"
          style={{ width: 300, background: "rgba(255,255,255,0.97)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`${selected.icon} flex-shrink-0`} style={{ fontSize: 26, color: "#007aff" }} />
              <div className="min-w-0">
                <div className="font-semibold truncate" style={{ fontSize: 15, color: "#1c1c1e" }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: 12, color: "#8e8e93" }}>
                  {selected.category} · Jodhpur, Rajasthan
                </div>
              </div>
            </div>
          </div>
          <p className="mt-2 leading-snug" style={{ fontSize: 12, color: "#3a3a3c" }}>
            {selected.blurb}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              selected.name + " Jodhpur"
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 rounded-lg font-semibold text-white"
            style={{ background: "#007aff", fontSize: 13, padding: "7px 18px" }}
          >
            Directions ↗
          </a>
        </div>
      </main>
    </div>
  );
}
