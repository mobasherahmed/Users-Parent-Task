import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UIService } from '../../../shared/services/ui.service';
import { UserItemComponent } from '../user-item/user-item.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [UserItemComponent]
})
export class UserListComponent implements OnInit {
  @Input() users!: User[];
  activeFilter: string = '';

  constructor(private uiService: UIService) {}

  ngOnInit(): void {
    this.uiService.activeFilter.subscribe(
      (filter) => (this.activeFilter = filter)
    );
  }
}
