export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "member" | "guest";
  address: string | null;
  phone: string | null;
  active: boolean;
}
