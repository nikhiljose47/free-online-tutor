import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIntroStrip } from './home-intro-strip';

describe('HomeIntroStrip', () => {
  let component: HomeIntroStrip;
  let fixture: ComponentFixture<HomeIntroStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeIntroStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeIntroStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
