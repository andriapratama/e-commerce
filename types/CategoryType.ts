export interface CategoryType {
  name: string;
  slug: string;
}

export interface SubCategoryType {
  name: string;
  slug: string;
  category: CategoryType;
}
