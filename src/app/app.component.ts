import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UIService } from './shared/services/ui.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { UserFormComponent } from './users/components/user-form/user-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, UserFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Users-Parent-Task';
  constructor( public uiService: UIService) {}

  get openForm() {
    return this.uiService.openForm;
  }
}
