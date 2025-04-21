import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Script } from '../../../constants';
import { TransparentButtonComponent } from '../../../shared/components/transparent-button/transparent-button.component';
import { CustomScriptJson, CustomScriptJsonMetaItem } from '../../../typings';
import { GameStateService } from '../../../shared/data-access/game-state.service';

@Component({
  selector: 'app-script-selection',
  imports: [NgOptimizedImage, TransparentButtonComponent],
  templateUrl: './script-selection.component.html',
  styleUrls: ['./script-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptSelectionComponent {
  router = inject(Router);
  gameStateService = inject(GameStateService);

  scripts = Script;

  onScriptChoose(script: Script) {
    this.gameStateService.setScript(script);
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
        const customScript = JSON.parse(fileReader.result) as CustomScriptJson;
        const customScriptMetaInfo = customScript.find(
          (item): item is CustomScriptJsonMetaItem => item.id === '_meta'
        );
        const customScriptCharacters = customScript
          .filter(({ id }) => id !== '_meta')
          .map(character => ({
            ...character,
            id: character.id.replace(/[_-]/g, ''),
          }));

        this.gameStateService.setScript(
          Script.CUSTOM,
          customScriptMetaInfo?.name,
          customScriptCharacters
        );
        this.router.navigate(['players-count-selection']);
      } catch {
        console.error('Cannot parse custom script');
      }
    };
  }
}
