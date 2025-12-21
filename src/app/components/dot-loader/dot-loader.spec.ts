import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotLoader } from './dot-loader';

describe('DotLoader', () => {
  let component: DotLoader;
  let fixture: ComponentFixture<DotLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
