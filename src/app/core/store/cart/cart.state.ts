import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartState {
  private items = new BehaviorSubject<CartItem[]>([]);
  
  getItems(): Observable<CartItem[]> {
    return this.items.asObservable();
  }
  
  getCurrentItems(): CartItem[] {
    return this.items.getValue();
  }
  
  setItems(items: CartItem[]): void {
    this.items.next(items);
  }
  
  addItem(item: CartItem): void {
    const currentItems = this.getCurrentItems();
    const existingItemIndex = currentItems.findIndex(i => 
      i.productId === item.productId && 
      i.color === item.color && 
      i.size === item.size
    );
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      this.setItems(updatedItems);
    } else {
      this.setItems([...currentItems, item]);
    }
  }
  
  removeItem(productId: number, color: string, size: string): void {
    const currentItems = this.getCurrentItems();
    const updatedItems = currentItems.filter(item => 
      !(item.productId === productId && item.color === color && item.size === size)
    );
    this.setItems(updatedItems);
  }
  
  clearItems(): void {
    this.setItems([]);
  }
}