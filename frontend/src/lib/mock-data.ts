export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    category: string;
    featured: boolean;
    images: { id: string; url: string; color?: string }[];
    colors?: { name: string; hex: string }[];
    sizes?: string[];
    variants: { id: string; color: string; size: string; stock: number; price?: number }[];
    createdAt: string;
    updatedAt: string;
}

export const MOCK_PRODUCTS: Product[] = [];
