import { MessageCircle } from "lucide-react";
import { STORE, waLink } from "@/lib/store-config";

export function WhatsAppFab() {
  return (
    <a
      href={waLink(`Olá, ${STORE.name}! Quero fazer um pedido 🍔`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Pedir pelo WhatsApp"
      className="btn-neon fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-4 text-xs font-extrabold uppercase tracking-[0.14em]"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Pedir no WhatsApp</span>
    </a>
  );
}
