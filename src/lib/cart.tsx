import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADDONS, type MenuItem } from "./menu";
import { STORE } from "./store-config";

export type CartLine = {
  key: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  addons: string[];
};

type CartContextValue = {
  lines: CartLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: MenuItem) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  toggleAddon: (key: string, addonId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mrburguer-cart";

function addonPrice(ids: string[]) {
  return ids.reduce((sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0), 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignora carrinho inválido */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage indisponível */
    }
  }, [lines]);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.key === item.id);
      if (existing) {
        return prev.map((l) => (l.key === item.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        {
          key: item.id,
          id: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
          image: item.image,
          addons: [],
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const toggleAddon = useCallback((key: string, addonId: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.key === key
          ? {
              ...l,
              addons: l.addons.includes(addonId)
                ? l.addons.filter((a) => a !== addonId)
                : [...l.addons, addonId],
            }
          : l,
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce(
      (sum, l) => sum + (l.price + addonPrice(l.addons)) * l.qty,
      0,
    );
    const deliveryFee = lines.length ? STORE.deliveryFee : 0;
    return {
      lines,
      open,
      setOpen,
      add,
      remove,
      setQty,
      toggleAddon,
      clear,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };
  }, [lines, open, add, remove, setQty, toggleAddon, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de CartProvider");
  return ctx;
}

export function lineTotal(line: CartLine) {
  return (line.price + addonPrice(line.addons)) * line.qty;
}

export { addonPrice };
