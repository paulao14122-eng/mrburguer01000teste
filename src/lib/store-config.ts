// Configurações da loja MRBURGER01
// TROQUE o número abaixo pelo WhatsApp real da loja (formato: 55 + DDD + número)
export const WHATSAPP_NUMBER = "5574999999999";

export const STORE = {
  name: "MRBURGER01",
  slogan: "O ARTESANAL IRRESISTÍVEL",
  instagram: "@mrburguer1_",
  instagramUrl: "https://instagram.com/mrburguer1_",
  city: "Abaré - BA",
  deliveryTime: "30-40 min",
  deliveryFee: 5,
};

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** URL absoluta de uma imagem do site (usada na mensagem do WhatsApp). */
export function absoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).href;
}
