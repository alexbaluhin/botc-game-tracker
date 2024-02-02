import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTokenComponent } from './character-token.component';

describe('CharacterTokenComponent', () => {
  let component: CharacterTokenComponent;
  let fixture: ComponentFixture<CharacterTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterTokenComponent]
    });
    fixture = TestBed.createComponent(CharacterTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
