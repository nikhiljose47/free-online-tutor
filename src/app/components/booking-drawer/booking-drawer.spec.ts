import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDrawer } from './booking-drawer';

describe('BookingDrawer', () => {
  let component: BookingDrawer;
  let fixture: ComponentFixture<BookingDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
