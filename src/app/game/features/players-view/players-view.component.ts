import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GrimoireComponent } from '../../../shared/components/grimoire/grimoire.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';

@Component({
  selector: 'app-players-view',
  imports: [ActionBarComponent, GrimoireComponent, RouterLink],
  templateUrl: './players-view.component.html',
  styleUrl: './players-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersViewComponent {
  gameStateService = inject(GameStateService);
}
