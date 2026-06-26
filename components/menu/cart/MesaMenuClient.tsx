"use client"

import { useState, useMemo } from "react"
import { Search, ShoppingBag, X, Minus, Plus, MapPin } from "lucide-react"
import { CartProvider, useCart } from "./CartContext"
import { MesaItemCard } from "./MesaItemCard"
import { MenuHeader } from "@/components/menu/MenuHeader"
import { getCategoryIcon } from "@/lib/category-icons"
import { formatPrice } from "@/lib/utils"
import type { Restaurant, Category, Item, Table } from "@/lib/mock-data"

type CategoryWithItems = Category & { items: Item[] }

interface MesaMenuClientProps {
  restaurant: Restaurant
  table: Table
  categories: CategoryWithItems[]
  tableId: string
  slug: string
}

function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}) {
  const { cartItems, updateQty, total, count } = useCart()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85dvh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="font-outfit font-bold text-gray-900">O teu pedido</span>
            {count > 0 && (
              <span className="text-xs font-outfit font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--accent)" }}>
                {count}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center font-outfit text-gray-400 py-10">Ainda não adicionaste nada.</p>
          ) : (
            cartItems.map((ci) => (
              <div key={ci.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-outfit font-semibold text-[15px] text-gray-900 truncate">{ci.item_name}</p>
                  <p className="font-outfit text-[13px] text-gray-400">{formatPrice(ci.item_price)} / un.</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQty(ci.id, ci.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <span className="font-outfit font-bold text-[15px] w-5 text-center text-gray-900">{ci.quantity}</span>
                  <button
                    onClick={() => updateQty(ci.id, ci.quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:opacity-90 transition"
                    style={{ background: "var(--accent)" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-outfit font-bold text-[15px] text-gray-900 w-16 text-right flex-shrink-0">
                  {formatPrice(ci.item_price * ci.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="px-5 pb-8 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-outfit font-semibold text-gray-600">Total</span>
              <span className="font-outfit font-bold text-[20px] text-gray-900">{formatPrice(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 rounded-2xl text-white font-outfit font-bold text-[16px] transition hover:opacity-90 active:scale-[0.98]"
              style={{ background: "var(--accent)" }}
            >
              Fechar conta
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function CheckoutView({ tableName, onBack }: { tableName: string; onBack: () => void }) {
  const { cartItems, total } = useCart()

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="px-5 pt-14 pb-8 text-center" style={{ borderBottom: "1px solid #f0f0f0" }}>
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <p className="font-outfit text-sm uppercase tracking-widest" style={{ color: "var(--accent)" }}>A tua mesa</p>
        </div>
        <p className="font-outfit font-bold text-6xl text-gray-900 leading-none">{tableName}</p>
        <p className="font-outfit text-sm text-gray-400 mt-3">Mostra este ecrã ao caixa</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <p className="font-outfit text-xs text-gray-400 uppercase tracking-widest mb-5">Resumo do pedido</p>
        <div className="space-y-3">
          {cartItems.map((ci) => (
            <div key={ci.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-outfit text-sm font-bold text-gray-400">{ci.quantity}×</span>
                <span className="font-outfit text-[15px] text-gray-900">{ci.item_name}</span>
              </div>
              <span className="font-outfit font-semibold text-gray-700">{formatPrice(ci.item_price * ci.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-10 pt-4 space-y-3" style={{ borderTop: "1px solid #f0f0f0" }}>
        <div className="flex items-center justify-between">
          <span className="font-outfit font-bold text-lg text-gray-900">Total</span>
          <span className="font-outfit font-bold text-[26px]" style={{ color: "var(--accent)" }}>{formatPrice(total)}</span>
        </div>
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl border-2 text-gray-700 font-outfit font-semibold text-[15px] hover:bg-gray-50 transition"
          style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}
        >
          Continuar a pedir
        </button>
      </div>
    </div>
  )
}

function MesaMenuContent({ restaurant, table, categories }: Pick<MesaMenuClientProps, "restaurant" | "table" | "categories">) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "all")
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { cartItems, addItem, count } = useCart()

  const accent = restaurant.accent_color ?? "#C8622A"

  const trimmed = query.trim().toLowerCase()
  const isSearching = trimmed.length > 0

  const searchResults = useMemo(() => {
    if (!trimmed) return []
    return categories.flatMap((cat) =>
      cat.items
        .filter((item) =>
          item.name.toLowerCase().includes(trimmed) ||
          item.description?.toLowerCase().includes(trimmed)
        )
        .map((item) => ({ item, categoryName: cat.name }))
    )
  }, [categories, trimmed])

  const displayedCategories = activeCategory === "all"
    ? categories
    : categories.filter((c) => c.id === activeCategory)

  const getQty = (itemId: string) => cartItems.find((ci) => ci.item_id === itemId)?.quantity ?? 0

  return (
    <div className="min-h-dvh bg-white flex flex-col" style={{ "--accent": accent } as React.CSSProperties}>
      <MenuHeader restaurant={restaurant} />

      {/* Mesa badge */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-outfit font-semibold" style={{ background: accent }}>
          <MapPin className="w-3 h-3" />
          {table.name}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pt-4 pb-3">
        <div className="relative flex items-center bg-[#F3F3F3] rounded-full h-[52px] shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="flex-1 pl-5 pr-2 bg-transparent font-outfit text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <div className="mr-1.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent, boxShadow: `0 3px 10px color-mix(in srgb, ${accent} 45%, transparent)` }}>
            <Search className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && !isSearching && (
        <div className="pt-1 pb-1">
          <h2 className="font-outfit font-bold text-gray-900 text-[17px] px-5 mb-3">Categorias</h2>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-5 pb-1">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name)
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-outfit font-medium transition-all duration-200 whitespace-nowrap ${isActive ? "text-white" : "bg-[#F0F0F0] text-gray-500 hover:bg-gray-200"}`}
                  style={isActive ? { background: accent } : {}}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {cat.name}
                </button>
              )
            })}
            <span className="flex-shrink-0 w-2" />
          </div>
        </div>
      )}

      {/* Items */}
      <main className="flex-1 pb-28 pt-4">
        {isSearching ? (
          searchResults.length > 0 ? (
            <div className="px-5 space-y-3">
              <p className="font-outfit text-xs text-gray-400">
                {searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"} para &ldquo;{query.trim()}&rdquo;
              </p>
              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ paddingTop: "48px", paddingLeft: "calc(50% - 9rem)", paddingRight: "calc(50% - 9rem)" }}
              >
                {searchResults.map(({ item }) => (
                  <div key={item.id} className="flex-shrink-0 snap-center snap-always">
                    <MesaItemCard item={item} qty={getQty(item.id)} onAdd={() => addItem(item)} />
                  </div>
                ))}
                <span className="flex-shrink-0 w-2" />
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-outfit text-lg text-gray-400">Sem resultados</p>
            </div>
          )
        ) : categories.length === 0 ? (
          <div className="py-20 text-center px-5">
            <p className="font-outfit text-lg text-gray-400">Cardápio em preparação...</p>
          </div>
        ) : (
          <div key={activeCategory} className="space-y-10">
            {displayedCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.name)
              const hasItems = cat.items.length > 0
              return (
                <section key={cat.id} id={`section-${cat.id}`}>
                  <div className="flex items-center gap-2 px-5 mb-2">
                    <h2 className="font-outfit font-bold text-gray-900 text-[17px]">{cat.name}</h2>
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                  </div>
                  {hasItems ? (
                    <div
                      className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory scroll-smooth"
                      style={{ paddingTop: "48px", paddingLeft: "calc(50% - 9rem)", paddingRight: "calc(50% - 9rem)" }}
                    >
                      {cat.items.map((item) => (
                        <div key={item.id} className="flex-shrink-0 snap-center snap-always">
                          <MesaItemCard item={item} qty={getQty(item.id)} onAdd={() => addItem(item)} />
                        </div>
                      ))}
                      <span className="flex-shrink-0 w-2" />
                    </div>
                  ) : (
                    <div className="py-10 text-center px-5">
                      <p className="font-outfit text-gray-400 text-sm">Sem itens nesta categoria.</p>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </main>

      {/* Floating cart button */}
      {count > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-5 z-30 flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-outfit font-bold shadow-xl transition hover:opacity-90 active:scale-95"
          style={{ background: accent, boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 50%, transparent)` }}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{count} {count === 1 ? "item" : "itens"}</span>
        </button>
      )}

      <footer className="py-4 border-t border-gray-100 text-center">
        <p className="font-outfit text-xs text-gray-400">
          Powered by <a href="/" className="hover:opacity-70 transition-opacity" style={{ color: accent }}>Cardápios Digitais</a>
        </p>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />

      {checkoutOpen && (
        <CheckoutView tableName={table.name} onBack={() => setCheckoutOpen(false)} />
      )}
    </div>
  )
}

export function MesaMenuClient({ restaurant, table, categories, tableId, slug }: MesaMenuClientProps) {
  return (
    <CartProvider tableId={tableId}>
      <MesaMenuContent restaurant={restaurant} table={table} categories={categories} />
    </CartProvider>
  )
}
