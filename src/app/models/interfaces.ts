// Interfaces para tipado fuerte de datos

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface CatalogItem {
  id: number;
  title: string;
  description: string;
  image: string;
  imageBase64?: string;
  category: string;
  price: number;
  rating: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface FlipbookPage {
  id: number;
  frontContent: CatalogItem;
  backContent?: CatalogItem;
  isFlipped: boolean;
}
