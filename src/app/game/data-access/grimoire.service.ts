import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GrimoireService {
  private grimoireDOMElement: HTMLElement | undefined;

  setGrimoireElement(element: HTMLElement) {
    this.grimoireDOMElement = element;
  }

  getGrimoireElement() {
    return this.grimoireDOMElement;
  }

  resetGrimoireElement() {
    this.grimoireDOMElement = undefined;
  }
}
