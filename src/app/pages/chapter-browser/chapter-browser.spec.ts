import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterBrowser } from './chapter-browser';

describe('ChapterBrowser', () => {
  let component: ChapterBrowser;
  let fixture: ComponentFixture<ChapterBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterBrowser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterBrowser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
