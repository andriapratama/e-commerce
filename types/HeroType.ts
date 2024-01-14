export interface HeroType {
  id: string;
  image: string;
  position: number;
  isLoading?: boolean;
}

export interface HeroClientType {
  image: string;
  position: number;
}
