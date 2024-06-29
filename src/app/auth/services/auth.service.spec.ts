import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

xdescribe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting(),provideHttpClient()],
      providers:[HttpTestingController]
    });
    service = TestBed.inject(AuthService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
