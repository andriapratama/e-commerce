export interface MenuType {
  name: string;
  link: string;
  status: "active" | "";
}

export interface AdminMenuType {
  name: string;
  link: string;
  role: string[];
}
