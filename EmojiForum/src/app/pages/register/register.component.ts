import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  error: String = '';

  registerForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl(),
  });

  onSubmit() {
    console.log(this.registerForm.value);
    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    const email = this.registerForm.get('email')?.value;
    this.http.post<any>('http://localhost:3000/user/create/', { username, password, confirmPassword, email }).subscribe({
      next: data => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = err.error.error;
        this.registerForm.reset();
      }
    });
  };

  demo_data = [
    {
      id: 0,
      image: '../../assets/reiryoku.png',
      username: 'Reiryoku',
      message: "I'm straight balling",
      emoji: '🏀'
    },
    {
      id: 1,
      image: '../../assets/shvop.jpg',
      username: 'shvop',
      message: 'Feeling a bit silly',
      emoji: '🐱'
    },
    {
      id: 2,
      image: '../../assets/glorfindel.jpg',
      username: 'Glorfindel',
      message: 'Doggo? FR!?',
      emoji: '🐕'
    },
    {
      id: 3,
      image: '../../assets/mazdu.png',
      username: 'Mazdu',
      message: 'Cookie < kübis',
      emoji: '🍪'
    },
    {
      id: 4,
      image: '../../assets/umam.jpg',
      username: 'Umam',
      message: 'Mmmm Banjo',
      emoji: '🪕'
    },
    {
      id: 5,
      image: '../../assets/mica.jpg',
      username: 'Micikator',
      message: 'Serbian Bread :3',
      emoji: '🇷🇸'
    }
  ];
}
