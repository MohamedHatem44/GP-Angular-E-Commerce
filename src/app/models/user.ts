export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  active: boolean;
  imageUrl: string;
  createdAt: Date;
  role: string;
}
