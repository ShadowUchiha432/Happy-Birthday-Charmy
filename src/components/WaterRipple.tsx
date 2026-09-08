import { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  lineWidth: number;
  hue: number;
}

export default function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, lastX: -1000, lastY: -1000 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addRipple = (x: number, y: number, strong = false) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: strong ? 100 + Math.random() * 60 : 25 + Math.random() * 35,
        alpha: strong ? 0.35 : 0.15,
        lineWidth: strong ? 1.5 : 0.8,
        hue: strong ? 270 + Math.random() * 30 : 260 + Math.random() * 40,
      });
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const mx = mouseRef.current;
      const dx = clientX - mx.lastX;
      const dy = clientY - mx.lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 24) {
        addRipple(clientX, clientY, false);
        mx.lastX = clientX;
        mx.lastY = clientY;
      }
      mx.x = clientX;
      mx.y = clientY;
    };

    const handleTap = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      addRipple(clientX, clientY, true);
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          addRipple(
            clientX + (Math.random() - 0.5) * 50,
            clientY + (Math.random() - 0.5) * 50,
            false
          );
        }, i * 100);
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleTap);
    window.addEventListener("touchstart", handleTap, { passive: true });

    const handleTouchEnd = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    let time = 0;
    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep purple gradient base
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, "#2e1065");
      gradient.addColorStop(0.45, "#4c1d95");
      gradient.addColorStop(0.75, "#581c87");
      gradient.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Soft flowing waves
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        const amplitude = 10 + i * 6;
        const frequency = 0.0015 + i * 0.0003;
        const speed = time * (0.3 + i * 0.12);
        for (let x = 0; x <= canvas.width; x += 24) {
          const y =
            canvas.height * 0.6 +
            Math.sin(x * frequency + speed + i) * amplitude +
            Math.sin(x * 0.003 - speed * 0.5 + i * 2) * (amplitude * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = `rgba(167, 139, 250, ${0.025 + i * 0.008})`;
        ctx.fill();
      }
      ctx.restore();

      // Soft cursor glow
      const mx = mouseRef.current;
      if (mx.x > -100) {
        const isMobile = window.innerWidth < 768;
        const glowRadius = isMobile ? 100 : 160;
        const glow = ctx.createRadialGradient(mx.x, mx.y, 0, mx.x, mx.y, glowRadius);
        glow.addColorStop(0, "rgba(216, 180, 254, 0.14)");
        glow.addColorStop(0.4, "rgba(168, 85, 247, 0.07)");
        glow.addColorStop(0.75, "rgba(88, 28, 135, 0.02)");
        glow.addColorStop(1, "rgba(88, 28, 135, 0)");
        ctx.fillStyle = glow;
        ctx.globalCompositeOperation = "screen";
        ctx.beginPath();
        ctx.arc(mx.x, mx.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // Ripples — expand slowly, fade gently
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.radius += (r.maxRadius - r.radius) * 0.025 + 0.3;
        r.alpha -= 0.002;
        if (r.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue}, 70%, 70%, ${r.alpha})`;
        ctx.lineWidth = r.lineWidth;
        ctx.stroke();

        // Soft inner glow
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue + 15}, 80%, 80%, ${r.alpha * 0.4})`;
        ctx.lineWidth = r.lineWidth * 0.4;
        ctx.stroke();

        return true;
      });
      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mousedown", handleTap);
      window.removeEventListener("touchstart", handleTap);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-1"
      aria-hidden="true"
    />
  );
}
