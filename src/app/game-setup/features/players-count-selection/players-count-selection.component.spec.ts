import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersCountSelectionComponent } from './players-count-selection.component';

describe('PlayersCountSelectionComponent', () => {
  let component: PlayersCountSelectionComponent;
  let fixture: ComponentFixture<PlayersCountSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlayersCountSelectionComponent]
    });
    fixture = TestBed.createComponent(PlayersCountSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
