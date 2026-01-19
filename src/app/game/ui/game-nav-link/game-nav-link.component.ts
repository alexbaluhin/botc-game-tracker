import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-game-nav-link',
  imports: [RouterLink, NgTemplateOutlet, RouterLinkActive],
  templateUrl: './game-nav-link.component.html',
  styleUrl: './game-nav-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameNavLinkComponent {
  link = input.required<string>();
  disabled = input<boolean>();
  buttonClicked = output();
}
