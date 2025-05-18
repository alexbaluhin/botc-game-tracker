import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonType = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  type = input<ButtonType>();
  link = input<string>();
  disabled = input<boolean>();
  buttonClicked = output();
}
