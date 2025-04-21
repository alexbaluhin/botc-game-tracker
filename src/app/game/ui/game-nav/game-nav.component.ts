import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButtonComponent } from '../../../shared/components/icon-button/icon-button.component';

@Component({
  selector: 'app-game-nav',
  imports: [IconButtonComponent, NgOptimizedImage],
  templateUrl: './game-nav.component.html',
  styleUrl: './game-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameNavComponent {}
