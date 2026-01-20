import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-animated-candle',
  imports: [],
  templateUrl: './animated-candle.component.html',
  styleUrl: './animated-candle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedCandleComponent {
  isLit = input.required<boolean>();
  size = input<number>(32);
}
