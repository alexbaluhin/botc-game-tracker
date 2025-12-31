import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { smallestReminderTokenSize } from '../../../constants';
import { Reminder } from '../../../typings';

@Component({
  selector: 'app-reminder-token',
  imports: [NgOptimizedImage],
  templateUrl: './reminder-token.component.html',
  styleUrl: './reminder-token.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--token-size]': 'tokenSizeStyle()',
  },
})
export class ReminderTokenComponent {
  reminder = input.required<Reminder>();
  size = input<number>(smallestReminderTokenSize);

  tokenSizeStyle = computed(() => `${this.size()}px`);
  tokenBorderSize = 2;
  largeImageSize = computed(() => this.size() - this.tokenBorderSize * 2);
}
