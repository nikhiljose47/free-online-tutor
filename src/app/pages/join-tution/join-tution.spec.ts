import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTution } from './join-tution';

describe('JoinTution', () => {
  let component: JoinTution;
  let fixture: ComponentFixture<JoinTution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinTution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinTution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
