import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Script } from '../../../constants';
import { CustomScriptJson, CustomScriptJsonMetaItem } from '../../../typings';
import { GameSetupInfoService } from '../../data-access/game-setup-info.service';

@Component({
  selector: 'app-script-selection',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './script-selection.component.html',
  styleUrls: ['./script-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptSelectionComponent {
  router = inject(Router);
  gameSetupInfoService = inject(GameSetupInfoService);

  scripts = Script;

  onScriptChoose(script: Script) {
    this.gameSetupInfoService.setScript(script);
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

        this.gameSetupInfoService.setScript(
          Script.CUSTOM,
          customScriptMetaInfo?.name,
          customScriptCharacters
        );
        this.router.navigate(['players-count-selection']);
      } catch (e) {
        console.error('Cannot parse custom script');
      }
    };
  }
}
