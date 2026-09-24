import React, { useEffect, useRef } from 'react';

export type LiveEffectType = 'none' | 'sakura' | 'cyber_rain' | 'embers' | 'stars';

interface LiveWallpaperCanvasProps {
  effect: LiveEffectType;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation?: number;
  rotationSpeed?: number;
  color?: string;
}

export const LiveWallpaperCanvas: React.FC<LiveWallpaperCanvasProps> = ({ effect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles based on effect
    const particles: Particle[] = [];
    const count = effect === 'cyber_rain' ? 65 : effect === 'sakura' ? 35 : 45;

    for (let i = 0; i < count; i++) {
      if (effect === 'sakura') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 8 + 6,
          speedY: Math.random() * 1.5 + 1.0,
          speedX: Math.random() * 1.2 - 0.4,
          opacity: Math.random() * 0.7 + 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 2 - 1,
        });
      } else if (effect === 'cyber_rain') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 18 + 10,
          speedY: Math.random() * 12 + 10,
          speedX: 0,
          opacity: Math.random() * 0.8 + 0.2,
          color: Math.random() > 0.4 ? '#00F2FE' : '#FF4D8D',
        });
      } else if (effect === 'embers') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 1.5,
          speedY: -(Math.random() * 1.8 + 0.8), // float upward
          speedX: (Math.random() - 0.5) * 1.0,
          opacity: Math.random() * 0.8 + 0.2,
          color: Math.random() > 0.5 ? '#FF8C00' : '#FFD700',
        });
      } else if (effect === 'stars') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 1,
          speedY: (Math.random() - 0.5) * 0.2,
          speedX: (Math.random() - 0.5) * 0.2,
          opacity: Math.random(),
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (effect === 'sakura') {
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }

          if (p.y > height + 20) p.y = -20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          // Draw cherry petal
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(((p.rotation || 0) * Math.PI) / 180);
          ctx.fillStyle = `rgba(255, 183, 197, ${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (effect === 'cyber_rain') {
          p.y += p.speedY;
          if (p.y > height + 40) {
            p.y = -40;
            p.x = Math.random() * width;
          }

          ctx.strokeStyle = p.color || '#00F2FE';
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        } else if (effect === 'embers') {
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.fillStyle = p.color || '#FF8C00';
          ctx.shadowColor = p.color || '#FF8C00';
          ctx.shadowBlur = 8;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        } else if (effect === 'stars') {
          p.opacity += (Math.random() - 0.5) * 0.05;
          if (p.opacity < 0.1) p.opacity = 0.1;
          if (p.opacity > 1) p.opacity = 1;

          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#00F2FE';
          ctx.shadowBlur = 6;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
