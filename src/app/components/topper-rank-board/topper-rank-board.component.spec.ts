import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopperRankBoardComponent } from './topper-rank-board.component';

describe('TopperRankBoardComponent', () => {
  let component: TopperRankBoardComponent;
  let fixture: ComponentFixture<TopperRankBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopperRankBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopperRankBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
