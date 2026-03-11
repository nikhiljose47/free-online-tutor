import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeOnlineTuition } from './free-online-tuition';

describe('FreeOnlineTuition', () => {
  let component: FreeOnlineTuition;
  let fixture: ComponentFixture<FreeOnlineTuition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeOnlineTuition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeOnlineTuition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
