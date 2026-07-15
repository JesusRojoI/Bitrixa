export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}