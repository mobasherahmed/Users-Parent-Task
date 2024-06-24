import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  LoggedUser: any;
  constructor(private http: HttpClient) { }

  login(user: {username:string,password:string}): Observable<any> {
    return this.http.post<any>(`${environment.base_url}${environment.login_endpoint}`, user);
  }

  isLoggedIn(): boolean {
    // @ts-ignore
    this.LoggedUser = JSON.parse(localStorage.getItem('LoggedUser'));
    if (!this.LoggedUser?.token) {
      return false;
    }
    return true;
  }

  isAdmin(): boolean {
    if (this.LoggedUser?.role === 'admin') {
      return true;
    }
    return false;
  }

}
