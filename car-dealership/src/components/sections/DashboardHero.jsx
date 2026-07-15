import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
  Float,
} from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Car, Package, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useApp } from "../../store/AppContext";
import styles from "../../styles/sections/DashboardHero.module.css";

function CarModel({ started }) {
  const group = useRef();
  const { scene } = useGLTF(
    "https://threejs.org/examples/models/gltf/ferrari.glb",
  );
  const wheelsRef = useRef([]);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const name = child.name.toLowerCase();
      if (
        name.includes("body") ||
        name.includes("hood") ||
        name.includes("chassis") ||
        name.includes("car")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x0a0a0a),
          metalness: 0.95,
          roughness: 0.05,
          envMapIntensity: 1.8,
        });
      }
      if (
        name.includes("glass") ||
        name.includes("window") ||
        name.includes("windshield")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x334455),
          metalness: 0.1,
          roughness: 0,
          transparent: true,
          opacity: 0.35,
        });
      }
      if (
        name.includes("wheel") ||
        name.includes("tire") ||
        name.includes("tyre")
      ) {
        wheelsRef.current.push(child);
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x111111),
          metalness: 0.2,
          roughness: 0.8,
        });
      }
      if (name.includes("rim") || name.includes("spoke")) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xcccccc),
          metalness: 0.9,
          roughness: 0.1,
        });
      }
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [scene]);

  useFrame(() => {
    if (!started) return;
    const t = clock.current.getElapsedTime();
    wheelsRef.current.forEach((w) => {
      w.rotation.x = t * 1.5;
    });
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.1} position={[0, -0.35, 0]} />
    </group>
  );
}

function FallbackCar() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current)
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });
  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.8, 0.55, 1.7]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0.1, 0.5, 0]} castShadow>
        <boxGeometry args={[2.0, 0.5, 1.55]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      {[
        [-1.3, -0.28, 0.92],
        [1.3, -0.28, 0.92],
        [-1.3, -0.28, -0.92],
        [1.3, -0.28, -0.92],
      ].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.33, 0.33, 0.22, 32]} />
          <meshStandardMaterial
            color="#111111"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.4}
        color="#4488ff"
      />
      <pointLight position={[0, 6, 0]} intensity={0.6} />
      <spotLight
        position={[0, 8, 4]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        castShadow
      />
      <pointLight position={[-4, 1, -2]} intensity={0.8} color="#0066ff" />
      <pointLight position={[4, 1, -2]} intensity={0.4} color="#0044cc" />
    </>
  );
}

export default function DashboardHero() {
  const { currentUser, vehicles, totalRevenue } = useApp();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  const totalStock = vehicles.reduce((s, v) => s + (v.stock ?? 0), 0);
  const soldOut = vehicles.filter((v) => v.stock === 0).length;

  const stats = [
    {
      icon: Car,
      label: "Total Models",
      value: vehicles.length,
      color: "#3b82f6",
    },
    { icon: Package, label: "In Stock", value: totalStock, color: "#10b981" },
    {
      icon: TrendingUp,
      label: "Revenue",
      value: `$${(totalRevenue || 0).toLocaleString()}`,
      color: "#f59e0b",
    },
    { icon: Users, label: "Sold Out", value: soldOut, color: "#ef4444" },
  ];

  const firstName = currentUser?.name?.split(" ")[0] || "Admin";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className={styles.hero}>
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.inner}>
        {/* Left - Greeting + Stats */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ShieldCheck size={13} />
            Admin Dashboard
          </motion.div>

          <motion.div
            className={styles.greetBlock}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p className={styles.greetSub}>{greeting},</p>
            <h1 className={styles.greetName}>{firstName} </h1>
            <p className={styles.greetDesc}>
              Manage your fleet, track performance, and keep inventory sharp.
            </p>
          </motion.div>

          <div className={styles.statsGrid}>
            {stats.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <span
                  className={styles.statIcon}
                  style={{ color, background: `${color}22` }}
                >
                  <Icon size={16} />
                </span>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.canvasWrap}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.1,
            ease: [0.5, 0, 0.2, 1],
            delay: 0.15,
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 6], fov: 45 }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
            }}
            dpr={[1, 2]}
          >
            <SceneLighting />
            <Suspense fallback={<FallbackCar />}>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2 - 0.05}
                autoRotate
                autoRotateSpeed={1.2}
              />
              <Float
                speed={1.5}
                rotationIntensity={0.08}
                floatIntensity={0.18}
                floatingRange={[-0.03, 0.03]}
              >
                <CarModel started={started} />
              </Float>
            </Suspense>
            <ContactShadows
              position={[0, -0.95, 0]}
              opacity={0.5}
              scale={12}
              blur={2.5}
              far={4}
              color="#000000"
            />
            <Environment preset="city" />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
