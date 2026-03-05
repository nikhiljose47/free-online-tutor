import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuitionMarketplace } from './tuition-marketplace';

describe('TuitionMarketplace', () => {
  let component: TuitionMarketplace;
  let fixture: ComponentFixture<TuitionMarketplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuitionMarketplace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuitionMarketplace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
