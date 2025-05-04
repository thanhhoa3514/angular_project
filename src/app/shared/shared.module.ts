import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroModule } from './ng-zorro.module';
import { TranslatePipe } from './pipes/translate.pipe';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroModule,

    TranslatePipe,
    LanguageSelectorComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroModule,
    TranslatePipe,
    LanguageSelectorComponent
  ]
})
export class SharedModule { } 