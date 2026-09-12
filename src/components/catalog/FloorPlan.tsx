import { FLOORPLANS, type FloorFixture, type FloorPlanData } from "@/lib/data/floorplans";
import { STYLES, type StyleId } from "@/lib/data/homes";
import { cn } from "@/lib/utils";

const PAD = 900;

function roomFill(porch?: boolean, styleId?: StyleId) {
  if (porch) return "#E4DDD0";
  if (styleId === "br1") return "#DCE6DC";
  if (styleId === "br3") return "#CFDCD4";
  return "#D5E4DF";
}

function Fixture({ f }: { f: FloorFixture }) {
  const stroke = "var(--color-ink-soft)";
  switch (f.kind) {
    case "bed":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} rx={60} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <rect x={80} y={80} width={f.w * 0.42} height={f.h - 160} rx={40} fill="var(--color-paper-2)" stroke={stroke} strokeWidth={30} />
          <rect x={f.w * 0.5} y={80} width={f.w * 0.42} height={f.h - 160} rx={40} fill="var(--color-paper-2)" stroke={stroke} strokeWidth={30} />
        </g>
      );
    case "twin":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} rx={50} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <rect x={70} y={70} width={f.w - 140} height={420} rx={40} fill="var(--color-paper-2)" stroke={stroke} strokeWidth={28} />
        </g>
      );
    case "toilet":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={420} height={280} rx={40} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <ellipse cx={210} cy={520} rx={170} ry={220} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
        </g>
      );
    case "shower":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} fill="none" stroke={stroke} strokeWidth={40} strokeDasharray="80 60" />
          <circle cx={f.w / 2} cy={f.h / 2} r={70} fill="none" stroke={stroke} strokeWidth={35} />
          <line x1={80} y1={80} x2={f.w - 80} y2={f.h - 80} stroke={stroke} strokeWidth={30} />
          <line x1={f.w - 80} y1={80} x2={80} y2={f.h - 80} stroke={stroke} strokeWidth={30} />
        </g>
      );
    case "lav":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={500} height={380} rx={60} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <ellipse cx={250} cy={200} rx={140} ry={90} fill="none" stroke={stroke} strokeWidth={30} />
        </g>
      );
    case "sink":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} rx={40} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <ellipse cx={f.w / 2} cy={f.h / 2} rx={f.w * 0.28} ry={f.h * 0.28} fill="none" stroke={stroke} strokeWidth={30} />
        </g>
      );
    case "cooktop":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={900} height={550} rx={40} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <circle cx={220} cy={180} r={90} fill="none" stroke={stroke} strokeWidth={32} />
          <circle cx={680} cy={180} r={90} fill="none" stroke={stroke} strokeWidth={32} />
          <circle cx={220} cy={380} r={90} fill="none" stroke={stroke} strokeWidth={32} />
          <circle cx={680} cy={380} r={90} fill="none" stroke={stroke} strokeWidth={32} />
        </g>
      );
    case "fridge":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={600} height={700} rx={40} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <line x1={80} y1={280} x2={520} y2={280} stroke={stroke} strokeWidth={30} />
        </g>
      );
    case "table":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} rx={80} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
        </g>
      );
    case "sofa":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} rx={80} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
          <rect x={80} y={80} width={f.w - 160} height={180} rx={50} fill="var(--color-paper-2)" />
        </g>
      );
    case "desk":
      return (
        <g transform={`translate(${f.x} ${f.y})`}>
          <rect width={f.w} height={f.h} rx={40} fill="var(--color-paper)" stroke={stroke} strokeWidth={40} />
        </g>
      );
  }
}

function PlanSvg({ plan, styleId }: { plan: FloorPlanData; styleId: StyleId }) {
  const vbW = plan.widthMm + PAD * 2;
  const vbH = plan.depthMm + PAD * 2 + 280;
  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${plan.title} floor layout`}
    >
      <rect width={vbW} height={vbH} fill="var(--color-paper)" />
      <g transform={`translate(${PAD} ${PAD})`}>
        {plan.rooms.map((r) => (
          <rect
            key={r.id}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill={roomFill(r.porch, styleId)}
            stroke="var(--color-ink)"
            strokeWidth={r.porch ? 40 : 80}
            strokeDasharray={r.porch ? "120 80" : undefined}
          />
        ))}
        {plan.fixtures.map((f, i) => (
          <Fixture key={i} f={f} />
        ))}
        {plan.rooms.map((r) => {
          const fs = r.w < 1500 ? 160 : r.w < 2800 ? 200 : 230;
          const short =
            r.w < 1400 ? r.label.replace("Bedroom ", "BR ").replace("Bath ", "BA ") : r.label;
          const tw = short.length * fs * 0.52;
          const tx = r.x + r.w / 2;
          const ty = r.y + Math.min(340, r.h * 0.22);
          return (
            <g key={`${r.id}-label`}>
              <rect
                x={tx - tw / 2 - 60}
                y={ty - fs}
                width={tw + 120}
                height={fs + 90}
                rx={50}
                fill="var(--color-paper)"
                fillOpacity={0.92}
              />
              <text
                x={tx}
                y={ty + 20}
                textAnchor="middle"
                fill="var(--color-ink)"
                fontSize={fs}
                fontFamily="var(--font-sans)"
                fontWeight={600}
              >
                {short}
              </text>
            </g>
          );
        })}
        {plan.dims.map((d) => {
          const horizontal = d.side === "n" || d.side === "s";
          const y = d.side === "n" ? -380 : d.side === "s" ? plan.depthMm + 380 : (d.y1 + d.y2) / 2;
          const x = d.side === "e" ? plan.widthMm + 240 : d.side === "w" ? -240 : (d.x1 + d.x2) / 2;
          return (
            <g key={d.label}>
              {horizontal ? (
                <>
                  <line
                    x1={d.x1}
                    y1={d.side === "n" ? -220 : plan.depthMm + 220}
                    x2={d.x2}
                    y2={d.side === "n" ? -220 : plan.depthMm + 220}
                    stroke="var(--color-muted)"
                    strokeWidth={24}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="var(--color-muted)"
                    fontSize={180}
                    fontFamily="var(--font-sans)"
                  >
                    {d.label}
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1={d.side === "e" ? plan.widthMm + 220 : -220}
                    y1={d.y1}
                    x2={d.side === "e" ? plan.widthMm + 220 : -220}
                    y2={d.y2}
                    stroke="var(--color-muted)"
                    strokeWidth={24}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="var(--color-muted)"
                    fontSize={180}
                    fontFamily="var(--font-sans)"
                    transform={`rotate(90 ${x} ${y})`}
                  >
                    {d.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
        <g transform="translate(-40 -40)">
          <polygon points="0,-280 90,40 -90,40" fill="var(--color-kdk)" />
          <text
            x={0}
            y={200}
            textAnchor="middle"
            fill="var(--color-kdk)"
            fontSize={160}
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            N
          </text>
        </g>
      </g>
      <text x={PAD} y={vbH - 60} fill="var(--color-muted)" fontSize={150} fontFamily="var(--font-sans)">
        Factory {plan.code} · {plan.interiorM2} m² enclosed · porch/terrace excluded from area
      </text>
    </svg>
  );
}

export function FloorPlan({
  styleId,
  compact = false,
}: {
  styleId: StyleId;
  compact?: boolean;
}) {
  const plan = FLOORPLANS[styleId];
  const style = STYLES[styleId];
  return (
    <figure
      className={cn("overflow-hidden rounded-[18px] bg-paper shadow-card", compact && "rounded-[14px]")}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-3 py-2 md:px-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">{style.itemNo} · floor layout</p>
          <p className={cn("font-display font-semibold", compact ? "text-base" : "text-lg")}>
            {plan.title}
          </p>
        </div>
        <p className="text-xs tabular text-muted">{plan.interiorM2} m²</p>
      </div>
      <div className={cn("px-2 pb-2 pt-1", compact ? "px-1" : "md:px-3")}>
        <PlanSvg plan={plan} styleId={styleId} />
      </div>
      {!compact && (
        <figcaption className="border-t border-line px-4 py-2 text-xs text-muted">{plan.note}</figcaption>
      )}
    </figure>
  );
}

export function FloorPlanStrip() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(["br1", "br2", "br3"] as StyleId[]).map((id) => (
        <FloorPlan key={id} styleId={id} compact />
      ))}
    </div>
  );
}
