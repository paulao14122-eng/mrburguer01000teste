import coronel from "@/assets/burger-coronel.png";
import cheddar from "@/assets/burger-cheddar.png";
import bacon from "@/assets/burger-bacon.png";
import duplo from "@/assets/burger-duplo.png";

export type MenuItem = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
};

export const ADDONS = [
  { id: "bacon", name: "+ Bacon", price: 4 },
  { id: "cheddar", name: "+ Cheddar", price: 3 },
] as const;

export const MENU: MenuItem[] = [
  {
    id: "mr-coronel",
    name: "MR. CORONEL",
    tagline: "CARRO CHEFE",
    description:
      "Blend 180g na brasa, cheddar derretido, cebola caramelizada e o molho secreto da casa no pão brioche.",
    price: 32,
    image: coronel,
  },
  {
    id: "mr-cheddar",
    name: "MR. CHEDDAR",
    tagline: "PURO QUEIJO",
    description:
      "Blend 160g afogado em cheddar cremoso, alface, tomate e cebola roxa no pão de gergelim.",
    price: 28,
    image: cheddar,
  },
  {
    id: "mr-bacon",
    name: "MR. BACON",
    tagline: "CROCÂNCIA",
    description:
      "Blend 160g, fatias generosas de bacon crocante defumado, queijo e maionese artesanal.",
    price: 30,
    image: bacon,
  },
  {
    id: "mr-duplo",
    name: "MR. DUPLO",
    tagline: "PRA MATAR A FOME",
    description:
      "Dois blends de 160g, queijo dobrado, bacon, salada fresca e molho especial. O maior da casa.",
    price: 38,
    image: duplo,
  },
];
