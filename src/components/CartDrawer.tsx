import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { lineTotal, useCart } from "@/lib/cart";
import { ADDONS } from "@/lib/menu";
import { STORE, brl } from "@/lib/store-config";

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, toggleAddon, subtotal, deliveryFee, total } =
    useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-xl">Seu pedido</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar carrinho"
            className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {lines.length === 0 && (
            <p className="pt-10 text-center text-sm text-muted-foreground">
              Seu carrinho está vazio. Escolha um burger no cardápio 🍔
            </p>
          )}

          {lines.map((line) => (
            <div key={line.key} className="rounded-xl border border-border bg-secondary/40 p-3">
              <div className="flex gap-3">
                <img
                  src={line.image}
                  alt={line.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="size-16 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-base">{line.name}</p>
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      aria-label={`Remover ${line.name}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="text-sm text-primary">{brl(lineTotal(line))}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {ADDONS.map((addon) => {
                      const active = line.addons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(line.key, addon.id)}
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          {addon.name} {brl(addon.price)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-border px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQty(line.key, line.qty - 1)}
                      aria-label="Diminuir quantidade"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm font-bold">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(line.key, line.qty + 1)}
                      aria-label="Aumentar quantidade"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-border px-5 py-5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{brl(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Entrega {STORE.city.split(" - ")[0]}</span>
            <span>{deliveryFee ? brl(deliveryFee) : "—"}</span>
          </div>
          <div className="flex justify-between text-lg font-extrabold">
            <span>Total</span>
            <span className="text-primary">{brl(total)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            aria-disabled={lines.length === 0}
            className={`btn-neon block rounded-full py-3.5 text-center text-sm font-extrabold uppercase tracking-[0.14em] ${
              lines.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Finalizar pedido
          </Link>
        </div>
      </aside>
    </>
  );
}
