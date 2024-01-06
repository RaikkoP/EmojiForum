import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  image: any;
  @Input() username: String = '';
  @Input() profilePic: String = '';
  @Input() id: Number = 0;
  @Output() postCreated = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { };

  postForm = new FormGroup({
    message: new FormControl(),
  });

  getEmojis() {
    return this.http.get<any>('https://emoji-api.com/emojis?access_key=f9927797e5e6b0409671aac9dff56ecfbf247708')
      .subscribe(data => {
        this.emojis = data;

      });
  };

  switchSelected(selected: String) {
    this.selectedEmoji = selected;
  };

  selectImage(event: any) {
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.image = file;

    }
  }

  onSubmit(): void {
    const message = this.postForm.get('message')?.value;
    const emoji = this.selectedEmoji;
    const userId = this.id;
    this.http.post<any>('http://localhost:3000/post/create', { message, emoji, userId }).subscribe({
      next: res => {
        console.log(res);
        this.postForm.get('message')?.setValue('');
        this.postCreated.emit(res);
      },
      error: err => {
        console.error('There was an error!', err);
      }
    })
  };

  logout() {
    this.http.get<any>('http://localhost:3000/user/logout', {withCredentials: true}).subscribe({
      next: res => {
        console.log(res);
        this.profilePic = res.profilePic;
        location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  };

  onFileUpload(){
    const formData = new FormData();
    formData.append('image', this.image)
    const id = this.id;
    formData.append('id', this.id.toString())
    console.log(formData)
    console.log(formData.get('image'))
    const file = formData.get('image');
    this.http.post<any>('http://localhost:3000/user/profile/picture', formData, {withCredentials: true}).subscribe({
      next: res => {
        console.log(res);
        location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  };

  ngOnInit() {
    this.getEmojis();
  };
}
