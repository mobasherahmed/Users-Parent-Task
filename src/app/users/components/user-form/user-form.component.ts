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
  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.userService.userToEdit) {
      this.title = 'Edit #' + this.userService.userToEdit.id;
      console.log("this.userService.userToEdit",this.userService.userToEdit)
      this.form.patchValue(this.userService.userToEdit);
    }
  }

  handleFormSubmit(): void {
    this.showErrorMessage = this.form.invalid;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newUser = this.form.value;
    newUser.createdAt = new Date();
    newUser.status = this.userStatus;

    if (!this.userService.userToEdit) {
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
