import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersSelectionComponent } from './characters-selection.component';

describe('CharactersSelectionComponent', () => {
  let component: CharactersSelectionComponent;
  let fixture: ComponentFixture<CharactersSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharactersSelectionComponent],
    });
    fixture = TestBed.createComponent(CharactersSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
