import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flat-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './flat-button.component.html',
  styleUrl: './flat-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatButtonComponent {
  link = input<string>();
  disabled = input<boolean>();
  buttonClicked = output();
}
