import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqPuzzleCard } from './mcq-puzzle-card';

describe('McqPuzzleCard', () => {
  let component: McqPuzzleCard;
  let fixture: ComponentFixture<McqPuzzleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McqPuzzleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McqPuzzleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
