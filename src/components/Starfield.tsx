import React, { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{ x: number; y: number; radius: number; alpha: number; speed: number }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const density = Math.floor((canvas.width * canvas.height) / 8000); // Responsive density
      const maxStars = Math.min(density, 150);

      for (let i = 0; i < maxStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    const drawStars = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.speed;

        // Twinkle effect (ping-pong alpha)
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }

        // Keep alpha within bounds
        const alpha = Math.max(0.1, Math.min(star.alpha, 0.8));

        // Use elegant gold/white colored stars matching the theme
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        // Golden accent or soft warm white stars
        if (i % 5 === 0) {
          ctx.fillStyle = `rgba(217, 180, 92, ${alpha})`; // Gold stars
        } else {
          ctx.fillStyle = `rgba(243, 236, 216, ${alpha})`; // Warm white stars
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    drawStars();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
