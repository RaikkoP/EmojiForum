import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private http: HttpClient
  ) { };

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  onSubmit(): void {
    console.log(this.loginForm.value);
    const username = this.loginForm.get("username")?.value;
    const password = this.loginForm.get("password")?.value;
    this.http.get(`http://localhost:3000/user/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
    this.loginForm.reset();
  }
}