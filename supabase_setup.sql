-- Create the site_content table for the content editor
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    content JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default content row
INSERT INTO site_content (id, content)
VALUES (1, '{
  "hero": {
    "title": "Handcrafted in the Himalayas",
    "subtitle": "Authentic Nepalese crafts made by skilled artisans using centuries-old traditions. Each piece tells a story of Himalayan craftsmanship and cultural heritage.",
    "buttonText": "Explore Collection"
  },
  "whyChooseUs": {
    "items": [
      {
        "icon": "✨",
        "title": "Authentic Heritage",
        "description": "Every artifact is verified for its cultural authenticity and handcrafted origin by master artisans."
      },
      {
        "icon": "🤝",
        "title": "Fair Trade Ethics",
        "description": "We bypass middlemen to ensure that artisans receive the majority of the profits for their devotion."
      },
      {
        "icon": "🌎",
        "title": "Global Reach",
        "description": "Museum-grade packaging and reliable worldwide delivery through our trusted logistics partners."
      }
    ]
  },
  "stats": {
    "happyCustomers": 20,
    "productsSold": 500,
    "yearsInBusiness": 15,
    "averageRating": "4.8"
  },
  "seo": {
    "metaTitle": "Import From Nepal - Authentic Handicrafts",
    "metaDescription": "Authentic handcrafted treasures from Nepal. Shop statues, singing bowls, thangkas, and more directly from artisans in the Himalayas.",
    "keywords": "Nepal handicrafts, singing bowls, buddha statues, thangka painting, himalayan art, authentic nepal export"
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read/write (adjust as needed)
CREATE POLICY "Allow authenticated users to manage site content" ON site_content
FOR ALL USING (auth.role() = 'authenticated');