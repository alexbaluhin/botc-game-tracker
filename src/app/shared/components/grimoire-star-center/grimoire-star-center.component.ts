import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grimoire-star-center',
  imports: [NgTemplateOutlet],
  templateUrl: './grimoire-star-center.component.html',
  styleUrl: './grimoire-star-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrimoireStarCenterComponent {}
