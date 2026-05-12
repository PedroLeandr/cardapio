-- ============================================================
-- Cardápios Digitais — Schema completo
-- Executa este ficheiro no Supabase SQL Editor
-- supabase.com/dashboard → SQL Editor → New query
-- ============================================================

-- ─── TABELAS ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS restaurants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  logo_url    text,
  cover_url                text,
  phone                    text,
  google_maps_url          text,
  plan                    text NOT NULL DEFAULT 'free',
  stripe_customer_id      text,
  stripe_subscription_id  text,
  created_at              timestamptz DEFAULT now()
);

-- Migração (se a tabela já existir — executa no Supabase SQL Editor):
-- ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cover_url text;
-- ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS phone text;
-- ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS google_maps_url text;
-- ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';
-- ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS stripe_customer_id text;
-- ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

CREATE TABLE IF NOT EXISTS categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          text NOT NULL,
  position      integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  price       numeric(10, 2) NOT NULL DEFAULT 0,
  image_url   text,
  is_active   boolean NOT NULL DEFAULT true,
  position    integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ─── ÍNDICES ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_restaurants_slug    ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id   ON items(category_id);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE items       ENABLE ROW LEVEL SECURITY;

-- Restaurants
CREATE POLICY "Leitura pública de restaurantes"
  ON restaurants FOR SELECT USING (true);

CREATE POLICY "Dono pode gerir o seu restaurante"
  ON restaurants FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categories
CREATE POLICY "Leitura pública de categorias"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Dono pode gerir categorias do seu restaurante"
  ON categories FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Items
-- Todos os itens (incluindo esgotados) são visíveis publicamente
CREATE POLICY "Leitura pública de todos os itens"
  ON items FOR SELECT USING (true);

CREATE POLICY "Dono pode gerir itens do seu restaurante"
  ON items FOR ALL
  USING (
    category_id IN (
      SELECT c.id FROM categories c
      JOIN restaurants r ON c.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  )
  WITH CHECK (
    category_id IN (
      SELECT c.id FROM categories c
      JOIN restaurants r ON c.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

-- ─── STORAGE ─────────────────────────────────────────────────

-- Cria o bucket para imagens dos itens (faz isto manualmente no dashboard
-- Storage → New bucket → nome: "menu-images" → Public: true)
--
-- Ou executa:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('menu-images', 'menu-images', true)
-- ON CONFLICT DO NOTHING;

-- Políticas de storage
-- CREATE POLICY "Imagens públicas"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'menu-images');

-- CREATE POLICY "Dono pode fazer upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);

-- CREATE POLICY "Dono pode apagar as suas imagens"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);
