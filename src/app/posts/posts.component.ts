import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[];

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.postService.get().subscribe((posts) => { this.posts = posts });
  }
}

interface Post {
  id: number,
  title: string,
  body: string,
  userId: number
}