import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { STORE, waLink } from "@/lib/store-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl text-primary text-3d">404</h1>
        <h2 className="mt-4 text-xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Essa página saiu do cardápio. Volta pro início e monta seu pedido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-neon inline-flex rounded-full px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em]"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente recarregar. Se continuar, chame no WhatsApp que a gente anota seu pedido.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-neon rounded-full px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em]"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-foreground hover:border-primary"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MRBURGUER01 — O Artesanal Irresistível | Delivery Abaré-BA" },
      {
        name: "description",
        content:
          "Hamburgueria artesanal só delivery em Abaré-BA. Blend na brasa, cheddar derretido e entrega quentinha. Peça em minutos.",
      },
      { name: "author", content: "MRBURGUER01" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;600;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
        <p className="font-display text-2xl">
          {STORE.name}
          <span className="align-super text-[0.5em] text-primary">™</span>
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {STORE.slogan}
        </p>
        <p className="text-sm text-muted-foreground">
          Apenas delivery 🍔✨ · {STORE.city}
        </p>
        <div className="flex gap-4 text-sm">
          <a href={STORE.instagramUrl} target="_blank" rel="noreferrer" className="text-primary">
            {STORE.instagram}
          </a>
          <a href={waLink("Olá! Quero pedir 🍔")} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SmoothScroll />
        <SiteNav />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="pt-16">
          <Outlet />
        </main>
        <SiteFooter />
        <CartDrawer />
      </CartProvider>
    </QueryClientProvider>
  );
}
