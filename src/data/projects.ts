export type Category = "All" | "Branding" | "Packaging" | "Posters" | "Websites & UI Design";

export interface Project {
  id: number;
  slug: string;
  category: Category;
  cover_image: string;
  cover_title: string;
  cover_description: string;
  cover_tags: string[];
  image?: string;
  tags?: string[];
  title: string;
  description: string;
  client: string;
  problem: string;
  goals: string[];
  approach?: {
    research?: string;
    direction?: string;
    execution?: string;
  };
  images: string[];
  results?: {
    impact?: string;
    brand_improvement?: string;
    positioning?: string;
  };
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  created_at?: string;
  views?: number;
}

// All static data has been removed. 
// The application now fetches all content dynamically from Supabase.
