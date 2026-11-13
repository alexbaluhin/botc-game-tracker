import { Component } from '@angular/core';
import { GameNavLinkComponent } from '../game-nav-link/game-nav-link.component';

@Component({
  selector: 'app-game-nav',
  imports: [GameNavLinkComponent],
  templateUrl: './game-nav.component.html',
  styleUrl: './game-nav.component.scss',
})
export class GameNavComponent {}
