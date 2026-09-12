import type { StyleId } from "@/lib/data/homes";
import { STYLES } from "@/lib/data/homes";

function Solar({ w, d, y }: { w: number; d: number; y: number }) {
  return (
    <mesh position={[0, y, 0]}>
      <boxGeometry args={[w, 0.07, d]} />
      <meshLambertMaterial color="#0B1C28" />
    </mesh>
  );
}

export function SkillionHouse() {
  const s = STYLES.br1;
  return (
    <group>
      <mesh position={[0, 1.25, -0.2]}>
        <boxGeometry args={[7.2, 2.5, 4.6]} />
        <meshLambertMaterial color={s.wall} />
      </mesh>
      <mesh position={[0, 2.7, -0.15]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[7.6, 0.18, 5.2]} />
        <meshLambertMaterial color={s.roof} />
      </mesh>
      <Solar w={5.2} d={2.8} y={2.95} />
      <mesh position={[0, 0.12, 2.45]}>
        <boxGeometry args={[7.2, 0.12, 2.0]} />
        <meshLambertMaterial color={s.accent} />
      </mesh>
      <mesh position={[0, 1.35, 2.12]}>
        <boxGeometry args={[2.8, 1.5, 0.08]} />
        <meshLambertMaterial color="#9EC8D6" />
      </mesh>
    </group>
  );
}

export function HipHouse() {
  const s = STYLES.br2;
  return (
    <group>
      <mesh position={[0, 1.35, 0.05]}>
        <boxGeometry args={[8.8, 2.7, 6.2]} />
        <meshLambertMaterial color={s.wall} />
      </mesh>
      <mesh position={[0, 2.85, 0.05]}>
        <boxGeometry args={[9.4, 0.55, 6.8]} />
        <meshLambertMaterial color={s.roof} />
      </mesh>
      <mesh position={[0, 3.2, 0.05]}>
        <boxGeometry args={[6.4, 0.35, 4.4]} />
        <meshLambertMaterial color={s.roof} />
      </mesh>
      <Solar w={4.6} d={3.2} y={3.45} />
      <mesh position={[0, 1.15, 3.45]}>
        <boxGeometry args={[4.2, 2.2, 1.2]} />
        <meshLambertMaterial color={s.wall} />
      </mesh>
      <mesh position={[0, 2.32, 3.45]}>
        <boxGeometry args={[4.6, 0.16, 1.5]} />
        <meshLambertMaterial color={s.roof} />
      </mesh>
      <mesh position={[0, 1.3, 4.08]}>
        <boxGeometry args={[2.4, 1.5, 0.08]} />
        <meshLambertMaterial color="#9EC8D6" />
      </mesh>
    </group>
  );
}

export function GableHouse() {
  const s = STYLES.br3;
  return (
    <group>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[9.8, 2.8, 6.6]} />
        <meshLambertMaterial color={s.wall} />
      </mesh>
      <mesh position={[0, 3.05, 0]} rotation={[0, 0, 0.32]}>
        <boxGeometry args={[5.4, 0.18, 7.0]} />
        <meshLambertMaterial color={s.roof} />
      </mesh>
      <mesh position={[0, 3.05, 0]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[5.4, 0.18, 7.0]} />
        <meshLambertMaterial color={s.roof} />
      </mesh>
      <Solar w={5.6} d={3.0} y={3.35} />
      <mesh position={[0, 0.12, 3.85]}>
        <boxGeometry args={[8.0, 0.12, 1.8]} />
        <meshLambertMaterial color={s.accent} />
      </mesh>
      <mesh position={[0, 1.35, 3.32]}>
        <boxGeometry args={[3.2, 1.6, 0.08]} />
        <meshLambertMaterial color="#9EC8D6" />
      </mesh>
    </group>
  );
}

export function HouseByStyle({ id }: { id: StyleId }) {
  if (id === "br1") return <SkillionHouse />;
  if (id === "br2") return <HipHouse />;
  return <GableHouse />;
}

export function Pavilion() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 0.18, 20]} />
        <meshLambertMaterial color="#C9C2A8" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 5.2, 1.5, Math.sin(a) * 5.2]}>
            <cylinderGeometry args={[0.16, 0.16, 3.0, 6]} />
            <meshLambertMaterial color="#E8E2D4" />
          </mesh>
        );
      })}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.2, 6.6, 1.2, 6]} />
        <meshLambertMaterial color="#2A2C28" />
      </mesh>
    </group>
  );
}
