import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { AllPostsComponent } from '../../components/all-posts/all-posts.component';
import UserResponse from '../../../model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule, UserInfoComponent, AllPostsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
 
  posts: any[] = [];
  username: String = '';
  profilePic: String = '';
  id: Number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { };

  getPosts() {
    this.http.get<any>('http://localhost:3000/post/get').subscribe({
      next: res => {
        function custom_sort(a: any, b: any) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        console.log(res);
        this.posts = res.sort(custom_sort)
      },
      error: err => {
        console.log(err);
      }
    })
  };

  getAuthentication() {
    return this.http.get<UserResponse>('http://localhost:3000/user/get/', { withCredentials: true }).subscribe({
      next: res => {
        this.username = res.username;
        this.profilePic = res.profilePic;
        this.id = res.id;
        console.log(this.profilePic);
      },
      error: err => {
        this.router.navigate(['/login']);
      }
    })
  };

  ngOnInit() {
    this.getAuthentication(),
    this.getPosts()
  }
}
