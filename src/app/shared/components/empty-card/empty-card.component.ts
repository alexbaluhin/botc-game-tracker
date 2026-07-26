import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-card',
  templateUrl: './empty-card.component.html',
  styleUrl: './empty-card.component.scss',
})
export class EmptyCardComponent {
  text = input<string>('');
}
