import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ApiResponse, User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone : true,
  imports: [HeaderComponent,UserListComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  users: User[] = []
  getUsers$!: Subscription;
  refreshUsers$!: Subscription;

  constructor(private usersService: UserService, private titleService: Title) {}

  ngOnInit(): void {
    this.usersService.userToEdit = null;
      this.getUsers$ = this.usersService.getUsers()
        .subscribe(res => this.setUsers(res) );

    this.refreshUsers$ = this.usersService.refreshUsers$
      .pipe(switchMap(() => this.usersService.getUsers()))
      .subscribe(res => this.setUsers(res))
  }



  setUsers(res: ApiResponse) {
    this.users = res.data
    this.usersService.userCounter = this.users.length;
    // use set to update the value of the signal
    this.usersService.counter.set(this.users.length);   
    this.titleService.setTitle(`Users (${this.users.length})`)
  }

  ngOnDestroy(): void {
    this.getUsers$?.unsubscribe()
    this.refreshUsers$?.unsubscribe()
  }
}
