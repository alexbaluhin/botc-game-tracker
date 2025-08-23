import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransparentButtonComponent } from '../../../shared/components/transparent-button/transparent-button.component';
import { GameLogoComponent } from '../../ui/game-logo/game-logo.component';

@Component({
  selector: 'app-mode-selection',
  imports: [GameLogoComponent, TransparentButtonComponent, NgOptimizedImage],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectionComponent {}
