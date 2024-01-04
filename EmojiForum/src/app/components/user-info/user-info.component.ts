import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import UserResponse from '../../../model/user';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent implements OnInit {

  id: Number = 0;
  username: String = '';
  profilePic: String = '';
  likes: Number = 0;
  dislikes: Number = 0;
  posts: Number = 0;
  emojis: any[] = [];
  selectedEmoji: String = '😀'

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  postForm = new FormGroup({
    message: new FormControl(),
  })

  getEmojis() {
    return this.http.get<any>('https://emoji-api.com/emojis?access_key=2ab9da2ebc92b5fe752e555be441a15047a7bb09')
      .subscribe(data => {
        this.emojis = data;
      });
  };

  switchSelected(selected: String) {
    this.selectedEmoji = selected;
  };

  getAuthentication() {
    return this.http.get<UserResponse>('http://localhost:3000/user/get/', { withCredentials: true }).subscribe({
      next: res => {
        this.username = res.username;
        this.profilePic = res.profilePic;
        this.id = res.id;
      },
      error: err => {
        this.router.navigate(['/login']);
      }
    })
  };

  onSubmit(): void {
    const message = this.postForm.get('message')?.value;
    const emoji = this.selectedEmoji;
    const userId = this.id;
    this.http.post<any>('http://localhost:3000/post/create', {message, emoji, userId}).subscribe({
      next: res => {
        console.log(res);
        this.postForm.get('message')?.setValue('');
      },
      error: err => {
        console.error('There was an error!', err);
      }
    })
  }

  ngOnInit() {
    this.getAuthentication();
    this.getEmojis();
  }
}
