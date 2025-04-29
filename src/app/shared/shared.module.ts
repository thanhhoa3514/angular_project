import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroModule } from './ng-zorro.module';

@NgModule({
  declarations: [
    // Các component, directive, pipe dùng chung sẽ được khai báo ở đây
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroModule,
    // Các component, directive, pipe dùng chung sẽ được export ở đây
  ]
})
export class SharedModule { } 