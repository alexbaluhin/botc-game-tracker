import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  Directive,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Directive({
  selector: '[appTransparentButtonImg]',
})
export class TransparentButtonImgDirective {}

@Component({
  selector: 'app-transparent-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './transparent-button.component.html',
  styleUrl: './transparent-button.component.scss',
})
export class TransparentButtonComponent {
  link = input<string>();
  disabled = input<boolean>();
  image = contentChild(TransparentButtonImgDirective);
  buttonClicked = output();
}
