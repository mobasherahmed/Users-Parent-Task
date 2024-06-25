import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header/header.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { User } from '../../interfaces/user.interface';
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
  filterUsers$!: Subscription;

  constructor(private usersService: UserService, private titleService: Title) {}

  ngOnInit(): void {
    this.usersService.userToEdit = null;
    if(this.usersService.activeFilter) {
      this.filterByStatus(this.usersService.activeFilter)
    } else {
      this.getUsers$ = this.usersService.getUsers()
        .subscribe(users => this.setUsers(users) );
    }

    this.refreshUsers$ = this.usersService.refreshUsers$
      .pipe(switchMap(() => this.usersService.getUsers()))
      .subscribe(users => this.setUsers(users))
  }


  filterByStatus(status: string | any): void {
    this.usersService.activeFilter = status;
    this.filterUsers$ = this.usersService.getUsers(status)
      .subscribe(users => this.setUsers(users));
  }

  setUsers(users: User[]) {
    this.users = users;
    this.usersService.userCounter = this.users.length;
    // use set to update the value of the signal
    this.usersService.counter.set(this.users.length);   
    this.titleService.setTitle(`Users (${this.users.length})`)
  }

  ngOnDestroy(): void {
    this.getUsers$?.unsubscribe()
    this.refreshUsers$?.unsubscribe()
    this.filterUsers$?.unsubscribe()
  }
}
