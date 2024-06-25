import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../shared/services/modal.service';
import { UIService } from '../../../shared/services/ui.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports:[CommonModule,ModalComponent,RouterLink]
})
export class UserComponent implements OnInit, OnDestroy {
  user!: User;
  activatedRoute$!: Subscription;
  refreshUsers$!: Subscription;
  updateUsers$!: Subscription;
  deleteUsers$!: Subscription;
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    private router: Router,
    private uiService: UIService,
    private toastrService: ToastrService,
    private titleService: Title,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute$ = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.getUser(id)))
      .subscribe((user) => {
        this.user = user
        this.setTitle()
      });

    this.refreshUsers$ = this.userService.refreshUsers$
      .pipe(switchMap(() => this.userService.getUser(this.user.id)))
      .subscribe((user) => this.user = user);

    this.isAdmin = this.authService.isAdmin();
  }

  markAsActive(): void {
    this.user.status = 'Active'
    const {id, ...rest} = this.user
    this.updateUsers$ = this.userService.updateUser(this.user.id, rest)
      .subscribe(() => this.toastrService.success('Invoice updated successfully'))
  }


  openModal(): void {
    this.modalService.open();
  }

  closeModal(): void {
    this.modalService.close();
  }

  handleEdit(): void {
    this.uiService.toggleForm();
    this.userService.userToEdit = this.user;
  }

  handleDelete(): void {
    this.deleteUsers$ = this.userService.deleteUser(this.user.id)
      .subscribe(() => {
        this.toastrService.success('Users deleted successfully')
        this.modalService.close();
        this.router.navigate(['/users']);
      })
  }

  setTitle(): void {
    this.titleService.setTitle(`Users | #${this.user?.id}`)
  }

  ngOnDestroy(): void {
    this.activatedRoute$?.unsubscribe();
    this.refreshUsers$?.unsubscribe();
    this.updateUsers$?.unsubscribe();
    this.deleteUsers$?.unsubscribe();
  }
}
