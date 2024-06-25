
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UIService } from '../../../shared/services/ui.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  showErrorMessage = false;
  userStatus = 'Pending';
  title = 'Users Login';
  showPassword : boolean = false;
  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username:  ['', Validators.required],
      password:   ['', Validators.required]
    });
  }

  ngOnInit() {

  }


  handleFormSubmit(): void {
    this.showErrorMessage = this.form.invalid;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.login(this.form.value).subscribe(
      (res) => {
        this.uiService.closeForm();
        this.toastrService.success('Login successfully');
        localStorage.setItem('LoggedUser', JSON.stringify(res.user));
        this.router.navigate(['/users']);
      },
      (error) =>  this.toastrService.error(error.error.message)
    );
  }


  closeForm(): void {
    this.uiService.closeForm();
  }

  get animateFormClose() {
    return this.uiService.animationCloseForm;
  }
}
