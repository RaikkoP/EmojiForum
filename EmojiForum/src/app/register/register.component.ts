import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor (
    private http: HttpClient
  ) {};

  registerForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl(),
  });

  onSubmit(): void {
    console.log(this.registerForm.value);
    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;
    const email = this.registerForm.get('email')?.value;
    this.http.post<any>('http://localhost:3000/user/create/', {username, password, email}).subscribe(data => {
      console.log(data)
    }, error => {
      console.log(error)
    })
    this.registerForm.reset();
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
      image: '../../assets/siim.jpg',
      username: 'Siim',
      message: 'I feel alive!',
      emoji: '✝️'
    }
  ];
}
  