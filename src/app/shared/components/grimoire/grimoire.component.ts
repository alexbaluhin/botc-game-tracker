import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { Player } from 'src/app/typings';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-grimoire',
  templateUrl: './grimoire.component.html',
  styleUrl: './grimoire.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlayerComponent],
})
export class GrimoireComponent {
  players = input.required<Player[]>();

  playersElements = viewChildren<PlayerComponent, ElementRef>('playerElement', {
    read: ElementRef,
  });

  playerClicked = output<number>();

  constructor() {
    effect(() => {
      const playersCount = this.playersElements().length;
      for (let i = 0; i < playersCount; i++) {
        const t = ((2 * Math.PI) / playersCount) * (i + playersCount * 0.75);
        const cosT = Math.cos(t);
        const sinT = Math.sin(t);
        const horizontalRadius = 150;
        const verticalRadius = 200;
        const superEllipseRadius = 2;

        const x =
          horizontalRadius *
          Math.sign(cosT) *
          Math.pow(Math.abs(cosT), 2 / superEllipseRadius);
        const y =
          verticalRadius *
          Math.sign(sinT) *
          Math.pow(Math.abs(sinT), 2 / superEllipseRadius);

        const element = this.playersElements()[i].nativeElement;
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
      }
    });
  }
}
