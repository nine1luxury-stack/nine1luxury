"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, productsApi } from "@/lib/api";

interface ProductContextType {
    products: Product[];
    loading: boolean;
    refreshProducts: () => Promise<void>;
    addProduct: (product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const data = await productsApi.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (newProduct: Partial<Product>) => {
        try {
            await productsApi.create(newProduct);
            await fetchProducts(); // Need to fetch to get the new ID from server
        } catch (error) {
            console.error("Failed to add product", error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        const previousProducts = [...products];
        try {
            // Optimistic update
            setProducts(prev => prev.filter(p => p.id !== id));
            await productsApi.delete(id);
        } catch (error) {
            console.error("Failed to delete product", error);
            setProducts(previousProducts); // Rollback
            alert("فشل حذف المنتج من السيرفر");
        }
    };

    const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
        const previousProducts = [...products];
        try {
             // Optimistic Update
             setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
             await productsApi.update(id, updatedFields);
             // No need to fetch again if we trust our local merge, but Fetching ensures sync
             // await fetchProducts(); 
        } catch (error) {
            console.error("Failed to update product", error);
            setProducts(previousProducts); // Rollback
            alert("فشل تحديث بيانات المنتج");
        }
    };

    return (
        <ProductContext.Provider value={{ 
            products, 
            loading,
            refreshProducts: fetchProducts,
            addProduct, 
            deleteProduct, 
            updateProduct 
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
