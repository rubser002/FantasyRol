import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    
    return this.http.post<any>('https://localhost:7141/api/auth/login', user).pipe(
      tap(response => this.storeToken(response.token))
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>('https://localhost:7141/api/auth/register', user).pipe(
      tap(response => this.storeToken(response.token))
    );
  }

  isLoggedIn(): Promise<boolean> {
    const token = this.getToken();
    console.log(token);
    if (token) {
      return this.validateToken(token);
    }
  
    return Promise.resolve(false);
  }
  
  private async validateToken(token: string): Promise<boolean> {
    try {
      const data = await this.http.get<boolean>('https://localhost:7141/api/auth/check-token', { params: { token: token } }).toPromise();
      console.log(data);
      return data !== undefined ? data : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  

  logout(): void {
    this.removeToken();
  }

  private storeToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }
  
  private getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
  
  private removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
