import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { CharactersCountPerTypeHintComponent } from '../../../shared/components/characters-count-per-type-hint/characters-count-per-type-hint.component';
import { GrimoireComponent } from '../../../shared/components/grimoire/grimoire.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';
import {
  PlayerEditModalComponent,
  PlayerEditModalData,
} from '../player-edit-modal/player-edit-modal.component';

@Component({
  selector: 'app-players-view',
  imports: [
    ActionBarComponent,
    GrimoireComponent,
    CharactersCountPerTypeHintComponent,
    GameNavComponent,
  ],
  templateUrl: './players-view.component.html',
  styleUrl: './players-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersViewComponent {
  gameStateService = inject(GameStateService);
  private dialog = inject(Dialog);

  editPlayer(index: number) {
    this.dialog.open<PlayerEditModalComponent, PlayerEditModalData>(
      PlayerEditModalComponent,
      {
        minWidth: '100%',
        height: '100%',
        data: {
          playerPositionInCircle: index,
        },
      }
    );
  }
}
