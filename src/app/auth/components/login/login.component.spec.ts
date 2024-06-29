import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { User } from '../../../users/interfaces/user.interface';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ToastrModule.forRoot()],
      providers: [provideHttpClientTesting(), provideHttpClient(),{provide: AuthService, useClass: MockAuthService}],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form controls', () => {
    expect(component.form.contains('username')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should make the username control required', () => {
    let control = component.form.get('username');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the password control required', () => {
    let control = component.form.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('form should be invalid if password or user is invalid', () => {
    let control = component.form.get('username');
    control?.setValue('');
    control = component.form.get('password');
    control?.setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should disable the login button if form is invalid', () => {
    let control = component.form.get('username');
    control?.setValue('');
    control = component.form.get('password');
    control?.setValue('');
    expect(component.form.valid).toBeFalsy();
    let button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should enable the login button if form is valid', () => {
    let control = component.form.get('username');
    control?.setValue('username');
    control = component.form.get('password');
    control?.setValue('password');
    expect(component.form.valid).toBeTruthy();
    let button = fixture.debugElement.query(By.css('button')).nativeElement;
    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();
  });

  it('should toggle password field type', () => {
    let passwordInput = fixture.debugElement.query(
      By.css('[data-testid="password"]')
    ).nativeElement;
    expect(passwordInput).toBeTruthy();
    expect(passwordInput.type).toBe('password');
    let toggleButton = fixture.debugElement.query(
      By.css('[data-testid="toggle-password"]')
    ).nativeElement;
    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');
    toggleButton.click();
  });

  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'handleFormSubmit');
    component.form.controls['username'].setValue('testuser');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();

    let loginBtn = fixture.debugElement.query(By.css('[data-test-id="loginBtn"]')).nativeElement;
    loginBtn.click();

    expect(component.handleFormSubmit).toHaveBeenCalled();
  });
  it('should call login api', () => {
    spyOn(authService, 'login').and.callThrough();
    component.form.controls['username'].setValue('testuser');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();

    component.handleFormSubmit();
    expect(authService.login).toHaveBeenCalled();

  });

  it('should set user in local storage', () => {
    component.form.controls['username'].setValue('testuser');
    component.form.controls['password'].setValue('password');
    fixture.detectChanges();

    component.handleFormSubmit();
    expect(localStorage.getItem('LoggedUser')).toBeTruthy();
  });

});



class MockAuthService {
  login(username: string, password: string) {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
      password: 'password',
      first_name: 'Test',
      last_name: 'User',
      avatar: 'avatar.png',
      role: 'admin',
      job: 'developer',
      status: 'active'
    };
    return of(user);
  }
}

