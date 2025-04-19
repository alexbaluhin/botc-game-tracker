import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-setup-header',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './game-setup-header.component.html',
  styleUrls: ['./game-setup-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupHeaderComponent {
  backLink = input.required<string>();
}
