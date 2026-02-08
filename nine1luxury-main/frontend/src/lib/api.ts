
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    category: string;
    model?: string;
    featured: boolean;
    images: ProductImage[];
    variants: ProductVariant[];
    isActive?: boolean;
    reorderPoint?: number;
    sizeChartImage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductImage {
    id: string;
    url: string;
    color?: string;
}

export interface ProductVariant {
    id: string;
    color: string;
    colorHex?: string;
    size: string;
    stock: number;
    damagedStock?: number;
    washStock?: number;
    repackageStock?: number;
    sku?: string;
}

export interface Order {
    id: string;
    userId?: string;
    guestName?: string;
    guestPhone?: string;
    guestAddress?: string;
    guestCity?: string;
    totalAmount: number;
    shippingCost?: number;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentMethod: 'CASH_ON_DELIVERY' | 'INSTAPAY' | 'VODAFONE_CASH';
    depositAmount?: number;
    items: OrderItem[];
    user?: {
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
        images?: { url: string }[];
    };
    variant?: {
        color?: string;
        colorHex?: string;
        size?: string;
        sku?: string;
    };
}

export interface CreateOrderDto {
    guestName: string;
    guestPhone: string;
    guestAddress: string;
    guestCity: string;
    totalAmount: number;
    paymentMethod: 'CASH_ON_DELIVERY' | 'INSTAPAY' | 'VODAFONE_CASH';
    depositAmount?: number;
    items: {
        productId: string;
        variantId?: string;
        quantity: number;
        price: number;
    }[];
}

export interface Supplier {
    id: string;
    name: string;
    phone?: string;
    description?: string;
    manualTotalPurchases: number;
    manualTotalPaid: number;
    createdAt: string;
}

export interface SupplierStat {
    id: string;
    name: string;
    description?: string;
    onTimeRate: number;
    totalSpent: number;
    totalPaid: number;
}

export interface Expense {
    id: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
}

export interface ExpenseStats {
    total: number;
    byCategory: Record<string, number>;
}

export interface Customer {
    id: string;
    name: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    createdAt: string;
}

export interface ReturnRequest {
    id: string;
    orderId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    type: 'VALID' | 'DAMAGED' | 'WASH' | 'REPACKAGE';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    orderItem?: {
        productId: string;
        product?: { name: string };
    };
}

// Real Products API connecting to our Next.js API Routes
export const productsApi = {
    async getAll(params?: { category?: string; featured?: boolean }): Promise<Product[]> {
        const query = new URLSearchParams();
        if (params?.category) query.append('category', params.category);
        if (params?.featured !== undefined) query.append('featured', String(params.featured));

        const res = await fetch(`/api/products?${query.toString()}`, { cache: 'no-store' });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.details || err.error || 'Failed to fetch products');
        }
        return res.json();
    },

    async getById(id: string): Promise<Product> {
        const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.details || err.error || 'Failed to fetch product');
        }
        return res.json();
    },

    async create(data: Partial<Product>): Promise<Product> {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.details || err.error || 'Failed to create product');
        }
        return res.json();
    },

    async update(id: string, data: Partial<Product>): Promise<Product> {
        const res = await fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.details || err.error || 'Failed to update product');
        }
        return res.json();
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.details || err.error || 'Failed to delete product');
        }
    },
};

// Real Orders API
export const ordersApi = {
    async getAll(): Promise<Order[]> {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (!res.ok) return []; // Fail gracefully for now
        return res.json();
    },

    async getCustomers(): Promise<Customer[]> {
        const res = await fetch('/api/users/customers', { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    },

    async getById(id: string): Promise<Order> {
        const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
    },

    async create(data: CreateOrderDto): Promise<Order> {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.details || err.error || 'Failed to create order');
        }
        return res.json();
    },

    async updateStatus(id: string, status: Order['status']): Promise<Order> {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update order status');
        return res.json();
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete order');
    },
};

// Mock Auth API (Keep as mock for now unless User wants Auth implementation)
export const authApi = {
    async login(): Promise<{ access_token: string }> {
        return { access_token: "mock-token" };
    },

    async register(): Promise<{ access_token: string }> {
        return { access_token: "mock-token" };
    },
};

export const suppliersApi = {
    async getAll(): Promise<Supplier[]> {
        const res = await fetch('/api/suppliers', { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    },

    async getStats(): Promise<SupplierStat[]> {
        const res = await fetch('/api/suppliers/stats', { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    },

    async create(data: Partial<Supplier>): Promise<Supplier> {
        const res = await fetch('/api/suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create supplier');
        return res.json();
    },

    async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
        const res = await fetch(`/api/suppliers/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update supplier');
        return res.json();
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`/api/suppliers/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete supplier');
    }
};

export const expensesApi = {
    async getAll(): Promise<Expense[]> {
        const res = await fetch('/api/expenses', { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    },

    async getStats(): Promise<ExpenseStats> {
        const res = await fetch('/api/expenses/stats', { cache: 'no-store' });
        if (!res.ok) return { total: 0, byCategory: {} };
        return res.json();
    },

    async create(data: Partial<Expense>): Promise<Expense> {
        const res = await fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create expense');
        return res.json();
    },

    async update(id: string, data: Partial<Expense>): Promise<Expense> {
        const res = await fetch(`/api/expenses/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update expense');
        return res.json();
    },

    async delete(id: string): Promise<void> {
        const res = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete expense');
    }
};
