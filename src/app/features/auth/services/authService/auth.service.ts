import { Injectable } from '@angular/core';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, catchError, of, map } from 'rxjs';

import { AuthResponse } from '../../models/authDTO/authResponse.model';
import { LoginRequest } from '../../models/authDTO/loginRequest.model';
import { RegisterRequest } from '../../models/authDTO/registerRequest.model';
import { AuthUserResponse } from '../../../user/models/userDTO/authUserResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authUrl: string;
  private readonly tokenKey = 'auth_token';

  // =========================
  // STATE
  // =========================

  private tokenSubject = new BehaviorSubject<string | null>(this.loadToken());
  public token$ = this.tokenSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<AuthUserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private sharedService: SharedService,
    private http: HttpClient
  ) {
    this.authUrl = this.sharedService.publicUrl + '/auth';

    // restore session on refresh
    if (this.tokenSubject.value) {
      this.loadCurrentUser().subscribe();
    }
  }

  // =========================
  // LOGIN
  // =========================
  login(request: LoginRequest): Observable<AuthUserResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, request).pipe(
      tap(res => this.setToken(res.token)),
      tap(res => this.setCurrentUser(res.user)),
      map(res => res.user)
    );
  }

  // =========================
  // REGISTER
  // =========================
  register(request: RegisterRequest): Observable<AuthUserResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, request).pipe(
      tap(res => this.setToken(res.token)),
      tap(res => this.setCurrentUser(res.user)),
      map(res => res.user)
    );
  }

  // =========================
  // CURRENT USER (refresh from backend)
  // =========================
  loadCurrentUser(): Observable<AuthUserResponse | null> {
    return this.http.get<AuthUserResponse>(`${this.authUrl}/me`).pipe(
      tap(user => this.setCurrentUser(user)),
      catchError(err => {
        console.error('Failed to load user', err);
        this.logout();
        return of(null);
      })
    );
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  // =========================
  // HELPERS
  // =========================
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): AuthUserResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  isCompanyMember(): boolean {
    return false; // will be updated when you add companyId/roles in DTO
  }

  // =========================
  // INTERNAL STATE UPDATES
  // =========================
  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }

  private setCurrentUser(user: AuthUserResponse) {
    this.currentUserSubject.next(user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
