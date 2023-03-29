import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private http:HttpClient) { }

  isAuthenticated():boolean{
    if (sessionStorage.getItem('token')!==null) {
        return true;
    }
    return false;
  }

  canAccess(){
    if (!this.isAuthenticated()) {
        //redirect to login
        this.router.navigate(['/login']);
    }
  }
  canAuthenticate(){
    if (this.isAuthenticated()) {
      //redirect to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  register(name:string,email:string,password:string){
      //send data to register api (firebase)
     return this.http
      .post<{idToken:string}>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]',
          {displayName:name,email,password}
      );
  }

  storeToken(token:string){
      sessionStorage.setItem('token',token);
  }

  login(email:string,password:string){
    //send data to login api (firebase)
      return this.http
      .post<{idToken:string}>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]',
            {email,password}
      );
  }

  detail(){
    let token = sessionStorage.getItem('token');
    return token;
  }

  removeToken(){
    sessionStorage.removeItem('token');
  }
  // private baseUrl = 'http://127.0.0.1:5000';
  // downloadFile(): Observable<Blob> {
  //   const url = `${this.baseUrl}/download`;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/pdf'
  //   });
  //   return this.http.get(url, { headers, responseType: 'blob' });
  // }

}
