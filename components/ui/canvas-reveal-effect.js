"use client";
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const CanvasRevealEffect = ({
  animationSpeed = 3,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[249, 115, 22]], // Default theme orange
  dotSize = 1.5,
  containerClassName,
}) => {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, isHovered: false });

  // Monitor mouse interaction with the parent element
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement?.parentElement; // Access container parent
    if (!parent) return;

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovered: true,
      });
    };

    const handleMouseEnter = () => {
      setMouse((prev) => ({ ...prev, isHovered: true }));
    };

    const handleMouseLeave = () => {
      setMouse((prev) => ({ ...prev, isHovered: false }));
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Canvas render logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const gap = 15; // Grid spacing
    let tick = 0;

    const render = () => {
      if (!canvas || !ctx) return;
      tick += animationSpeed * 0.015;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap + gap / 2;
          const y = j * gap + gap / 2;

          let targetOpacity = 0.03; // Base default opacity
          let size = dotSize;

          if (mouse.isHovered) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Radius of reveal: 90px
            const maxDist = 90;
            if (dist < maxDist) {
              const factor = 1 - dist / maxDist;
              // Add a sparkling shimmer ripple
              const shimmer = Math.sin(tick + (i * 3 + j * 5)) * 0.12 + 0.88;
              targetOpacity = 0.03 + factor * 0.7 * shimmer;
              size = dotSize + factor * 1.2;
            }
          }

          // Cycle or pick colors dynamically
          const colorIdx = Math.floor((i + j + Math.floor(tick * 0.5)) % colors.length);
          const rgb = colors[colorIdx] || [249, 115, 22];

          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${targetOpacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouse, colors, dotSize, animationSpeed]);

  return (
    <div className={cn("h-full w-full relative overflow-hidden", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full absolute inset-0 block pointer-events-none"
      />
    </div>
  );
};
