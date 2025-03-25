export interface Product {
    id: number;
    name: string;
    price: number;
    discount_price?: number;
    thumbnail: string;
    description?: string;
    quantity: number;
    productImages?: ProductImage[];
    category_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    is_thumbnail?: boolean;
}