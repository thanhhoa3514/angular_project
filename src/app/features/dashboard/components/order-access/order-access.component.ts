import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AccessUser {
  id: number;
  name: string;
  avatar: string;
  email: string;
  role: string;
  isSelected?: boolean;
}

@Component({
  selector: 'app-order-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-access.component.html',
  styleUrls: ['./order-access.component.scss']
})
export class OrderAccessComponent {
  users: AccessUser[] = [
    {
      id: 1,
      name: 'Armin A.',
      avatar: 'assets/images/undraw_male-avatar_zkzx.svg',
      email: 'armin.a@example.com',
      role: 'Admin',
      isSelected: true
    },
    {
      id: 2,
      name: 'Eren Y.',
      avatar: 'assets/images/undraw_male-avatar_zkzx.svg',
      email: 'eren.y@example.com',
      role: 'Manager',
      isSelected: true
    },
    {
      id: 3,
      name: 'Mikasa A.',
      avatar: 'assets/images/undraw_female-avatar_7t6k.svg',
      email: 'mikasa.a@example.com',
      role: 'Staff',
      isSelected: true
    }
  ];

  timeframeEnabled: boolean = true;
  startDate: string = '2023-09-01';
  endDate: string = '2023-11-30';

  addUser(): void {
    // In a real app, this would open a dialog to select users
    console.log('Add user clicked');
  }

  toggleUserSelection(user: AccessUser): void {
    user.isSelected = !user.isSelected;
  }

  toggleTimeframe(): void {
    this.timeframeEnabled = !this.timeframeEnabled;
  }

  saveChanges(): void {
    // In a real app, this would save the access settings
    const selectedUsers = this.users.filter(user => user.isSelected);
    const accessSettings = {
      users: selectedUsers,
      timeframe: this.timeframeEnabled ? { start: this.startDate, end: this.endDate } : null
    };
    console.log('Saving access settings:', accessSettings);
  }
} 