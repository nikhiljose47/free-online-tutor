import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTutorChatComponent } from './ai-tutor-chat.component';

describe('AiTutorChatComponent', () => {
  let component: AiTutorChatComponent;
  let fixture: ComponentFixture<AiTutorChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTutorChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTutorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
