import { Injectable } from '@angular/core';

@Injectable()
export class GrimoireService {
  private grimoireDOMElement: HTMLElement | undefined;

  setGrimoireElement(element: HTMLElement) {
    this.grimoireDOMElement = element;
  }

  getGrimoireElement() {
    return this.grimoireDOMElement;
  }
}
