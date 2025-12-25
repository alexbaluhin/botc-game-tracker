import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { Player } from 'src/app/typings';
import { LongPressDirective } from '../../directives/long-press.directive';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-grimoire',
  templateUrl: './grimoire.component.html',
  styleUrl: './grimoire.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlayerComponent, NgOptimizedImage, LongPressDirective, CdkDrag],
})
export class GrimoireComponent {
  setupMode = input.required<boolean>();
  players = input.required<Player[]>();
  playerClicked = output<number>();
  playerLongPressed = output<number>();
  playerTokenMoved = output<{ index: number; position: Point }>();

  grimoireElement = inject<ElementRef<HTMLElement>>(ElementRef);

  isDragging: boolean = false;

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
