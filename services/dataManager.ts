
import { supabase } from './supabaseClient';
import { Product, Shop } from '../types';
import { PRODUCTS, SHOPS } from '../constants';

const normalizePhone = (phone: string): string => phone.replace(/\D/g, '');
const cleanString = (str: string): string => str.trim();

// Cache global
let _productsCache: Product[] | null = null;
let _shopsCache: Shop[] | null = null;

const mapShopFromDB = (s: any): Shop => ({
  id: Number(s.id),
  name: s.name || "Boutique sans nom",
  type: s.type || "Vendeur Agréé",
  rating: s.rating || "5.0",
  dist: "À proximité", 
  status: s.status || "Ouvert",
  statusColor: "text-green-600",
  image: s.image || "https://images.unsplash.com/photo-1552526881-721ce8509abb?auto=format&fit=crop&q=80&w=400",
  description: s.description || "Boutique de pièces détachées à Djibouti.",
  hours: s.hours || "08:00 - 18:00",
  location: s.location || "Djibouti Ville",
  phone: s.phone || "",
  verified: s.verified ?? true
});

const mapProductFromDB = (p: any): Product => ({
  id: Number(p.id),
  title: p.title || "Produit sans nom",
  subtitle: p.subtitle || "Pièce auto",
  price: p.price || "Sur devis",
  image: p.image || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400",
  category: p.category || "Moteur",
  shopId: Number(p.shop_id), 
  description: p.description || "Aucune description fournie."
});

export const getShops = async (forceRefresh = false): Promise<Shop[]> => {
  if (!forceRefresh && _shopsCache) return _shopsCache;
  const { data, error } = await supabase.from('shops').select('*').order('name', { ascending: true });
  if (error) return SHOPS;
  _shopsCache = data && data.length > 0 ? data.map(mapShopFromDB) : SHOPS;
  return _shopsCache;
};

export const deleteShop = async (shopId: number) => {
  const { error } = await supabase.from('shops').delete().eq('id', shopId);
  if (error) throw error;
  _shopsCache = null;
  return { success: true };
};

export const getProducts = async (forceRefresh = false): Promise<Product[]> => {
  if (!forceRefresh && _productsCache) return _productsCache;
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
  if (error) return PRODUCTS;
  _productsCache = data && data.length > 0 ? data.map(mapProductFromDB) : PRODUCTS;
  return _productsCache;
};

export const addProduct = async (product: Omit<Product, 'id'>, vendorId: string) => {
  const dbPayload = {
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    shop_id: Number(product.shopId),
    description: product.description,
    vendor_id: Number(vendorId)
  };
  const { data, error } = await supabase.from('products').insert(dbPayload).select();
  if (error) throw error;
  _productsCache = null; 
  return data ? data.map(mapProductFromDB) : [];
};

export const deleteProduct = async (productId: number) => {
  const targetId = Number(productId);
  const { error } = await supabase.from('products').delete().eq('id', targetId);
  if (error) throw error;
  _productsCache = null; 
  return { success: true };
};

export const saveShop = async (vendorId: string, shop: Omit<Shop, 'id' | 'dist' | 'statusColor'>) => {
  const vId = Number(vendorId);
  const dbPayload = {
    vendor_id: vId,
    name: shop.name,
    description: shop.description,
    phone: shop.phone,
    image: shop.image
  };
  const { data: existing } = await supabase.from('shops').select('id').eq('vendor_id', vId).maybeSingle();
  let result;
  if (existing) {
    result = await supabase.from('shops').update(dbPayload).eq('vendor_id', vId).select();
  } else {
    result = await supabase.from('shops').insert(dbPayload).select();
  }
  if (result.error) throw result.error;
  _shopsCache = null; 
  return result.data ? result.data.map(mapShopFromDB) : [];
};

export const getVendorShop = async (vendorId: string): Promise<Shop | null> => {
  const { data, error } = await supabase.from('shops').select('*').eq('vendor_id', Number(vendorId)).maybeSingle();
  if (error) return null;
  return data ? mapShopFromDB(data) : null;
};

export const getVendorProducts = async (vendorId: string): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').eq('vendor_id', Number(vendorId)).order('id', { ascending: false });
  if (error) return [];
  return data ? data.map(mapProductFromDB) : [];
};

export const registerClient = async (name: string, email: string, phone: string) => {
  const { data, error } = await supabase.from('clients').insert([{ name: cleanString(name), email: cleanString(email), phone: normalizePhone(phone) }]).select().single();
  if (error) throw error;
  return data;
};

export const loginClient = async (name: string, phone: string) => {
  const { data, error } = await supabase.from('clients').select('*').eq('phone', normalizePhone(phone)).ilike('name', cleanString(name)).maybeSingle();
  if (error) throw error;
  return data;
};

export const loginVendor = async (password: string) => {
  const { data, error } = await supabase.from('vendors').select('*').eq('password', cleanString(password)).maybeSingle();
  if (error) throw error;
  return data;
};
