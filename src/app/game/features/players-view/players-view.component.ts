import { Dialog } from '@angular/cdk/dialog';
import { Point } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GrimoireComponent } from '../../../shared/components/grimoire/grimoire.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { positionPlayersInCircle } from '../../../shared/layout/players-circle';
import { GrimoireService } from '../../data-access/grimoire.service';
import { GameHeaderComponent } from '../../ui/game-header/game-header.component';
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
    GameNavComponent,
    GameHeaderComponent,
  ],
  templateUrl: './players-view.component.html',
  styleUrl: './players-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersViewComponent {
  gameStateService = inject(GameStateService);
  grimoireService = inject(GrimoireService);
  private dialog = inject(Dialog);

  grimoireElement = viewChild.required<GrimoireComponent, ElementRef>(
    GrimoireComponent,
    {
      read: ElementRef,
    }
  );

  constructor() {
    afterNextRender(() => {
      this.grimoireService.setGrimoireElement(
        this.grimoireElement().nativeElement
      );

      if (this.gameStateService.info().states.playersPositionsWereCalculated) {
        return;
      }

      this.gameStateService.info.update(info => {
        return {
          ...info,
          players: positionPlayersInCircle(
            info.players,
            this.grimoireElement().nativeElement.getBoundingClientRect()
          ),
          states: {
            playersPositionsWereCalculated: true,
          },
        };
      });
    });
  }

  editPlayer(index: number) {
    this.dialog.open<PlayerEditModalComponent, PlayerEditModalData>(
      PlayerEditModalComponent,
      {
        width: '74%',
        maxWidth: '291px',
        data: {
          playerPositionInCircle: index,
        },
        autoFocus: false,
      }
    );
  }

  updatePlayerTokenPosition(event: { index: number; position: Point }) {
    this.gameStateService.updatePlayerByIndex(event.index, {
      ...this.gameStateService.getPlayerByIndex(event.index),
      positionInGrimoire: event.position,
    });
  }
}
