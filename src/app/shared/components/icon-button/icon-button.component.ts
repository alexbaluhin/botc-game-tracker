import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-icon-button',
  imports: [RouterLink, NgTemplateOutlet, NgOptimizedImage],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  link = input<string>();
  disabled = input<boolean>();
  iconSrc = input<string>();
  iconAlt = input<string>();
  buttonClicked = output();
}
