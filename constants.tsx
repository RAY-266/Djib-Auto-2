
import { Product, Shop } from './types';

export const SHOPS: Shop[] = [
  { 
    id: 1, 
    name: "Djibouti Pièces Auto", 
    type: "Spécialiste Japonaises", 
    rating: "4.8", 
    dist: "2.4 km", 
    status: "Ouvert", 
    statusColor: "text-green-600", 
    image: "https://images.unsplash.com/photo-1552526881-721ce8509abb?auto=format&fit=crop&q=80&w=400",
    verified: true,
    description: "Le plus grand stock de pièces Toyota, Nissan et Mitsubishi à Djibouti. Livraison disponible en ville.",
    hours: "08:00 - 18:00 (Lun-Sam)",
    location: "Avenue 13, Quartier 7, Djibouti Ville",
    phone: "25377123456"
  },
  { 
    id: 2, 
    name: "Stop Freins Express", 
    type: "Expert Freinage & ABS", 
    rating: "4.5", 
    dist: "1.2 km", 
    status: "Ouvert", 
    statusColor: "text-green-600", 
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400",
    description: "Experts en systèmes de freinage. Nous vendons et installons des plaquettes de haute qualité.",
    hours: "09:00 - 19:00 (Lun-Dim)",
    location: "Boulevard de la République, Face au Port",
    phone: "25377654321"
  },
  { 
    id: 3, 
    name: "Express Suspension", 
    type: "Amortisseurs & Direction", 
    rating: "4.2", 
    dist: "3.5 km", 
    status: "Fermé", 
    statusColor: "text-red-500", 
    image: "https://images.unsplash.com/photo-1562426509-5044a121aa49?auto=format&fit=crop&q=80&w=400",
    description: "Distributeur officiel KYB et Bilstein. Amortisseurs pour tous types de terrains.",
    hours: "08:30 - 17:30 (Lun-Ven)",
    location: "Zone Industrielle Sud, Djibouti",
    phone: "25377998877"
  },
];

export const PRODUCTS: Product[] = [
  // MOTEUR
  { 
    id: 1, 
    title: "Alternateur Toyota Hilux Revo", 
    subtitle: "Moteur • Neuf • 12V", 
    price: "25,000 DJF", 
    category: "Moteur",
    shopId: 1,
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=600",
    description: "Alternateur d'origine Toyota, compatible avec les modèles Hilux de 2015 à 2022. Garanti 6 mois.",
    specs: { "Voltage": "12V", "Marque": "Denso" }
  },
  { 
    id: 2, 
    title: "Filtre à Huile Original Nissan", 
    subtitle: "Entretien • Filtre", 
    price: "2,500 DJF", 
    category: "Moteur",
    shopId: 1,
    image: "https://images.unsplash.com/photo-1635843231405-f481237e3d1c?auto=format&fit=crop&q=80&w=600",
    description: "Filtre à huile Nissan Genuine Parts pour Patrol, Navara et X-Trail.",
  },
  
  // FREINAGE
  { 
    id: 3, 
    title: "Plaquettes de Frein Toyota Hilux", 
    subtitle: "Freinage • Paire", 
    price: "8,500 DJF", 
    category: "Freinage",
    shopId: 1,
    image: "https://images.unsplash.com/photo-1620055375841-f40441460114?auto=format&fit=crop&q=80&w=600",
    description: "Plaquettes de frein semi-métalliques pour Toyota Hilux Revo. Excellente durabilité.",
  },
  { 
    id: 4, 
    title: "Plaquettes de Frein Brembo Sport", 
    subtitle: "Freinage • Performance", 
    price: "15,000 DJF", 
    category: "Freinage",
    shopId: 2,
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=600",
    description: "Plaquettes haute performance Brembo pour conduite dynamique et freinage court.",
  },
  { 
    id: 5, 
    title: "Disque de Frein Nissan Patrol", 
    subtitle: "Freinage • Ventilé", 
    price: "19,000 DJF", 
    category: "Freinage",
    shopId: 2,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600",
    description: "Disque de frein ventilé pour Nissan Patrol Y61.",
  },
  
  // SUSPENSION
  { 
    id: 6, 
    title: "Amortisseurs KYB Excel-G", 
    subtitle: "Suspension • Gaz", 
    price: "18,000 DJF", 
    category: "Suspension",
    shopId: 3,
    image: "https://images.unsplash.com/photo-1549413204-62955f2f534e?auto=format&fit=crop&q=80&w=600",
    description: "Amortisseurs à gaz pour une better tenue de route. Compatible SUV et Pick-ups.",
  },
  { 
    id: 7, 
    title: "Kit Suspension Old Man Emu", 
    subtitle: "Suspension • 4x4", 
    price: "245,000 DJF", 
    category: "Suspension",
    shopId: 3,
    image: "https://images.unsplash.com/photo-1594976612316-26792f392ce8?auto=format&fit=crop&q=80&w=600",
    description: "Kit de suspension complet pour le franchissement tout-terrain.",
  },

  // ECLAIRAGE
  { 
    id: 8, 
    title: "Phares LED Toyota Prado", 
    subtitle: "Éclairage • Full LED", 
    price: "95,000 DJF", 
    category: "Éclairage",
    shopId: 1,
    image: "https://images.unsplash.com/photo-1547347109-1736b42b6534?auto=format&fit=crop&q=80&w=600",
    description: "Optiques avant Full LED pour Toyota Land Cruiser Prado. Design moderne.",
  },
  { 
    id: 9, 
    title: "Ampoules Philips Diamond Vision", 
    subtitle: "Éclairage • Paire", 
    price: "4,500 DJF", 
    category: "Éclairage",
    shopId: 1,
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=600",
    description: "Ampoules à effet Xenon pour une visibilité nocturne accrue.",
  }
];
