import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class TestUtils {
  /**
   * Query for a single element by CSS selector
   */
  static queryByCss<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
  
  /**
   * Query for multiple elements by CSS selector
   */
  static queryAllByCss<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }
  
  /**
   * Trigger a click event on an element
   */
  static click<T>(fixture: ComponentFixture<T>, selector: string): void {
    const element = this.queryByCss(fixture, selector);
    element.triggerEventHandler('click', null);
    fixture.detectChanges();
  }
  
  /**
   * Set input value and dispatch input event
   */
  static setInputValue<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
    const inputElement = this.queryByCss(fixture, selector).nativeElement;
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
}