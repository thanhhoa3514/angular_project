import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadCartFromLocalStorage();
  }
  
  private loadCartFromLocalStorage(): void {
    if (this.isBrowser) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      }
    }
  }
  
  private saveCartToLocalStorage(cart: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  
  addToCart(product: any, quantity: number = 1): Observable<void> {
    const currentCart = this.cartItemsSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists in cart
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedCart);
    } else {
      // Add new product to cart
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      };
      
      this.cartItemsSubject.next([...currentCart, newItem]);
    }
    
    this.saveCartToLocalStorage(this.cartItemsSubject.value);
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
  
  removeFromCart(productId: number): void {
    const updatedCart = this.cartItemsSubject.value.filter(item => item.id !== productId);
    this.cartItemsSubject.next(updatedCart);
    this.saveCartToLocalStorage(updatedCart);
  }
  
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const updatedCart = this.cartItemsSubject.value.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    this.cartItemsSubject.next(updatedCart);
    this.saveCartToLocalStorage(updatedCart);
  }
  
  clearCart(): void {
    this.cartItemsSubject.next([]);
    if (this.isBrowser) {
      localStorage.removeItem('cart');
    }
  }
  
  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }
  
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
} 