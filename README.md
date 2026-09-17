# MRBURGUER01 Digital Storefront

Crie um site do zero para hamburgueria delivery MRBURGUER01.

**MARCA:**
Nome: MRBURGUER01
Instagram: @mrburguer1_
Bio: Apenas delivery 🍔✨ O artesanal irresistível 🍔🤤
Slogan: O ARTESANAL IRRESISTÍVEL
Local: Abaré - BA

**DIREÇÃO DE ARTE - ESTILO QUE QUERO:**
Inspire-se EXATAMENTE nesses 2:
1. Foto em anexo (site dark do CORONEL com burger gigante)
2. Vídeo de referência (site de luxo com roda girando no scroll)

Quero: Fundo preto #0A0A0A, tipografia gigante 3D estilo CORONEL, fotos de hambúrguer profissional com fumaça, botão laranja neon #FF6B00.

OBRIGATÓRIO: Lenis Smooth Scroll + GSAP ScrollTrigger. O hambúrguer tem que girar/flutuar quando o usuário dá scroll, igual no vídeo da roda.

**ESTRUTURA DO SITE:**

1. **TOPO / NAV:** Logo MRBURGUER01™ à esquerda. Direita: INÍCIO, CARDÁPIO, COMO FUNCIONA + Botão LARANJA "PEDIR AGORA" que abre WhatsApp.

2. **HERO (Igual da foto CORONEL):**
    Layout 50/50. Esquerda: Foto gigante do seu burger mais top (estilo CORONEL) com efeito de rotação suave no scroll. Direita: Título gigante "O ARTESANAL IRRESISTÍVEL", subtítulo "Apenas delivery 🍔✨", lista de benefícios com check laranja, e botão "MONTAR MEU PEDIDO".

3. **CARDÁPIO COM PIN SCROLL (Efeito do vídeo):**
    O burger fica FIXO no centro (pin) enquanto o usuário rola e os burgers trocam:
    - MR. CORONEL (seu carro chefe)
    - MR. CHEDDAR
    - MR. BACON
    - MR. DUPLO
    Cada um com preço, descrição e botão "Adicionar".

4. **COMO FUNCIONA:** 3 colunas minimalistas com ícones: 1. Você pede no site 2. A gente faz na brasa na hora 3. Chega quentinho aí.

5. **PROVA SOCIAL:** Seção com print do Instagram "@mrburguer1_ - 578 seguidores apaixonados" + 3 avaliações de clientes fake 5 estrelas.

**FUNIL DE VENDAS - E-COMMERCE BRASIL:**

1. CARRINHO LATERAL: Ao clicar em "Adicionar", abre carrinho deslizante da direita. Mostra itens, adicionais (+ bacon R$4, + cheddar R$3), subtotal, taxa de entrega Abaré.

2. CHECKOUT: Página /checkout com Nome, Endereço, Bairro, Ponto de referência, Forma de pagamento.

3. PAGAMENTO DENTRO DO SITE: Integrar Mercado Pago Checkout Transparente com PIX (QR Code) e Cartão. Deixar campos para eu colar PUBLIC_KEY e ACCESS_TOKEN depois. Por enquanto use modo teste/mockado.

4. PÓS-PAGAMENTO WHATSAPP: Quando pagamento aprovado, gerar mensagem automática formatada e enviar para o WhatsApp da loja via link wa.me:

    🔥 NOVO PEDIDO - MRBURGUER01
    Cliente: [Nome]
    End: [Endereço]
    Pedido: [Itens]
    Total: R$ [Total] - PAGO VIA PIX ✅

Tecnologia: Next.js, Tailwind CSS, GSAP, Lenis. Totalmente responsivo, mobile first, focado em conversão para delivery. Use fotos de burgers artesanais premium do Unsplash.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mrburguer01000teste.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/02d558cd-e0ac-4385-a5f8-6369d66ce5d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
