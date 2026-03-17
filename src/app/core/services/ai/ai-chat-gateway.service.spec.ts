import { TestBed } from '@angular/core/testing';

import { AiChatGatewayService } from './ai-chat-gateway.service';

describe('AiChatGatewayService', () => {
  let service: AiChatGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiChatGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
