
export interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  category: 'Moteur' | 'Freinage' | 'Suspension' | 'Éclairage';
  shopId: number;
  rating?: string;
  tag?: string;
  tagColor?: string;
  isPro?: boolean;
  description?: string;
  specs?: Record<string, string>;
}

export interface Shop {
  id: number;
  name: string;
  type: string;
  rating: string;
  dist: string;
  status: 'Ouvert' | 'Fermé';
  statusColor: string;
  image: string;
  description: string;
  hours: string;
  location: string;
  phone?: string; // Ajout du numéro de téléphone
  verified?: boolean;
}

export interface MapResult {
  title: string;
  uri: string;
  snippet?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
