import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Lenis smooth scroll sincronizado com o GSAP ScrollTrigger.
 * Só roda no cliente (useEffect) para não quebrar o SSR.
 */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const onRaf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onRaf);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      cleanup = () => {
        gsap.ticker.remove(onRaf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pathname]);

  return null;
}
