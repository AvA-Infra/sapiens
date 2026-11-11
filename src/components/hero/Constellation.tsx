"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DIST = 130;
const MOUSE_DIST = 170;

/**
 * Rede de pontos em canvas 2D. Os pontos derivam devagar, ligam-se quando próximos e são atraídos
 * pelo cursor. A cor vem da variável CSS --net-rgb (azul no tema claro, ciano claro no escuro) e
 * muda sozinha quando o tema muda. Pausa fora da tela e com a aba oculta; com prefers-reduced-motion
 * desenha um único quadro estático.
 */
export default function Constellation({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let visible = true;
    let rgb = "4,78,149";
    const mouse = { x: -9999, y: -9999 };

    const readColor = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--net-rgb").trim();
      if (v) rgb = v.split(/\s+/).join(",");
      if (reduced) draw();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Menos pontos em telas pequenas: mantém 60fps em celular intermediário.
      const count = Math.round(Math.min(70, Math.max(22, (w * h) / 16000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.9,
      }));
      // Redimensionar apaga o canvas; sem animação, redesenha o quadro estático.
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -10) d.x = w + 10;
          else if (d.x > w + 10) d.x = -10;
          if (d.y < -10) d.y = h + 10;
          else if (d.y > h + 10) d.y = -10;
          const mx = mouse.x - d.x;
          const my = mouse.y - d.y;
          const md = Math.hypot(mx, my);
          if (md < MOUSE_DIST && md > 1) {
            const pull = (1 - md / MOUSE_DIST) * 0.35;
            d.x += (mx / md) * pull;
            d.y += (my / md) * pull;
          }
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - dist / LINK_DIST) * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Linhas do cursor até pontos próximos
        const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (md < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - md / MOUSE_DIST) * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb},0.75)`;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (visible && !document.hidden) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    readColor();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    // Troca de tema: relê a cor.
    const themeObs = new MutationObserver(readColor);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    if (!reduced) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
