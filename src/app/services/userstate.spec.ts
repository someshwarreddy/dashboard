import { TestBed } from '@angular/core/testing';

import { Userstate } from './userstate';

describe('Userstate', () => {
  let service: Userstate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Userstate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
