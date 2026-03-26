"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Product, Category, productsApi, categoriesApi } from "@/lib/api";

interface ProductContextType {
    products: Product[];
    categories: Category[];
    loading: boolean;
    refreshProducts: (params?: { all?: boolean, limit?: number }) => Promise<void>;
    addProduct: (product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    refreshCategories: () => Promise<void>;
    addCategory: (name: string) => Promise<void>;
    updateCategory: (id: string, name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async (params: { all?: boolean, limit?: number } = { limit: 50 }) => {
        try {
            const data = await productsApi.getAll(params);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Load both in parallel for faster initial load
            await Promise.all([
                fetchCategories(),
                fetchProducts({ limit: 50 })
            ]);
        } finally {
            setLoading(false);
        }
    }, [fetchCategories, fetchProducts]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addProduct = useCallback(async (newProduct: Partial<Product>) => {
        try {
            await productsApi.create(newProduct);
            await fetchProducts({ all: true });
        } catch (error) {
            console.error("Failed to add product", error);
            throw error;
        }
    }, [fetchProducts]);

    const deleteProduct = useCallback(async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
            await productsApi.delete(id);
        } catch (error) {
            console.error("Failed to delete product", error);
            // Re-fetch to sync state if delete failed
            await fetchProducts();
            alert("فشل حذف المنتج من السيرفر");
        }
    }, [fetchProducts]);

    const updateProduct = useCallback(async (id: string, updatedFields: Partial<Product>) => {
        // Optimistic update
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));

        try {
            const updatedProduct = await productsApi.update(id, updatedFields);
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        } catch (error) {
            console.error("Failed to update product", error);
            await fetchProducts(); // Rollback/Sync
            alert("فشل تحديث بيانات المنتج");
        }
    }, [fetchProducts]);

    const addCategory = useCallback(async (name: string) => {
        try {
            await categoriesApi.create(name);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to add category", error);
            throw error;
        }
    }, [fetchCategories]);

    const updateCategory = useCallback(async (id: string, name: string) => {
        try {
            await categoriesApi.update(id, name);
            await Promise.all([fetchCategories(), fetchProducts()]);
        } catch (error) {
            console.error("Failed to update category", error);
            throw error;
        }
    }, [fetchCategories, fetchProducts]);

    const deleteCategory = useCallback(async (id: string) => {
        try {
            await categoriesApi.delete(id);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to delete category", error);
            throw error;
        }
    }, [fetchCategories]);

    const contextValue = useMemo(() => ({
        products,
        categories,
        loading,
        refreshProducts: fetchProducts,
        addProduct,
        deleteProduct,
        updateProduct,
        refreshCategories: fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
    }), [
        products, 
        categories, 
        loading, 
        fetchProducts, 
        addProduct, 
        deleteProduct, 
        updateProduct, 
        fetchCategories, 
        addCategory, 
        updateCategory, 
        deleteCategory
    ]);

    return (
        <ProductContext.Provider value={contextValue}>
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
