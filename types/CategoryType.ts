export interface CategoryType {
  name: string;
  slug: string;
}

export interface CategoryFullType {
  name: string;
  slug: string;
  subCategories: { name: string; slug: string }[];
}

export interface SubCategoryType {
  name: string;
  slug: string;
  category: { name: string; slug: string };
}
