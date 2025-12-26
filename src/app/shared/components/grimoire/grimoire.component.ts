import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { Player } from 'src/app/typings';
import { calculatePlayerTokenSize } from '../../layout/players-circle';
import { GrimoireStarCenterComponent } from '../grimoire-star-center/grimoire-star-center.component';
import { PlayerTokenComponent } from '../player-token/player-token.component';

@Component({
  selector: 'app-grimoire',
  templateUrl: './grimoire.component.html',
  styleUrl: './grimoire.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlayerTokenComponent,
    NgOptimizedImage,
    CdkDrag,
    GrimoireStarCenterComponent,
  ],
})
export class GrimoireComponent {
  setupMode = input.required<boolean>();
  players = input.required<Player[]>();
  playerClicked = output<number>();
  playerTokenMoved = output<{ index: number; position: Point }>();

  grimoireElement = inject<ElementRef<HTMLElement>>(ElementRef);

  tokenSize = computed(() => calculatePlayerTokenSize(this.players().length));

  isDragging: boolean = false;

  xmasSpecialGrimoire: boolean = true;

  playerTokenClicked(index: number) {
    if (!this.isDragging) {
      this.playerClicked.emit(index);
    }
  }

  draggingEnd(event: CdkDragEnd, index: number, player: Player) {
    this.playerTokenMoved.emit({
      index,
      position: {
        x: player.positionInGrimoire.x + event.distance.x,
        y: player.positionInGrimoire.y + event.distance.y,
      },
    });

    setTimeout(() => (this.isDragging = false));
  }
}
