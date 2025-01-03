-- Добавляем поле slug, если его еще нет
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Создаем индекс для быстрого поиска по slug
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug); 