import { CommonModule, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [ CommonModule, NgFor],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss'
})
export class AllPostsComponent {

  @Input() posts: any[] = [];

  constructor(
  ) { };

  trackByIndex(index: number, post: any): any {
    return index;
  }

}
