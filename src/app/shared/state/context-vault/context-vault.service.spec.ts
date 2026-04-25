import { TestBed } from '@angular/core/testing';

import { ContextVaultService } from './context-vault.service';

describe('ContextVaultService', () => {
  let service: ContextVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
