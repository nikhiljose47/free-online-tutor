import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTutor } from './join-tutor';

describe('JoinTutor', () => {
  let component: JoinTutor;
  let fixture: ComponentFixture<JoinTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
