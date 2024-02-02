import { TestBed } from '@angular/core/testing';

import { GameSetupInfoService } from './game-setup-info.service';

describe('GameInfoService', () => {
  let service: GameSetupInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSetupInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
