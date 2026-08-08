import { useEffect, useRef } from "react";

const frameModules = import.meta.glob("../assets/pushup_frames/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const FRAME_URLS = Object.keys(frameModules)
  .sort(
    (a, b) =>
      Number(a.match(/\d+/)?.[0] ?? 0) - Number(b.match(/\d+/)?.[0] ?? 0)
  )
  .map((key) => frameModules[key]);

const EASE = 0.2;
const CONCURRENCY = 14;

export const ScrollBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const statusRef = useRef<number[]>([]); // 0 loading, 1 ok, 2 error
  const targetRef = useRef(0); // scroll-derived target frame (float)
  const shownRef = useRef(0); // eased frame currently displayed (float)

  // Draw the frame closest to the displayed position that is actually loaded,
  // so the animation fills in progressively while preloading.
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const target = Math.round(shownRef.current);
    if (target < 0) return;
    let index = target;
    while (index >= 0 && statusRef.current[index] !== 1) index -= 1;
    if (index < 0) return;
    const img = framesRef.current[index];
    if (!img || !img.naturalWidth) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = canvas.width / dpr;
    const vh = canvas.height / dpr;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const viewRatio = vw / vh;

    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;
    if (imgRatio > viewRatio) {
      sw = sh * viewRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = sw / viewRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = FRAME_URLS.length;
    statusRef.current = new Array(count).fill(0);
    framesRef.current = new Array(count).fill(null);
    targetRef.current = 0;
    shownRef.current = 0;
    let cancelled = false;
    let rafId = 0;

    const resize = () => {
      if (window.innerWidth === 0 || window.innerHeight === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));
      draw();
    };

    const updateFromScroll = () => {
      const doc = document.documentElement;
      const max =
        Math.max(doc.scrollHeight, document.body.scrollHeight) - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      targetRef.current = progress * (count - 1);
    };

    // Eased scrub loop: frames glide toward the scroll target and stop when idle.
    const tick = () => {
      const diff = targetRef.current - shownRef.current;
      if (Math.abs(diff) <= 0.05) {
        shownRef.current = targetRef.current;
      } else {
        shownRef.current += diff * EASE;
      }
      draw();
      if (Math.abs(targetRef.current - shownRef.current) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        shownRef.current = targetRef.current;
        draw();
        rafId = 0;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateFromScroll();
        if (!rafId) rafId = requestAnimationFrame(tick);
      });
    };

    resize();
    updateFromScroll();
    rafId = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", resize);
    window.visualViewport?.addEventListener("resize", resize);

    // Progressive preloader: once a frame in the visible range is ready,
    // redraw so the scrub catches up in real time.
    let next = 0;
    let active = 0;
    const loadNext = () => {
      if (cancelled) return;
      while (active < CONCURRENCY && next < count) {
        const i = next++;
        const img = new Image();
        img.decoding = "async";
        const onDone = (ok: boolean) => {
          if (cancelled) return;
          statusRef.current[i] = ok ? 1 : 2;
          active -= 1;
          if (i <= Math.round(shownRef.current)) draw();
          loadNext();
        };
        img.onload = () => onDone(true);
        img.onerror = () => onDone(false);
        img.src = FRAME_URLS[i];
        framesRef.current[i] = img;
        active += 1;
      }
    };
    loadNext();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      for (const img of framesRef.current) {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: "contrast(1.08) saturate(1.1)" }}
      />
      <div className="absolute inset-0 bg-[#050505]/25" />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 220px 70px rgba(0, 0, 0, 0.35)" }}
      />
    </div>
  );
};
