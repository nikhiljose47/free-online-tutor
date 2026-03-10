import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPlaceholderComponent } from './cover-placeholder.component';

describe('CoverPlaceholderComponent', () => {
  let component: CoverPlaceholderComponent;
  let fixture: ComponentFixture<CoverPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
