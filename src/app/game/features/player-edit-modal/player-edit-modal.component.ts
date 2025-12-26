import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FlatButtonComponent } from '../../../shared/components/flat-button/flat-button.component';
import { GameModalComponent } from '../../../shared/components/game-modal/game-modal.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { CharacterEditModalComponent } from '../character-edit-modal/character-edit-modal.component';

export type PlayerEditModalData = {
  playerPositionInCircle: number;
};

@Component({
  selector: 'app-player-edit-modal',
  imports: [
    FormsModule,
    GameModalComponent,
    FlatButtonComponent,
    NgOptimizedImage,
  ],
  templateUrl: './player-edit-modal.component.html',
  styleUrl: './player-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditModalComponent implements OnInit, OnDestroy {
  private dialog = inject(Dialog);
  private dialogRef =
    inject<DialogRef<never, PlayerEditModalComponent>>(DialogRef);
  private dialogData: PlayerEditModalData = inject(DIALOG_DATA);
  gameStateService = inject(GameStateService);

  player = computed(() =>
    this.gameStateService.getPlayerByIndex(
      this.dialogData.playerPositionInCircle
    )
  );
  playerName = model<string>(this.player().name ?? '');
  playerNameUpdates = toObservable(this.playerName).pipe(debounceTime(300));

  private readonly unsubscribe = new Subject<void>();

  ngOnInit() {
    this.playerNameUpdates.pipe(takeUntil(this.unsubscribe)).subscribe(name => {
      this.gameStateService.updatePlayerByIndex(
        this.dialogData.playerPositionInCircle,
        {
          ...this.player(),
          name,
        }
      );
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  editCharacter() {
    this.dialog
      .open<CharacterEditModalComponent, PlayerEditModalData>(
        CharacterEditModalComponent,
        {
          minWidth: '100%',
          height: '100%',
          data: this.dialogData,
          autoFocus: false,
        }
      )
      .closed.subscribe(() => this.dialogRef.close());
  }

  togglePlayerShroud() {
    this.gameStateService.updatePlayerByIndex(
      this.dialogData.playerPositionInCircle,
      {
        ...this.player(),
        isDead: !this.player().isDead,
      }
    );
    this.dialogRef.close();
  }
}
