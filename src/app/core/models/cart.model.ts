export interface CartItem {
    productId: number;
    quantity: number;
    color?: string;
    size?: string;
    price?: number;
    name?: string;
    thumbnail?: string;
}