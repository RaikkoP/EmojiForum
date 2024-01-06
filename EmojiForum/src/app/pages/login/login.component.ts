import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  error: String = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  onSubmit(): void {
    const username = this.loginForm.get("username")?.value;
    const password = this.loginForm.get("password")?.value;
    this.http.post<any>('http://localhost:3000/user/login/', { username, password }, { withCredentials: true }).subscribe({
      next: data => {
        this.router.navigate(['/dashboard'])
      },
      error: err => {
        this.error = err.error.error;
        this.loginForm.reset();
      }
    });
  };
  getAuthentication() {
    return this.http.get('http://localhost:3000/user/get/', { withCredentials: true }).subscribe({
      next: res => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error.error;
      }
    })
  };
  ngOnInit(): void {
    this.getAuthentication();
  }
}