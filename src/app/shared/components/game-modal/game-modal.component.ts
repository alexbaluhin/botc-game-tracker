import { DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-game-modal',
  imports: [NgOptimizedImage],
  templateUrl: './game-modal.component.html',
  styleUrl: './game-modal.component.scss',
})
export class GameModalComponent {
  dialogRef = inject<DialogRef<never, GameModalComponent>>(DialogRef);
}
