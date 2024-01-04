import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import UserResponse from '../../../model/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})



export class DashboardComponent implements OnInit {

  emojis: any[] = [];
  selectedEmoji: String = '😀'
  id: Number = 0;
  username: String = '';
  profilePic: String = '';
  likes: Number = 0;
  dislikes: Number = 0;
  posts: Number = 0;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  getEmojis() {
    return this.http.get<any>('https://emoji-api.com/emojis?access_key=4f7510922dd61022149ba2821e2f66f3bb63685c')
      .subscribe(data => {
        this.emojis = data;
      });
  }

  switchSelected(selected: String) {
    this.selectedEmoji = selected;
  }

  getAuthentication() {
    return this.http.get<UserResponse>('http://localhost:3000/user/get/', {withCredentials: true}).subscribe({
      next: res => {
        this.username = res.username;
        this.profilePic = res.profilePic;
        this.id = res.id;
      },
      error: err => {
        this.router.navigate(['/login']);
      }
    })
  }


  ngOnInit() {
    this.getEmojis();
    this.getAuthentication();
  }
}
