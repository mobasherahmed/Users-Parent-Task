import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userToEdit: User | null = null;
  refreshUsers$ = new Subject();
  statusCatalog = new BehaviorSubject(['Paid', 'Draft', 'Pending']);
  userCounter = 0;
  activeFilter : any = null;
  counter = signal(0);

  constructor(private http: HttpClient) {}

  createUser(item: any): Observable<any> {
     return this.http.post<any>(`${environment.base_url}${environment.user_endpoint}`, item);
  }
 
  getUsers(status? : string): Observable<any> {
   let params = new HttpParams();
   if (status) {
     params = params.append('status', status);
   }
   return this.http.get<User[]>(
      `${environment.base_url}${environment.user_endpoint}`,
      { params}
    );    
  }
 
  getUser(id: string): Observable<any> {
      return this.http.get<User>(
         `${environment.base_url}${environment.user_endpoint}/${id}`
       );
   }

  updateUser(id: string, item: any): Observable<any> {
     return this.http.put<any>(`${environment.base_url}${environment.user_endpoint}/${id}`, item);
  }
 
  deleteUser(id: string): Observable<any> {
     return this.http.delete<any>(`${environment.base_url}${environment.user_endpoint}/${id}`);
  }
}
