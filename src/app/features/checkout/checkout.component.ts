import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { 
  CheckoutService, 
  CartItem, 
  ShippingAddress,
  Product,
  ProductVariant
} from '../../core/services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  discount: number = 0;
  shipping: number = 30000; // 30,000 VND
  total: number = 0;
  promoCode: string = '';
  
  shippingAddress: ShippingAddress = {
    fullName: '',
    phone: '',
    email: '',
    address: ''
  };
  formErrors: {[key: string]: string} = {};
  
  constructor(
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.checkoutService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    const totals = this.checkoutService.calculateTotals(
      this.cartItems, 
      this.discount, 
      this.shipping
    );
    this.subtotal = totals.subtotal;
    this.total = totals.total;
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= 99) {
      item.quantity = newQuantity;
      this.calculateTotals();
    }
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  applyPromoCode() {
    const result = this.checkoutService.applyPromoCode(this.promoCode, this.subtotal);
    this.discount = result.discount;
    this.shipping = result.shipping;
    alert(result.message);
    this.calculateTotals();
  }

  placeOrder() {
    // Reset previous errors
    this.formErrors = {};
    
    // Validate shipping information
    this.formErrors = this.checkoutService.validateShippingInfo(this.shippingAddress);
    
    // Check if there are any errors
    if (Object.keys(this.formErrors).length > 0) {
      return;
    }

    const orderData = {
      items: this.cartItems,
      shippingAddress: this.shippingAddress,
      subtotal: this.subtotal,
      discount: this.discount,
      shipping: this.shipping,
      total: this.total
    };

    this.checkoutService.placeOrder(orderData).subscribe(success => {
      if (success) {
        this.router.navigate(['/order/confirm']);
      }
    });
  }
}