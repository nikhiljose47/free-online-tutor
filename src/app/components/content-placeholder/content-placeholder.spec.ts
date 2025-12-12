import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlaceholder } from './content-placeholder';

describe('ContentPlaceholder', () => {
  let component: ContentPlaceholder;
  let fixture: ComponentFixture<ContentPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentPlaceholder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentPlaceholder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
