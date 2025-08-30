import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  delay,
  filter,
  fromEvent,
  merge,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';

@Directive({
  selector: '[appLongPress]',
})
export class LongPressDirective {
  element = inject(ElementRef);
  duration = input<number>(500);
  disableLongPress = input<boolean>(false);
  longPress = output<MouseEvent>();

  constructor() {
    const longPressStarted$ = merge(
      fromEvent<MouseEvent>(this.element.nativeElement, 'mousedown'),
      fromEvent<MouseEvent>(this.element.nativeElement, 'touchstart')
    );
    const longPressEnded$ = merge(
      fromEvent<MouseEvent>(this.element.nativeElement, 'mouseup'),
      fromEvent<MouseEvent>(this.element.nativeElement, 'mouseleave'),
      fromEvent<MouseEvent>(this.element.nativeElement, 'touchend'),
      fromEvent<MouseEvent>(this.element.nativeElement, 'touchcancel')
    );
    longPressStarted$
      .pipe(
        filter(() => !this.disableLongPress()),
        switchMap(event =>
          of(event).pipe(delay(this.duration()), takeUntil(longPressEnded$))
        ),
        takeUntilDestroyed()
      )
      .subscribe(event => {
        this.longPress.emit(event);
        // suppress all clicks events
        this.element.nativeElement.addEventListener(
          'click',
          (event: Event) => event.stopImmediatePropagation(),
          { once: true, capture: true }
        );
      });
  }
}
