import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { AllPostsComponent } from '../../components/all-posts/all-posts.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule, UserInfoComponent, AllPostsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
 
  constructor(
  ) { };


}
