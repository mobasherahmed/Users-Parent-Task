import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UIService } from '../../../shared/services/ui.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  showErrorMessage = false;
  userStatus = 'Pending';
  title = 'Create User';
  showPassword : boolean = false;
  passwordError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required],
      email: ['',[ Validators.required,Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },{ validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (this.userService.userToEdit) {
      this.title = 'Edit #' + this.userService.userToEdit.id;
      this.form.patchValue(this.userService.userToEdit);
      this.form.get('confirmPassword')?.setValue(this.userService.userToEdit.password);
      this.userStatus = this.userService.userToEdit.status;
    }
  }

  passwordMatchValidator(formGroup: FormGroup): null | object {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  handleFormSubmit(): void {
    this.showErrorMessage = this.form.invalid && !this.form.hasError('mismatch');
    this.passwordError = this.form.hasError('mismatch');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newUser = this.form.value;
    newUser.status = this.userStatus;
    
    if (!this.userService.userToEdit) {
      
      newUser.createdAt = new Date();
      newUser.role = 'user';
      newUser.avatar = 'https://reqres.in/img/faces/5-image.jpg';
      newUser.status = this.userStatus;
      
      this.userService.createUser(newUser).subscribe({
        next: () => {
          this.userService.activeFilter = null;
          this.userService.refreshUsers$.next(true);
          this.uiService.closeForm();
          this.toastrService.success('Users created successfully');
        },
        error: (error) => this.toastrService.error(error.message),
      });
    } else {
      newUser.updatedAt = new Date();
      newUser.role = this.userService.userToEdit.role;
      newUser.avatar = this.userService.userToEdit.avatar;
      this.userService
        .updateUser(this.userService.userToEdit.id, newUser)
        .subscribe({
          next: ()=>{
            this.userService.refreshUsers$.next(true);
            this.uiService.closeForm();
            this.toastrService.success('Users updated successfully');
          },
          error: (error) => this.toastrService.error(error.message),
        });
    }
  }

  saveAsDraft(): void {
    if (this.form.valid) {
      this.userStatus = 'Draft';
    }
    this.handleFormSubmit();
  }

  closeForm(): void {
    this.uiService.closeForm();
  }

  get animateFormClose() {
    return this.uiService.animationCloseForm;
  }
}
