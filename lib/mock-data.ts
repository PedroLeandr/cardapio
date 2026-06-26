export interface Restaurant {
  id: string
  user_id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  cover_url: string | null
  phone: string | null
  google_maps_url: string | null
  accent_color: string | null
  theme: string | null
  plan?: string
  created_at: string
}

export interface Category {
  id: string
  restaurant_id: string
  name: string
  position: number
  created_at: string
}

export interface Item {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string | null
  is_active: boolean
  position: number
  created_at: string
}

export interface Table {
  id: string
  restaurant_id: string
  name: string
  created_at: string
}

export interface CartSession {
  id: string
  table_id: string
  status: "open" | "closed"
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_session_id: string
  item_id: string
  item_name: string
  item_price: number
  quantity: number
  created_at: string
}

export const mockRestaurant: Restaurant = {
  id: "mock-restaurant-1",
  user_id: "mock-user-1",
  name: "Tasca do Zé",
  slug: "cardapio-digital",
  description: "Cozinha portuguesa tradicional, feita com amor e ingredientes da nossa terra.",
  logo_url: null,
  cover_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  phone: "+351 912 345 678",
  google_maps_url: "https://maps.app.goo.gl/9WGzbhj6Cr35XNPV8",
  created_at: "2026-01-01T00:00:00Z",
  accent_color: "#C8622A",
  theme: "modern",
}

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    restaurant_id: "mock-restaurant-1",
    name: "Entradas",
    position: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    restaurant_id: "mock-restaurant-1",
    name: "Pratos Principais",
    position: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    restaurant_id: "mock-restaurant-1",
    name: "Sobremesas",
    position: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
]

export const mockItems: Item[] = [
  // Entradas
  {
    id: "item-1",
    category_id: "cat-1",
    name: "Caldo Verde",
    description: "Sopa tradicional de couve galega com chouriço e batata, servida bem quentinha.",
    price: 4.5,
    image_url: null,
    is_active: true,
    position: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-2",
    category_id: "cat-1",
    name: "Pataniscas de Bacalhau",
    description: "Frituras de bacalhau desfiado com salsa fresca, acompanhadas de arroz de feijão.",
    price: 8.5,
    image_url: null,
    is_active: true,
    position: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-3",
    category_id: "cat-1",
    name: "Presunto com Melão",
    description: "Fatias finas de presunto alentejano com melão da época, fio de azeite.",
    price: 9.0,
    image_url: null,
    is_active: false,
    position: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
  // Pratos Principais
  {
    id: "item-4",
    category_id: "cat-2",
    name: "Bacalhau à Brás",
    description: "Bacalhau desfiado salteado com batata palha, ovos mexidos e azeitonas pretas.",
    price: 16.5,
    image_url: null,
    is_active: true,
    position: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-5",
    category_id: "cat-2",
    name: "Frango no Churrasco",
    description: "Meio frango grelhado no carvão, marinado em piri-piri, com batata frita e salada.",
    price: 14.0,
    image_url: null,
    is_active: true,
    position: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-6",
    category_id: "cat-2",
    name: "Cabrito Assado no Forno",
    description: "Cabrito temperado com alho, louro e vinho branco, assado lentamente com batatinhas.",
    price: 19.5,
    image_url: null,
    is_active: true,
    position: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-7",
    category_id: "cat-2",
    name: "Polvo à Lagareiro",
    description: "Polvo cozido e depois assado com azeite, alho e batata a murro. Especialidade da casa.",
    price: 22.0,
    image_url: null,
    is_active: false,
    position: 4,
    created_at: "2026-01-01T00:00:00Z",
  },
  // Sobremesas
  {
    id: "item-8",
    category_id: "cat-3",
    name: "Pastel de Nata",
    description: "Pastel de Belém original, polvilhado com canela e açúcar em pó. Servido morno.",
    price: 2.5,
    image_url: null,
    is_active: true,
    position: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-9",
    category_id: "cat-3",
    name: "Pudim Abade de Priscos",
    description: "Pudim tradicional português com toucinho e vinho do Porto, textura inconfundível.",
    price: 5.5,
    image_url: null,
    is_active: true,
    position: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "item-10",
    category_id: "cat-3",
    name: "Arroz Doce da Avó",
    description: "Arroz cremoso com limão e canela, polvilhado com desenhos tradicionais.",
    price: 4.0,
    image_url: null,
    is_active: true,
    position: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
]

export interface MenuData {
  restaurant: Restaurant
  categories: (Category & { items: Item[] })[]
}

export function getMockMenuData(): MenuData {
  const categories = mockCategories
    .sort((a, b) => a.position - b.position)
    .map((cat) => ({
      ...cat,
      items: mockItems
        .filter((item) => item.category_id === cat.id)
        .sort((a, b) => a.position - b.position),
    }))

  return {
    restaurant: mockRestaurant,
    categories,
  }
}
