import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  allPosts: Post[] = [];
  posts: Post[] = [];
  itemsPerPage: number = 5;
  itemsPerPageInput: number = 5;
  firstItemOnPage: number = 0;
  total: number = 100;
  page: number = 1;
  pages: number[] = [1, 2, 3, 4, 5];
  postsStart: number = 0;
  postsEnd: number = 2;
  postsAPI1: string = "http://localhost:3000/posts";
  postsAPI2: string = "http://jsonplaceholder.typicode.com/posts";

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.loadPosts()
      .then(() => this.checkPosts()
        .then(() => { this.postSlicer() }));
  }

  postSlicer() {
    this.posts = this.allPosts.slice((this.page - 1) * this.itemsPerPage, this.page * this.itemsPerPage);
  }

  setFirstItemOnPage() {
    this.firstItemOnPage = (this.page - 1) * this.itemsPerPage;
  }

  setPages(page) {
    if (page >= 3) {
      this.pages = [page - 2, page - 1, page, page + 1, page + 2];
    } else {
      this.pages = [1, 2, 3, 4, 5];
    }
  }

  onPage(page) {
    this.page = page;
    this.setPages(this.page);
    this.setFirstItemOnPage();

    if (this.allPosts.length < this.page * this.itemsPerPage) {
      return this.loadPosts()
        .then(() => this.checkPosts())
        .then(() => { this.postSlicer() });
    }
    this.postSlicer();
  }

  onPostNumInput() {
    if (this.itemsPerPageInput !== null && this.itemsPerPageInput !== 0) {
      this.itemsPerPage = this.itemsPerPageInput;
    }

    this.page = Math.floor(this.firstItemOnPage / this.itemsPerPage) + 1;
    this.onPage(this.page);
  }

  checkPosts() {
    if ((this.allPosts.length / this.page) < this.itemsPerPage) {
      return this.loadPosts().then(() => { return this.checkPosts() });
    }
  }

  loadPosts() {
    return this.getPosts(this.postsStart, this.postsEnd)
      .then((res) => {
        for (let i = 0; i < 2; i++) {
          this.allPosts.push(res[i])
        }
      })
  }

  getPosts(postsStart: number, postsEnd: number) {
    return new Promise((resolve) => {
      this.postService.get(this.postsAPI1, postsStart, postsEnd)
        .catch((err: any) => {throw(this.errorHandler(err))})

        .do(() => { this.postsStart += 2; this.postsEnd += 2; })
        .subscribe(res => { resolve(res); })
    });
  }

  errorHandler(err) {
    this.postsAPI1 = this.postsAPI2;
    this.ngOnInit();
  }

}

interface Post {
  id: number,
  title: string,
  body: string,
  userId: number
}