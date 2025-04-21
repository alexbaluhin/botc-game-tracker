import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';

@Component({
  selector: 'app-scripts-view',
  imports: [ActionBarComponent, GameNavComponent, CharacterCardComponent],
  templateUrl: './script-view.component.html',
  styleUrl: './script-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptViewComponent {
  gameStateService = inject(GameStateService);
}
