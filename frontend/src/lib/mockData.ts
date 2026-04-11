export const MOCK_PRODUCTS = [
    {
        id: "mock-1",
        name: "Premium Living Metal Tee",
        description: "Experience the ultimate luxury with our charcoal-infused cotton tee. Designed for a tailored fit and extreme comfort. Features champagne gold embroidery on the chest.",
        price: 3500,
        discount: 15,
        category: "تيشرتات",
        featured: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: [
            { id: "img-1-1", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800" },
            { id: "img-1-2", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7ec2c?w=800" }
        ],
        variants: [
            { id: "v-1-1", color: "Charcoal", colorHex: "#1A1A1A", size: "M", stock: 10 },
            { id: "v-1-2", color: "Charcoal", colorHex: "#1A1A1A", size: "L", stock: 5 },
            { id: "v-1-3", color: "Champagne", colorHex: "#F7E7CE", size: "M", stock: 8 }
        ]
    },
    {
        id: "mock-2",
        name: "Noir Boutique Hoodie",
        description: "Heavyweight French Terry hoodie in deep matte black. Features silver-toned hardware and a minimalist oversized silhouette. Part of our signature Noir collection.",
        price: 5200,
        discount: 0,
        category: "هوديز",
        featured: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: [
            { id: "img-2-1", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" },
            { id: "img-2-2", url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800" }
        ],
        variants: [
            { id: "v-2-1", color: "Black", colorHex: "#000000", size: "L", stock: 12 },
            { id: "v-2-2", color: "Black", colorHex: "#000000", size: "XL", stock: 4 }
        ]
    },
    {
        id: "mock-3",
        name: "Ivory Silk Blend Shirt",
        description: "Graceful ivory white shirt crafted from a premium silk-cotton blend. Mother of pearl buttons and a refined mandarin collar make this a versatile masterpiece.",
        price: 4800,
        discount: 20,
        category: "قمصان",
        featured: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: [
            { id: "img-3-1", url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800" }
        ],
        variants: [
            { id: "v-3-1", color: "Ivory", colorHex: "#FFFFF0", size: "M", stock: 3 },
            { id: "v-3-2", color: "Ivory", colorHex: "#FFFFF0", size: "S", stock: 6 }
        ]
    },
    {
        id: "mock-4",
        name: "Royal Bronze Cargos",
        description: "Industrial-inspired cargo pants in a unique bronze metallic finish. Multiple utility pockets with luxury zippers and adjustable hem toggles.",
        price: 3900,
        discount: 10,
        category: "بناطيل",
        featured: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: [
            { id: "img-4-1", url: "https://images.unsplash.com/photo-1624371414361-e6e8ea402526?w=800" }
        ],
        variants: [
            { id: "v-4-1", color: "Bronze", colorHex: "#CD7F32", size: "32", stock: 15 },
            { id: "v-4-2", color: "Bronze", colorHex: "#CD7F32", size: "34", stock: 7 }
        ]
    }
];
