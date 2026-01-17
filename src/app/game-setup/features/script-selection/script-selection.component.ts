import { Dialog } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { scripts } from '../../../core-data';
import { enrichCharacterInfo } from '../../../core-data/utils/characters';
import {
  TransparentButtonComponent,
  TransparentButtonImgDirective,
} from '../../../shared/components/transparent-button/transparent-button.component';
import { Script, ScriptCharacter, ScriptMetaInfo } from '../../../typings';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { ScriptForSelection } from '../../typings';
import { GameLogoComponent } from '../../ui/game-logo/game-logo.component';
import {
  ScriptSelectionViewModalComponent,
  ScriptSelectionViewModalData,
} from '../script-selection-view-modal/script-selection-view-modal.component';

@Component({
  selector: 'app-script-selection',
  imports: [
    TransparentButtonComponent,
    NgOptimizedImage,
    TransparentButtonImgDirective,
    GameLogoComponent,
  ],
  templateUrl: './script-selection.component.html',
  styleUrls: ['./script-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptSelectionComponent {
  private router = inject(Router);
  private gameStateService = inject(GameStateService);
  private dialog = inject(Dialog);

  scripts: ScriptForSelection[] = scripts.map(script =>
    this.mapScriptToSelection(script)
  );

  onScriptChoose(script: ScriptForSelection) {
    this.openSelectedScriptView(script);
  }

  onCustomScriptLoad(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      try {
        if (typeof fileReader.result !== 'string') {
          console.error('Incorrect format of custom script');
          return;
        }
        const customScript = JSON.parse(fileReader.result) as Script;
        const { name, characters } = this.mapScriptToSelection(customScript);
        this.openSelectedScriptView({ name, characters });
      } catch {
        console.error('Cannot parse custom script');
      }
    };
  }

  private openSelectedScriptView(script: ScriptForSelection) {
    this.dialog
      .open<
        boolean,
        ScriptSelectionViewModalData,
        ScriptSelectionViewModalComponent
      >(ScriptSelectionViewModalComponent, {
        minWidth: '100%',
        height: '100%',
        data: {
          script,
        },
      })
      .closed.subscribe(result => {
        if (result) {
          this.gameStateService.setScript(script.name, script.characters);
          this.router.navigate(['game-setup/players-count-selection']);
        }
      });
  }

  private mapScriptToSelection(script: Script): ScriptForSelection {
    const scriptMetaInfo = script.find(
      (item): item is ScriptMetaInfo => item.id === '_meta'
    );
    return {
      name: scriptMetaInfo?.name ?? 'Unknown Script',
      logo: scriptMetaInfo?.logo,
      characters: enrichCharacterInfo(
        script
          .filter((item): item is ScriptCharacter => item.id !== '_meta')
          .map(character => ({
            ...character,
            id: character.id.replace(/[_-]/g, ''),
          }))
      ),
    };
  }
}
