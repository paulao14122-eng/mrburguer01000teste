import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Flame, Star, Truck, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/lib/cart";
import { MENU } from "@/lib/menu";
import { STORE, brl, waLink } from "@/lib/store-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MRBURGUER01 — O Artesanal Irresistível | Delivery Abaré-BA" },
      {
        name: "description",
        content:
          "Hambúrguer artesanal na brasa com entrega em Abaré-BA. Monte seu pedido, pague no PIX e receba quentinho.",
      },
      {
        property: "og:title",
        content: "MRBURGUER01 — O Artesanal Irresistível",
      },
      {
        property: "og:description",
        content: "Apenas delivery em Abaré-BA. Blend na brasa, cheddar derretido e molho da casa.",
      },
    ],
  }),
  component: Home,
});

const BENEFITS = [
  "Blend artesanal feito na brasa na hora",
  "Entrega rápida em toda Abaré - BA",
  "Pague no PIX direto pelo site",
  "Adicionais de bacon e cheddar extra",
];

const REVIEWS = [
  {
    name: "Jéssica S.",
    text: "Melhor burger de Abaré, sem exagero. O MR. CORONEL é viciante e chegou quentinho.",
  },
  {
    name: "Rafael M.",
    text: "Pedi pelo site, paguei no PIX e em pouco tempo estava na porta. Atendimento nota 10.",
  },
  {
    name: "Camila A.",
    text: "O cheddar derretido é surreal. Já virou o pedido fixo de sexta aqui em casa.",
  },
];

function Home() {
  const { add } = useCart();
  const heroImgRef = useRef<HTMLImageElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const pinImgRef = useRef<HTMLImageElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Hero: burger gira e sobe suavemente conforme o scroll
        if (heroImgRef.current) {
          gsap.to(heroImgRef.current, {
            rotate: 28,
            scale: 1.08,
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: heroImgRef.current,
              start: "top 80%",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        // Cardápio: seção fixa (pin) e o burger gira trocando de item
        if (pinSectionRef.current && pinImgRef.current) {
          gsap.to(pinImgRef.current, {
            rotate: 360,
            ease: "none",
            scrollTrigger: {
              trigger: pinSectionRef.current,
              start: "top top",
              end: `+=${MENU.length * 100}%`,
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const idx = Math.min(
                  MENU.length - 1,
                  Math.floor(self.progress * MENU.length),
                );
                setActiveIndex(idx);
              },
            },
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      });

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const active = MENU[activeIndex]!;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="glow-ring relative order-2 flex justify-center lg:order-1">
            <img
              ref={heroImgRef}
              src={MENU[0]!.image}
              alt="Hambúrguer artesanal MR. CORONEL com cheddar derretido"
              width={1024}
              height={1024}
              className="w-full max-w-[560px] drop-shadow-[0_40px_60px_rgba(0,0,0,0.75)]"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              <Flame className="size-3.5" /> {STORE.city} · Apenas delivery
            </p>
            <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] text-3d">
              O ARTESANAL
              <br />
              IRRESISTÍVEL
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">Apenas delivery 🍔✨</p>

            <ul className="mt-7 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </span>
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#cardapio"
                className="btn-neon rounded-full px-7 py-4 text-sm font-extrabold uppercase tracking-[0.14em]"
              >
                Montar meu pedido
              </a>
              <a
                href={waLink("Olá! Quero pedir no MRBURGUER01 🍔")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-7 py-4 text-sm font-extrabold uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border bg-secondary/30 py-4">
        <div className="marquee-track font-display text-2xl uppercase text-muted-foreground sm:text-3xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex">
              {["Na brasa", "Blend artesanal", "Só delivery", "Abaré - BA", "Chega quentinho"].map(
                (t) => (
                  <span key={t} className="mx-6 flex items-center gap-6">
                    {t} <span className="text-primary">•</span>
                  </span>
                ),
              )}
            </span>
          ))}
        </div>
      </div>

      {/* CARDÁPIO COM PIN SCROLL */}
      <section id="cardapio" ref={pinSectionRef} className="relative overflow-hidden">
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="glow-ring relative flex justify-center">
            <img
              ref={pinImgRef}
              key={active.id}
              src={active.image}
              alt={`Hambúrguer ${active.name}`}
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full max-w-[480px] drop-shadow-[0_40px_60px_rgba(0,0,0,0.75)]"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Cardápio · {activeIndex + 1}/{MENU.length}
            </p>
            <h2 className="mt-3 text-[clamp(2.25rem,6vw,4.5rem)] text-3d">{active.name}</h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              {active.tagline}
            </p>
            <p className="mt-5 max-w-md text-base text-muted-foreground">{active.description}</p>
            <p className="mt-7 font-display text-4xl text-primary">{brl(active.price)}</p>
            <button
              type="button"
              onClick={() => add(active)}
              className="btn-neon mt-6 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em]"
            >
              Adicionar ao pedido
            </button>

            <div className="mt-10 flex gap-2">
              {MENU.map((item, i) => (
                <span
                  key={item.id}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i === activeIndex ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Continue rolando para ver os outros
            </p>
          </div>
        </div>
      </section>

      {/* LISTA COMPLETA (mobile friendly / conversão) */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-[clamp(2rem,5vw,3.5rem)]" data-reveal>
            Todos os burgers
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MENU.map((item) => (
              <article
                key={item.id}
                data-reveal
                className="rounded-2xl border border-border bg-card p-5 text-center transition-colors hover:border-primary/60"
              >
                <img
                  src={item.image}
                  alt={`Hambúrguer ${item.name}`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="mx-auto w-full max-w-[220px] float-soft"
                />
                <h3 className="mt-4 text-xl">{item.name}</h3>
                <p className="mt-2 min-h-[60px] text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-3 font-display text-2xl text-primary">{brl(item.price)}</p>
                <button
                  type="button"
                  onClick={() => add(item)}
                  className="btn-neon mt-4 w-full rounded-full py-3 text-xs font-extrabold uppercase tracking-[0.14em]"
                >
                  Adicionar
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="border-y border-border bg-secondary/20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-[clamp(2rem,5vw,3.5rem)]" data-reveal>
            Como funciona
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { icon: UtensilsCrossed, title: "Você pede no site", n: "01" },
              { icon: Flame, title: "A gente faz na brasa na hora", n: "02" },
              { icon: Truck, title: "Chega quentinho aí", n: "03" },
            ].map(({ icon: Icon, title, n }) => (
              <div key={n} data-reveal className="text-center">
                <Icon className="mx-auto size-8 text-primary" />
                <p className="mt-4 font-display text-5xl text-outline">{n}</p>
                <h3 className="mt-3 text-xl">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div
            data-reveal
            className="rounded-3xl border border-border bg-card p-8 text-center"
          >
            <p className="font-display text-3xl">{STORE.instagram}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              578 seguidores apaixonados · Apenas delivery 🍔✨
            </p>
            <a
              href={STORE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-neon mt-6 inline-flex rounded-full px-7 py-3 text-xs font-extrabold uppercase tracking-[0.14em]"
            >
              Seguir no Instagram
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <blockquote
                key={r.name}
                data-reveal
                className="rounded-2xl border border-border bg-secondary/30 p-6"
              >
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">"{r.text}"</p>
                <footer className="mt-4 text-xs font-bold uppercase tracking-[0.2em]">
                  {r.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 pb-24 sm:px-6">
        <div
          data-reveal
          className="mx-auto max-w-4xl rounded-3xl border border-primary/40 bg-secondary/30 p-10 text-center"
        >
          <h2 className="text-[clamp(2rem,6vw,4rem)] text-3d">Bateu a fome?</h2>
          <p className="mt-4 text-muted-foreground">
            Monte seu pedido, pague no PIX e receba quentinho em {STORE.city}.
          </p>
          <a
            href="#cardapio"
            className="btn-neon mt-8 inline-flex rounded-full px-9 py-4 text-sm font-extrabold uppercase tracking-[0.14em]"
          >
            Pedir agora
          </a>
        </div>
      </section>
    </>
  );
}
