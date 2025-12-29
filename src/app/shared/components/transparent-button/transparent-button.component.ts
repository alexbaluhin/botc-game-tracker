import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transparent-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './transparent-button.component.html',
  styleUrl: './transparent-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransparentButtonComponent {
  link = input<string>();
  disabled = input<boolean>();
  smallText = input<boolean>(false);
  buttonClicked = output();
}
