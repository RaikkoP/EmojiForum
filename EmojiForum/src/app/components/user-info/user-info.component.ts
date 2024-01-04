import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AllPostsComponent } from '../all-posts/all-posts.component';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [AllPostsComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent implements OnInit {

  emojis: any[] = [];
  selectedEmoji: String = '😀'
  @Input() username: String = '';
  @Input() profilePic: String = '';
  @Input() id: Number = 0;
  

  constructor(
    private http: HttpClient,
    private router: Router,
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

  onSubmit(): void {
    const message = this.postForm.get('message')?.value;
    const emoji = this.selectedEmoji;
    const userId = this.id;
    this.http.post<any>('http://localhost:3000/post/create', { message, emoji, userId }).subscribe({
      next: res => {
        console.log(res);
        this.postForm.get('message')?.setValue('');
      },
      error: err => {
        console.error('There was an error!', err);
      }
    })
  }

  logout() {
    this.http.get<any>('http://localhost:3000/user/logout', {withCredentials: true}).subscribe({
      next: res => {
        console.log(res);
        location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.getEmojis();
  }
}
