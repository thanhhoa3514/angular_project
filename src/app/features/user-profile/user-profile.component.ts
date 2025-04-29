import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgbModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    activeSection = 'personal-info';
    personalInfoForm!: FormGroup;
    passwordForm!: FormGroup;
    addressForm!: FormGroup;
    isSubmitting = false;
    editingAddress: any = null;
    modalRef: NgbModalRef | null = null;

    @ViewChild('addressModal') addressModal: any;

    user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        avatar: 'assets/images/default-avatar.png'
    };

    orders = [
        {
            id: '1001',
            date: new Date('2023-04-15'),
            status: 'Delivered',
            items: 3,
            total: 149.97
        },
        {
            id: '1002',
            date: new Date('2023-05-20'),
            status: 'Processing',
            items: 2,
            total: 89.98
        }
    ];

    addresses = [
        {
            id: 1,
            name: 'Home',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
            phone: '(555) 123-4567',
            isDefault: true
        },
        {
            id: 2,
            name: 'Work',
            street: '456 Market Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'US',
            phone: '(555) 987-6543',
            isDefault: false
        }
    ];

    wishlist = [
        {
            id: 1,
            name: 'Product 1',
            image: 'assets/images/product1.jpg',
            price: 49.99,
            inStock: true
        },
        {
            id: 2,
            name: 'Product 2',
            image: 'assets/images/product2.jpg',
            price: 29.99,
            inStock: false
        }
    ];

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.initForms();
    }

    initForms(): void {
        // Personal info form
        this.personalInfoForm = this.fb.group({
            firstName: [this.user.firstName, Validators.required],
            lastName: [this.user.lastName, Validators.required],
            email: [this.user.email, [Validators.required, Validators.email]],
            phone: [this.user.phone]
        });

        // Password form
        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });

        // Address form
        this.addressForm = this.fb.group({
            name: ['', Validators.required],
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zipCode: ['', Validators.required],
            country: ['', Validators.required],
            phone: ['', Validators.required],
            isDefault: [false]
        });
    }

    passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    setActiveSection(section: string): void {
        this.activeSection = section;
    }

    updatePersonalInfo(): void {
        if (this.personalInfoForm.valid) {
            this.isSubmitting = true;

            // Simulate API call
            setTimeout(() => {
                this.user = {
                    ...this.user,
                    ...this.personalInfoForm.value
                };
                this.isSubmitting = false;
                alert('Personal information updated successfully');
            }, 1000);
        }
    }

    updatePassword(): void {
        if (this.passwordForm.valid) {
            this.isSubmitting = true;

            // Simulate API call
            setTimeout(() => {
                this.passwordForm.reset();
                this.isSubmitting = false;
                alert('Password updated successfully');
            }, 1000);
        }
    }

    openAddressModal(): void {
        this.editingAddress = null;
        this.addressForm.reset({
            isDefault: false
        });
        this.modalRef = this.modalService.open(this.addressModal, { centered: true });
    }

    editAddress(address: any): void {
        this.editingAddress = address;
        this.addressForm.setValue({
            name: address.name,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            phone: address.phone,
            isDefault: address.isDefault
        });
        this.modalRef = this.modalService.open(this.addressModal, { centered: true });
    }

    saveAddress(): void {
        if (this.addressForm.valid) {
            if (this.editingAddress) {
                // Update existing address
                const index = this.addresses.findIndex(a => a.id === this.editingAddress.id);
                const updatedAddress = {
                    ...this.editingAddress,
                    ...this.addressForm.value
                };

                // If setting as default, update other addresses
                if (updatedAddress.isDefault) {
                    this.addresses.forEach(a => a.isDefault = false);
                }

                this.addresses[index] = updatedAddress;
            } else {
                // Add new address
                const newAddress = {
                    id: Date.now(), // Generate unique ID
                    ...this.addressForm.value
                };

                // If setting as default, update other addresses
                if (newAddress.isDefault) {
                    this.addresses.forEach(a => a.isDefault = false);
                }

                this.addresses.push(newAddress);
            }

            this.modalRef?.close();
            alert(this.editingAddress ? 'Address updated successfully' : 'Address added successfully');
        }
    }

    deleteAddress(address: any): void {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(a => a.id !== address.id);
        }
    }

    setDefaultAddress(address: any): void {
        this.addresses.forEach(a => a.isDefault = false);
        const index = this.addresses.findIndex(a => a.id === address.id);
        this.addresses[index].isDefault = true;
        alert('Default address updated');
    }

    removeFromWishlist(item: any): void {
        if (confirm('Remove this item from your wishlist?')) {
            this.wishlist = this.wishlist.filter(w => w.id !== item.id);
        }
    }
}