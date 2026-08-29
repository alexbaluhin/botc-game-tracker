import { DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { CharactersExpandableListComponent } from '../../../shared/components/characters-expandable-list/characters-expandable-list.component';
import { GameStore } from '../../../shared/data-access/game-state-store';
import { Character } from '../../../shared/types/common';

@Component({
  selector: 'app-bluff-selection-modal',
  imports: [
    NgOptimizedImage,
    CharactersExpandableListComponent,
    ActionBarComponent,
  ],
  templateUrl: './bluff-selection-modal.component.html',
  styleUrl: './bluff-selection-modal.component.scss',
})
export class BluffSelectionModalComponent {
  dialog =
    inject<DialogRef<Character, BluffSelectionModalComponent>>(DialogRef);
  gameStore = inject(GameStore);
}
