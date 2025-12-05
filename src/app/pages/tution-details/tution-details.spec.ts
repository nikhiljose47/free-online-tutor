import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionDetails } from './tution-details';

describe('TutionDetails', () => {
  let component: TutionDetails;
  let fixture: ComponentFixture<TutionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
