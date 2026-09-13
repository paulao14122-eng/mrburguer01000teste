/**
 * Configuração do Mercado Pago (Checkout Transparente).
 *
 * MODO TESTE (mock): enquanto MP_PUBLIC_KEY estiver vazio, o site simula
 * a aprovação do pagamento para você poder testar o funil inteiro.
 *
 * PARA ATIVAR DE VERDADE:
 * 1. Cole sua PUBLIC KEY abaixo (chave pública, pode ficar no código).
 * 2. O ACCESS TOKEN é secreto e NÃO vai aqui — ele deve ficar guardado
 *    no backend. Me avise quando tiver a chave e eu ligo o pagamento real.
 */
export const MP_PUBLIC_KEY = ""; // ex: "APP_USR-xxxxxxxx-xxxx-xxxx"

export const MP_TEST_MODE = MP_PUBLIC_KEY.trim().length === 0;

export type PaymentMethod = "pix" | "card";

export type PaymentResult = {
  status: "approved" | "rejected";
  id: string;
  method: PaymentMethod;
};

/** Simula a criação do pagamento enquanto as chaves reais não estão configuradas. */
export async function createMockPayment(method: PaymentMethod): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return {
    status: "approved",
    id: `TESTE-${Date.now().toString().slice(-8)}`,
    method,
  };
}

/** Código PIX fictício (copia e cola) usado no modo teste. */
export function mockPixCode(total: number) {
  const cents = Math.round(total * 100);
  return `00020126MRBURGUER01ABARE5204000053039865802BR5910MRBURGUER6006ABARE62070503***${cents}6304TEST`;
}
