
import { Component, EventEmitter, Inject, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../users/interfaces/user.interface';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  standalone: true,
  imports: [],
})
export class CreditsComponent {
  @Output()
  closeCreditsScreen: EventEmitter<boolean> = new EventEmitter<boolean>();
  private router = inject(Router);
  public authService = inject(AuthService);
  LoggedUser!: User;
  animateClose: boolean = false;

  links = [
    {
      path: 'https://github.com/mobasherahmed/Users-Parent-Task',
      name: 'Visit git repo',
    }
  ];

  logOut(): void {
    localStorage.removeItem('LoggedUser');
    this.router.navigate(['']);
    this.handleClose();
  }

    ngOnInit(){
        // @ts-ignore
        this.LoggedUser = JSON.parse(localStorage.getItem('LoggedUser'));
    }

  handleClose(): void {

    this.animateClose = true;
    /**
     * A timeout is added to execute the animation
     * at the closing of the screen
     */
    setTimeout(() => {
      this.animateClose = false;
      this.closeCreditsScreen.emit(false);
    }, 200);
  }
}
