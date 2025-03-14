import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private toastr: ToastrService) {}
  
  ngOnInit(): void {
    setTimeout(() => {
      this.toastr.success('Chào mừng đến với Shop App!', 'Xin chào');
    }, 1000);
  }
}
