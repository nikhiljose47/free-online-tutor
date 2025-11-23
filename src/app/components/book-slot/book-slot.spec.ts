import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSlot } from './book-slot';

describe('BookSlot', () => {
  let component: BookSlot;
  let fixture: ComponentFixture<BookSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
