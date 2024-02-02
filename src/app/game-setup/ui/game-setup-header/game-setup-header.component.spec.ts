import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSetupHeaderComponent } from './game-setup-header.component';

describe('HeaderComponent', () => {
  let component: GameSetupHeaderComponent;
  let fixture: ComponentFixture<GameSetupHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameSetupHeaderComponent],
    });
    fixture = TestBed.createComponent(GameSetupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
