import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
export interface CartItem {
    productId: number;
    quantity: number;
    color?: string;
    size?: string;
    price?: number;
    name?: string;
    thumbnail?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private items: CartItem[] = [];
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    private apiUrl = environment.apiUrl;


    // readonly cartItems = this.items.asReadonly();
    // readonly cartItemsCount = computed(() => 
    //     this.items().reduce((count, item) => count + item.quantity, 0)
    // );
    // readonly cartTotal = computed(() => 
    //     this.items().reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
    // );

    // readonly cartItems$ = toObservable(this.items);
    constructor(private http: HttpClient) {
        this.loadCartFromLocalStorage();
    }

    // Get all cart items as an observable
    getCartItems(): Observable<CartItem[]> {
        return this.cartItemsSubject.asObservable();
    }

    // Get cart items count
    getCartItemsCount(): number {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Get cart total price
    getCartTotal(): number {
        return this.items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
    }

    // Add item to cart
    addToCart(item: CartItem): Observable<any> {
        // Check if item already exists in cart
        const existingItemIndex = this.items.findIndex(i =>
            i.productId === item.productId &&
            i.color === item.color &&
            i.size === item.size
        );

        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            this.items[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            this.items.push(item);
        }

        this.updateCart();

        // Return observable for API call if needed
        return this.http.post(`${this.apiUrl}/api/v1/cart/add`, item);
    }

    // Update item quantity
    updateItemQuantity(productId: number, color: string, size: string, quantity: number): void {
        const itemIndex = this.items.findIndex(i =>
            i.productId === productId &&
            i.color === color &&
            i.size === size
        );

        if (itemIndex !== -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or negative
                this.removeItem(productId, color, size);
            } else {
                // Update quantity
                this.items[itemIndex].quantity = quantity;
                this.updateCart();
            }
        }
    }

    // Remove item from cart
    removeItem(productId: number, color: string, size: string): void {
        this.items = this.items.filter(item =>
            !(item.productId === productId && item.color === color && item.size === size)
        );
        this.updateCart();
    }

    // Clear cart
    clearCart(): void {
        this.items = [];
        this.updateCart();
    }

    // Private methods
    private updateCart(): void {
        this.cartItemsSubject.next([...this.items]);
        this.saveCartToLocalStorage();
    }

    private saveCartToLocalStorage(): void {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    private loadCartFromLocalStorage(): void {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
                this.cartItemsSubject.next([...this.items]);
            } catch (e) {
                console.error('Error loading cart from localStorage', e);
                this.items = [];
            }
        }
    }
}