import { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls, Float } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import CountUp from '../common/CountUp';
import styles from '../../styles/sections/HeroSection.module.css';

function CarModel({ started }) {
  const group = useRef();
  const { scene } = useGLTF(
    'https://threejs.org/examples/models/gltf/ferrari.glb'
  );
  const wheelsRef = useRef([]);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (
          name.includes('body') ||
          name.includes('hood') ||
          name.includes('chassis') ||
          name.includes('car')
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x0a0a0a),
            metalness: 0.95,
            roughness: 0.05,
            envMapIntensity: 1.8,
          });
        }
        if (name.includes('glass') || name.includes('window') || name.includes('windshield')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x334455),
            metalness: 0.1,
            roughness: 0,
            transparent: true,
            opacity: 0.35,
            envMapIntensity: 2,
          });
        }
        if (name.includes('wheel') || name.includes('tire') || name.includes('tyre')) {
          wheelsRef.current.push(child);
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x111111),
            metalness: 0.2,
            roughness: 0.8,
          });
        }
        if (name.includes('rim') || name.includes('spoke')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xcccccc),
            metalness: 0.9,
            roughness: 0.1,
          });
        }
        if (name.includes('interior') || name.includes('seat') || name.includes('steering')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x1a1a1a),
            metalness: 0.3,
            roughness: 0.7,
          });
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  useFrame(() => {
    if (!group.current || !started) return;
    const t = clock.current.getElapsedTime();
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x = t * 1.5;
    });
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.1} position={[0, -0.35, 0]} />
    </group>
  );
} function FallbackCar() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.8, 0.55, 1.7]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0.1, 0.5, 0]} castShadow>
        <boxGeometry args={[2.0, 0.5, 1.55]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.52, 0]}>
        <boxGeometry args={[1.8, 0.4, 1.56]} />
        <meshStandardMaterial color="#334455" transparent opacity={0.4} metalness={0.1} roughness={0} />
      </mesh>
      {[[-1.3, -0.28, 0.92], [1.3, -0.28, 0.92], [-1.3, -0.28, -0.92], [1.3, -0.28, -0.92]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.33, 0.33, 0.22, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.2} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
} function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#4488ff" />
      <pointLight position={[0, 6, 0]} intensity={0.6} color="#ffffff" />
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
} const STATS = [
  { value: 500, suffix: '+', label: 'Vehicles' },
  { value: 50, suffix: '+', label: 'BMW Models' },
  { value: 15, suffix: '', label: 'Years Exp.' },
  { value: 4.9, suffix: '', label: 'Rating', decimals: 1 },
]; export default function HeroSection({ onExploreClick }) {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [glbError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const carY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.hero} ref={containerRef} id="hero">

      <div className={styles.bgRadial} />
      <div className={styles.bgGrid} />

      <motion.div
        className={styles.canvasWrapper}
        style={{ y: carY, opacity: heroOpacity }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.5, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
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
              autoRotateSpeed={0.8}
            />
            <Float
              speed={1.5}
              rotationIntensity={0.1}
              floatIntensity={0.2}
              floatingRange={[-0.04, 0.04]}
            >
              {!glbError ? (
                <CarModel started={started} />
              ) : (
                <FallbackCar />
              )}
            </Float>
          </Suspense>

          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.45}
            scale={12}
            blur={2.5}
            far={4}
            color="#000000"
          />

          <Environment preset="city" />
        </Canvas>
      </motion.div>
      <motion.div
        className={styles.content}
        style={{ y: textY }}
      >
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
        </motion.div>
        <div className={styles.headlines}>
          <motion.p
            className={styles.subHeadline1}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Experience Precision Engineering
          </motion.p>

          <motion.p
            className={styles.subHeadline2}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            Drive Beyond Ordinary
          </motion.p>
        </div>
        <motion.div
          className={styles.ctaGroup}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.button
            className={`btn btn-primary ${styles.ctaPrimary}`}
            onClick={onExploreClick}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            id="hero-explore-btn"
          >
            Explore Inventory
            <span className={styles.ctaArrow}>→</span>
          </motion.button>
          <motion.button
            className={`btn btn-glass ${styles.ctaSecondary}`}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            id="hero-testdrive-btn"
          >
            Book Test Drive
          </motion.button>
        </motion.div>
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          {STATS.map(({ value, suffix, label, decimals }, i) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statValue}>
                <CountUp end={value} start={started} suffix={suffix} decimals={decimals || 0} duration={2000 + i * 200} />
              </span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
      >
        <motion.div
          className={styles.scrollDot}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
        <span className={styles.scrollLabel}>Scroll</span>
      </motion.div>
    </section>
  );
}
