import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Check, Copy, CreditCard, Loader2, QrCode, Upload } from "lucide-react";
import { addonNames, lineTotal, useCart } from "@/lib/cart";
import { STORE, absoluteUrl, brl, waLink } from "@/lib/store-config";
import {
  MP_TEST_MODE,
  createMockPayment,
  mockPixCode,
  type PaymentMethod,
} from "@/lib/mercadopago";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar pedido — MRBURGER01 Delivery Abaré-BA" },
      {
        name: "description",
        content:
          "Escolha PIX, cartão ou dinheiro, informe seu endereço e receba seu hambúrguer artesanal em 30-40 min em Abaré-BA.",
      },
      { property: "og:title", content: "Finalizar pedido — MRBURGER01" },
      {
        property: "og:description",
        content: "Checkout rápido com PIX, cartão e dinheiro para delivery em Abaré-BA.",
      },
    ],
  }),
  component: Checkout,
});

type Form = {
  name: string;
  phone: string;
  address: string;
  district: string;
  reference: string;
  receiptLink: string;
};

const METHODS = [
  { id: "pix" as PaymentMethod, label: "PIX", icon: QrCode },
  { id: "card" as PaymentMethod, label: "Cartão", icon: CreditCard },
  { id: "cash" as PaymentMethod, label: "Dinheiro", icon: Banknote },
];

const METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: "PIX ✅",
  card: "CARTÃO ✅",
  cash: "DINHEIRO NA ENTREGA",
};

function Checkout() {
  const navigate = useNavigate();
  const { lines, subtotal, deliveryFee, total, clear } = useCart();
  const [form, setForm] = useState<Form>({
    name: "",
    phone: "",
    address: "",
    district: "",
    reference: "",
    receiptLink: "",
  });
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [receiptName, setReceiptName] = useState("");
  const [status, setStatus] = useState<"form" | "paying" | "approved">("form");
  const [paymentId, setPaymentId] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const itemsText = lines
    .map((l) => {
      const extras = addonNames(l.addons);
      return (
        `• ${l.qty}x ${l.name} — ${brl(lineTotal(l))}\n` +
        (extras ? `   Adicionais: ${extras}\n` : "") +
        (l.note ? `   Obs: ${l.note}\n` : "") +
        `   Foto: ${absoluteUrl(l.image)}`
      );
    })
    .join("\n");

  const receiptText =
    method === "pix"
      ? form.receiptLink
        ? `Comprovante: ${form.receiptLink}`
        : receiptName
          ? `Comprovante: ${receiptName} (vou anexar aqui no WhatsApp)`
          : "Comprovante: enviar aqui no WhatsApp"
      : "";

  const orderMessage = (id: string) =>
    `🔥 NOVO PEDIDO - ${STORE.name}\n\n` +
    `Cliente: ${form.name}\n` +
    `Telefone: ${form.phone}\n` +
    `End: ${form.address}, ${form.district}\n` +
    (form.reference ? `Referência: ${form.reference}\n` : "") +
    `\nPedido:\n${itemsText}\n\n` +
    `Subtotal: ${brl(subtotal)}\n` +
    `Entrega (${STORE.city}): ${brl(deliveryFee)}\n` +
    `Total: ${brl(total)}\n` +
    `Pagamento: ${METHOD_LABEL[method]}\n` +
    (method === "cash" ? "" : `ID pagamento: ${id}\n`) +
    (receiptText ? `${receiptText}\n` : "");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!lines.length) return;
    setStatus("paying");
    const result = await createMockPayment(method);
    setPaymentId(result.id);
    setStatus("approved");
  }

  function finishOnWhatsApp() {
    window.open(waLink(orderMessage(paymentId)), "_blank");
    clear();
    navigate({ to: "/" });
  }

  if (!lines.length && status !== "approved") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl">Carrinho vazio</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Escolha um burger no cardápio para finalizar o pedido.
        </p>
        <Link
          to="/"
          className="btn-neon mt-8 inline-flex rounded-full px-7 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em]"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary">
          <Check className="size-8 text-primary-foreground" />
        </span>
        <h1 className="mt-6 text-[clamp(2rem,6vw,3rem)] text-3d">
          {method === "cash" ? "Pedido confirmado" : "Pagamento aprovado"}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Agora envie o pedido para a cozinha no WhatsApp — a mensagem já vai pronta com todos os
          detalhes.
        </p>
        <button
          type="button"
          onClick={finishOnWhatsApp}
          className="btn-neon mt-8 rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em]"
        >
          Enviar pedido no WhatsApp
        </button>
        <pre className="mt-8 whitespace-pre-wrap rounded-2xl border border-border bg-card p-5 text-left text-xs text-muted-foreground">
          {orderMessage(paymentId)}
        </pre>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-[clamp(2rem,6vw,3.5rem)] text-3d">Finalizar pedido</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Entrega em {STORE.deliveryTime} · {STORE.city} · Taxa {brl(STORE.deliveryFee)}
      </p>

      <form onSubmit={handlePay} className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          <fieldset className="rounded-2xl border border-border bg-card p-6">
            <legend className="px-2 font-display text-xl">Forma de pagamento</legend>
            {MP_TEST_MODE && (
              <p className="mb-4 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs text-muted-foreground">
                Modo teste: nenhum valor é cobrado de verdade. Cole sua chave do Mercado Pago para
                ativar os pagamentos reais.
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              {METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    method === id
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  <Icon className="size-4" /> {label}
                </button>
              ))}
            </div>

            {method === "pix" && (
              <div className="mt-6 space-y-4 rounded-xl border border-border bg-secondary/30 p-5">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      mockPixCode(total),
                    )}`}
                    alt="QR Code PIX do pedido"
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={200}
                    className="rounded-lg bg-foreground p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Pague {brl(total)} no PIX</p>
                    <p className="mt-1 break-all text-[11px] text-muted-foreground">
                      {mockPixCode(total)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(mockPixCode(total));
                        setCopied(true);
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wide hover:border-primary"
                    >
                      <Copy className="size-3.5" /> {copied ? "Copiado" : "Copiar código"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Comprovante do PIX
                    </span>
                    <span className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-4 py-3 text-sm text-muted-foreground hover:border-primary">
                      <Upload className="size-4" />
                      {receiptName || "Anexar imagem"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setReceiptName(e.target.files?.[0]?.name ?? "")}
                      />
                    </span>
                  </label>
                  <Field
                    label="Link do comprovante (opcional)"
                    value={form.receiptLink}
                    onChange={set("receiptLink")}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {method === "card" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Número do cartão"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                  placeholder="0000 0000 0000 0000"
                  className="sm:col-span-2"
                  required
                />
                <Field
                  label="Nome impresso"
                  value={card.name}
                  onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                  className="sm:col-span-2"
                  required
                />
                <Field
                  label="Validade"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                  placeholder="MM/AA"
                  required
                />
                <Field
                  label="CVV"
                  value={card.cvv}
                  onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                  placeholder="123"
                  required
                />
              </div>
            )}

            {method === "cash" && (
              <p className="mt-6 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                Você paga {brl(total)} em dinheiro na entrega. Se precisar de troco, escreva nas
                observações do pedido.
              </p>
            )}
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-card p-6">
            <legend className="px-2 font-display text-xl">Nome e endereço</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" value={form.name} onChange={set("name")} required />
              <Field
                label="WhatsApp"
                value={form.phone}
                onChange={set("phone")}
                placeholder="(74) 90000-0000"
                required
              />
              <Field
                label="Endereço (rua e número)"
                value={form.address}
                onChange={set("address")}
                className="sm:col-span-2"
                required
              />
              <Field label="Bairro" value={form.district} onChange={set("district")} required />
              <Field
                label="Ponto de referência"
                value={form.reference}
                onChange={set("reference")}
                placeholder="Perto da praça..."
              />
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="text-xl">Resumo</h2>
          <ul className="mt-4 space-y-4">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-3">
                <img
                  src={l.image}
                  alt={l.name}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={800}
                  className="size-12 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex justify-between gap-2">
                    <span>
                      {l.qty}x {l.name}
                    </span>
                    <span>{brl(lineTotal(l))}</span>
                  </div>
                  {l.addons.length > 0 && (
                    <p className="text-xs text-primary">{addonNames(l.addons)}</p>
                  )}
                  {l.note && <p className="text-xs text-muted-foreground">Obs: {l.note}</p>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{brl(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entrega</span>
              <span>{brl(deliveryFee)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-lg font-extrabold">
            <span>Total</span>
            <span className="text-primary">{brl(total)}</span>
          </div>
          <button
            type="submit"
            disabled={status === "paying"}
            className="btn-neon mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-extrabold uppercase tracking-[0.14em] disabled:opacity-60"
          >
            {status === "paying" && <Loader2 className="size-4 animate-spin" />}
            {status === "paying"
              ? "Confirmando..."
              : method === "cash"
                ? "Confirmar pedido"
                : `Pagar ${brl(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
      />
    </label>
  );
}
