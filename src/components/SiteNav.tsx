import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { STORE, waLink } from "@/lib/store-config";

export function SiteNav() {
  const { count, setOpen } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="border-b border-border/50 bg-primary/10">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary sm:text-xs">
          <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
          Aberto agora • Entrega em {STORE.deliveryTime} • {STORE.city}
        </p>
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-lg tracking-tight sm:text-xl">
          {STORE.name}
          <span className="align-super text-[0.55em] text-primary">™</span>
        </Link>

        <div className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">
            Início
          </Link>
          <a href="/#cardapio" className="transition-colors hover:text-foreground">
            Cardápio
          </a>
          <a href="/#como-funciona" className="transition-colors hover:text-foreground">
            Como funciona
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
            className="relative rounded-full border border-border p-2.5 text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <a
            href={waLink(`Olá, ${STORE.name}! Quero fazer um pedido 🍔`)}
            target="_blank"
            rel="noreferrer"
            className="btn-neon rounded-full px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] sm:px-6"
          >
            Pedir agora
          </a>
        </div>
      </nav>
    </header>
  );
}
