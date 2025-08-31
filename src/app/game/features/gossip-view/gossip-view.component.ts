import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';

@Component({
  selector: 'app-gossip-view',
  imports: [ActionBarComponent, GameNavComponent, FormsModule],
  templateUrl: './gossip-view.component.html',
  styleUrl: './gossip-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GossipViewComponent {
  gameStateService = inject(GameStateService);
  gossip = model<string>(this.gameStateService.info().gossip ?? '');

  constructor() {
    effect(() => {
      this.gameStateService.info.update(info => ({
        ...info,
        gossip: this.gossip(),
      }));
    });
  }
}
