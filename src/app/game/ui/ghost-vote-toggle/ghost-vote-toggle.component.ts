import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { AnimatedCandleComponent } from '../../../shared/components/animated-candle/animated-candle.component';

@Component({
  selector: 'app-ghost-vote-toggle',
  imports: [AnimatedCandleComponent],
  templateUrl: './ghost-vote-toggle.component.html',
  styleUrl: './ghost-vote-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostVoteToggleComponent {
  isGhostVoteUsed = input<boolean>(false);
  toggleGhostVote = output<boolean>();
}
