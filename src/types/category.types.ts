export interface Category {
  id: string;
  name: string;
  nameJp?: string;
  slug: string;
  description: string;
  coverUrl: string;
  accentColor: string;
  itemCount: number;
  featured?: boolean;
}
