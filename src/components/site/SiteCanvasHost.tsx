import { useEffect, useState, type ComponentType } from "react";

export function SiteCanvasHost() {
  const [Canvas, setCanvas] = useState<ComponentType | null>(null);
  useEffect(() => {
    let live = true;
    import("./SiteCanvas").then((m) => {
      if (live) setCanvas(() => m.SiteCanvas);
    });
    return () => {
      live = false;
    };
  }, []);
  if (!Canvas) {
    return (
      <div className="grid h-full min-h-[420px] place-items-center bg-kdk-deep text-sm text-kdk-fg">
        Loading village model…
      </div>
    );
  }
  return <Canvas />;
}
