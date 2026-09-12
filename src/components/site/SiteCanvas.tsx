import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useVillage } from "@/lib/store";
import { STYLES } from "@/lib/data/homes";
import { CELL, LOT_M, type Lot } from "@/lib/data/lots";
import { GRID } from "@/lib/data/homes";
import { HouseByStyle, Pavilion } from "./houses";

function Framing() {
  const done = useRef(false);
  useFrame((state) => {
    if (done.current) return;
    const { camera, controls } = state;
    camera.position.set(0, 240, 260);
    camera.lookAt(0, 0, 0);
    const ctrl = controls as { target?: { set: (x: number, y: number, z: number) => void }; update?: () => void } | null;
    if (ctrl?.target) {
      ctrl.target.set(0, 0, 0);
      ctrl.update?.();
      done.current = true;
    }
  });
  return null;
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.4, 5]} />
        <meshLambertMaterial color="#4A3426" />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <coneGeometry args={[1.15, 2.4, 6]} />
        <meshLambertMaterial color="#2F5A38" />
      </mesh>
    </group>
  );
}

function Palm({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.14, 0.22, 4.4, 6]} />
        <meshLambertMaterial color="#6B5344" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.8,
            4.4,
            Math.sin((i / 6) * Math.PI * 2) * 0.8,
          ]}
          rotation={[0.9, (i / 6) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.12, 0.04, 1.8]} />
          <meshLambertMaterial color="#3F7A4A" />
        </mesh>
      ))}
    </group>
  );
}

function LotMesh({ lot, active }: { lot: Lot; active: boolean }) {
  const style = STYLES[lot.styleId];
  const hover = useVillage((s) => s.hover);
  const select = useVillage((s) => s.select);
  return (
    <group position={[lot.x, 0, lot.z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(lot.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hover(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          select(lot.id);
        }}
      >
        <planeGeometry args={[LOT_M - 0.5, LOT_M - 0.5]} />
        <meshLambertMaterial color={active ? "#F3F5C4" : style.colorMuted} />
      </mesh>
      <mesh position={[0, 0.14, 0.3]}>
        <boxGeometry args={[16.5, 0.22, 12.5]} />
        <meshLambertMaterial color="#E6DFD2" />
      </mesh>
      <group position={[0, 0.26, 0.1]} scale={active ? 1.32 : 1.22}>
        <HouseByStyle id={lot.styleId} />
      </group>
    </group>
  );
}

function Ground() {
  const span = GRID * CELL + 40;
  const trees = useMemo(() => {
    const pts: [number, number, number][] = [];
    const half = span / 2 - 8;
    for (let i = 0; i < 56; i++) {
      const t = (i / 56) * Math.PI * 2;
      const r = half - (i % 4) * 3.2;
      pts.push([Math.cos(t) * r, 0, Math.sin(t) * r]);
    }
    return pts;
  }, [span]);
  const palms = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const t = (i / 18) * Math.PI * 2 + 0.18;
      pts.push([Math.cos(t) * (span / 2 - 3), 0, Math.sin(t) * (span / 2 - 3)]);
    }
    return pts;
  }, [span]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[span + 90, span + 90]} />
        <meshLambertMaterial color="#4A7340" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]}>
        <planeGeometry args={[span, span]} />
        <meshLambertMaterial color="#6A675C" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[16, span]} />
        <meshLambertMaterial color="#4E4B44" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[span, 16]} />
        <meshLambertMaterial color="#4E4B44" />
      </mesh>
      <Pavilion />
      {trees.map((p, i) => (
        <Tree key={`t${i}`} position={p} />
      ))}
      {palms.map((p, i) => (
        <Palm key={`p${i}`} position={p} />
      ))}
    </group>
  );
}

function Scene() {
  const lots = useVillage((s) => s.lots);
  const hovered = useVillage((s) => s.hovered);
  const selected = useVillage((s) => s.selected);
  return (
    <>
      <Framing />
      <hemisphereLight args={["#f2f6ff", "#6a7b54", 1.1]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[90, 160, 70]} intensity={1.35} />
      <Ground />
      {lots.map((lot) => (
        <LotMesh key={lot.id} lot={lot} active={lot.id === hovered || lot.id === selected} />
      ))}
    </>
  );
}

export function SiteCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [200, 155, 200], fov: 48, near: 1, far: 2500 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      onCreated={({ camera, gl }) => {
        gl.setClearColor("#8fb4cc", 1);
        camera.position.set(0, 240, 260);
        camera.lookAt(0, 0, 0);
      }}
      onPointerMissed={() => useVillage.getState().select(null)}
    >
      <Scene />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={50}
        maxDistance={560}
        maxPolarAngle={Math.PI / 2.18}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

