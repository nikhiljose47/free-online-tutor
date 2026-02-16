import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassOverviewBatches } from './class-overview-batches';

describe('ClassOverviewBatches', () => {
  let component: ClassOverviewBatches;
  let fixture: ComponentFixture<ClassOverviewBatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassOverviewBatches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassOverviewBatches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
