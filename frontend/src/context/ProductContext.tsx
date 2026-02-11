"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, productsApi, categoriesApi } from "@/lib/api";

interface ProductContextType {
    products: Product[];
    categories: Category[];
    loading: boolean;
    refreshProducts: () => Promise<void>;
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

    const fetchProducts = async () => {
        try {
            const data = await productsApi.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const addProduct = async (newProduct: Partial<Product>) => {
        try {
            await productsApi.create(newProduct);
            await fetchProducts();
        } catch (error) {
            console.error("Failed to add product", error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        const previousProducts = [...products];
        try {
            setProducts(prev => prev.filter(p => p.id !== id));
            await productsApi.delete(id);
        } catch (error) {
            console.error("Failed to delete product", error);
            setProducts(previousProducts);
            alert("فشل حذف المنتج من السيرفر");
        }
    };

    const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
        const previousProducts = [...products];
        // Optimistic update for simple fields
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));

        try {
            const updatedProduct = await productsApi.update(id, updatedFields);
            // Verify structure and update with authoritative server data
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        } catch (error) {
            console.error("Failed to update product", error);
            setProducts(previousProducts);
            alert("فشل تحديث بيانات المنتج");
        }
    };

    const addCategory = async (name: string) => {
        try {
            await categoriesApi.create(name);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to add category", error);
            throw error;
        }
    };

    const updateCategory = async (id: string, name: string) => {
        try {
            await categoriesApi.update(id, name);
            await Promise.all([fetchCategories(), fetchProducts()]); // Products might have changed category names
        } catch (error) {
            console.error("Failed to update category", error);
            throw error;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await categoriesApi.delete(id);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to delete category", error);
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{
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
