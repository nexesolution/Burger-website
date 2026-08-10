import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export const BurgerScrollExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Framer Motion scroll tracking over sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 26,
    restDelta: 0.001
  });

  // Scale and vertical separation for fallback image layers
  const topBunY = useTransform(smoothProgress, [0, 1], [0, -140]);
  const sauceY = useTransform(smoothProgress, [0, 1], [0, -90]);
  const baconY = useTransform(smoothProgress, [0, 1], [0, -45]);
  const patty1Y = useTransform(smoothProgress, [0, 1], [0, 0]);
  const lettuceY = useTransform(smoothProgress, [0, 1], [0, 45]);
  const patty2Y = useTransform(smoothProgress, [0, 1], [0, 90]);
  const bottomBunY = useTransform(smoothProgress, [0, 1], [0, 140]);

  // Handle Video Metadata & Loaded Event
  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 1);
      setIsVideoLoaded(true);
    }
  };

  // Sync scroll progress directly with Video CurrentTime
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();

      const unsubscribe = smoothProgress.on('change', (latest) => {
        if (video.duration) {
          // Frame-accurate currentTime update bound strictly to scroll progress
          const targetTime = Math.min(
            video.duration - 0.05,
            Math.max(0, latest * video.duration)
          );
          video.currentTime = targetTime;
        }
      });

      return () => unsubscribe();
    }
  }, [smoothProgress]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-buzz-black text-white">
      {/* Sticky full-screen viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background glow ambient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-buzz-yellow/15 via-buzz-black to-buzz-black pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Minimal Headline Header */}
        <div className="absolute top-10 text-center z-20 space-y-2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-yellow text-buzz-yellow text-xs md:text-sm font-black uppercase tracking-widest shadow-buzz-glow"
          >
            <Sparkles className="w-4 h-4" /> Cinematic Unfolding
          </motion.div>

          <h2 className="text-3xl md:text-6xl font-black font-display tracking-tight text-white">
            WATCH IT <span className="text-buzz-yellow text-gradient-yellow">UNFOLD</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto font-medium">
            Scroll down to open the burger. Scroll up to close it into a complete burger.
          </p>
        </div>

        {/* Main Video or Sliced Fallback Viewport */}
        <div className="relative w-full max-w-3xl aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center z-10 pt-16">
          {/* Primary MP4 Video Player tied to scroll */}
          <video
            ref={videoRef}
            src="/assets/burger-opening.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoaded}
            onLoadedMetadata={handleVideoLoaded}
            className={`w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(245,196,0,0.25)] transition-opacity duration-500 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
          />

          {/* High-Resolution Backup Image Layer Stack if video is loading */}
          {!isVideoLoaded && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-72 sm:w-96 h-[420px] flex items-center justify-center">
                {/* Top Bun */}
                <motion.div
                  style={{ y: topBunY }}
                  className="absolute z-40 w-full h-24 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Top Bun"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 5%' }}
                  />
                </motion.div>

                {/* Sauce Layer */}
                <motion.div
                  style={{ y: sauceY }}
                  className="absolute z-35 w-full h-16 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Special Sauce"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 25%' }}
                  />
                </motion.div>

                {/* Bacon Layer */}
                <motion.div
                  style={{ y: baconY }}
                  className="absolute z-30 w-full h-16 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Crispy Bacon"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 40%' }}
                  />
                </motion.div>

                {/* Main Smash Patty 1 */}
                <motion.div
                  style={{ y: patty1Y }}
                  className="absolute z-25 w-full h-20 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Angus Patty 1"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 55%' }}
                  />
                </motion.div>

                {/* Lettuce Layer */}
                <motion.div
                  style={{ y: lettuceY }}
                  className="absolute z-20 w-full h-16 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Green Lettuce"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 70%' }}
                  />
                </motion.div>

                {/* Patty 2 */}
                <motion.div
                  style={{ y: patty2Y }}
                  className="absolute z-15 w-full h-20 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Angus Patty 2"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 82%' }}
                  />
                </motion.div>

                {/* Bottom Bun */}
                <motion.div
                  style={{ y: bottomBunY }}
                  className="absolute z-10 w-full h-20 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                >
                  <img
                    src="/assets/burger-opening.png"
                    alt="Bottom Bun"
                    className="w-full h-[420px] object-cover"
                    style={{ objectPosition: '50% 95%' }}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Scroll Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono font-bold tracking-wider">
            <span>CLOSED</span>
            <div className="w-48 sm:w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
              <motion.div
                style={{ scaleX: smoothProgress }}
                className="h-full bg-buzz-yellow origin-left shadow-buzz-glow"
              />
            </div>
            <span>OPEN</span>
          </div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-1.5 text-xs text-buzz-yellow font-extrabold tracking-wide"
          >
            <ChevronDown className="w-4 h-4" /> Scroll down to open • Scroll up to close
          </motion.div>
        </div>
      </div>
    </section>
  );
};
