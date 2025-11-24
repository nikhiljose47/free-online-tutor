import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeOnlineTutor } from './free-online-tutor';

describe('FreeOnlineTutor', () => {
  let component: FreeOnlineTutor;
  let fixture: ComponentFixture<FreeOnlineTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeOnlineTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeOnlineTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
