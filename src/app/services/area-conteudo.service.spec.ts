import { TestBed } from '@angular/core/testing';

import { AreaConteudoService } from './area-conteudo.service';

describe('AreaConteudoService', () => {
  let service: AreaConteudoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaConteudoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
