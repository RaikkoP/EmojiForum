import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  emojis: any[] = [];
  selectedEmoji: String = '😀'

  constructor(
    private http: HttpClient,
  ) {};

  getEmojis() {
    return this.http.get<any>('https://emoji-api.com/emojis?access_key=4f7510922dd61022149ba2821e2f66f3bb63685c')
    .pipe(
     map(data => data),
     catchError(error => {
       console.log(error);
       return throwError(error);
     })
    )
    .subscribe(data => {
     this.emojis = data;
    });
   }

   switchSelected(selected: String) {
    this.selectedEmoji = selected;
   }
 
  ngOnInit() {
    this.getEmojis();
  }
}
