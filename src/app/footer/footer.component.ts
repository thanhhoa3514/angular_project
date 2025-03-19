import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  
  constructor() {}
  
  ngOnInit(): void {
    // Optional: Add animation initialization here if needed
    this.initializeWaveAnimation();
  }
  
  private initializeWaveAnimation(): void {
    // This method can be expanded to create more complex animations
    // For now, we're using CSS animations for simplicity
  }
}
