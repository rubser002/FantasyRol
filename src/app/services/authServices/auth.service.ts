import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class User {
  id!: string;
  name!: string;
  email!: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  user: User = new User;
  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    
    return this.http.post<any>('https://localhost:7141/api/auth/login', user).pipe(
      tap(response => this.storeToken(response.token)),
      tap(response => this.storeUser(response.result))
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>('https://localhost:7141/api/auth/register', user).pipe(
      tap(response => this.storeToken(response.token)),
      tap(response => this.storeUser(response.result))
    );
  }

  isLoggedIn(): Promise<boolean> {
    const token = this.getToken();
    if (token) {
      return this.validateToken(token);
    }
  
    return Promise.resolve(false);
  }
  
  private async validateToken(token: string): Promise<boolean> {
    try {
      const data = await this.http.get<boolean>('https://localhost:7141/api/auth/check-token', { params: { token: token } }).toPromise();
      return data !== undefined ? data : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  

  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  private storeToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeUser(user: User){
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  public getUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
      const userObject = JSON.parse(userData);
      this.user = userObject;
      return userObject;
    }
    
    return null; // Return null when userData is null
  }
  
  private getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
  
  private removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
  private removeUser(): void {
    localStorage.removeItem('currentUser');
  }
}
