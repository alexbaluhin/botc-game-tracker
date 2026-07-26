import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [NgOptimizedImage],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  imageSrc = input.required<string>();
  imageAlt = input<string>();
  imageSize = input<number>(72);
}
