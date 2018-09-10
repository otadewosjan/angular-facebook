import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  allPosts: Post[] = [];
  posts: Post[] = [];
  itemsPerPage: number = 5;
  firstItemOnPage: number = 0;
  total: number = 100;
  page: number = 1;
  pages: number[] = [1, 2, 3, 4, 5];
  postsStart: number = 0;
  postsEnd: number = 2;

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

  onPostNum() {
    this.page = Math.floor(this.firstItemOnPage / this.itemsPerPage) + 1;

    if (this.page >= 3) {
      this.pages = [this.page - 2, this.page - 1, this.page, this.page + 1, this.page + 2];
    } else {
      this.pages = [1, 2, 3, 4, 5];
    }

    if (this.allPosts.length < this.page * this.itemsPerPage) {
      this.loadPosts()
        .then(() => this.checkPosts())
        .then(() => {
          this.postSlicer()
        })
    }
    this.postSlicer();
  }

  setFirstItemOnPage() {
    this.firstItemOnPage = (this.page - 1) * this.itemsPerPage;
  }

  setPages(page) {
    if (this.page > page && page >= 3) {
      this.pages.push(page + 3);
      this.pages.shift();
    } else if ((this.page < page && page > 3)) {
      this.pages.unshift(page - 3);
      this.pages.pop();
    }
  }

  onPrev(page) {
    if (this.page !== 1) {
      this.page -= 1;
      this.setPages(page);
      this.postSlicer()
      this.setFirstItemOnPage();
    }
  }

  onNext(page) {
    this.page += 1;
    this.setPages(page);
    this.setFirstItemOnPage();

    if (this.allPosts.length < this.page * this.itemsPerPage) {
      this.loadPosts()
        .then(() => this.checkPosts())
        .then(() => {
          this.postSlicer()
        })
    }
    this.postSlicer()
  }

  onPage(page) {
    if (page >= 3) {
      this.pages = [page - 2, page - 1, page, page + 1, page + 2];
    } else {
      this.pages = [1, 2, 3, 4, 5];
    }

    this.page = page;
    this.setFirstItemOnPage();

    if (this.allPosts.length < this.page * this.itemsPerPage) {
      this.loadPosts()
        .then(() => this.checkPosts())
        .then(() => {
          this.postSlicer()
        })
    }
    this.postSlicer()
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
      this.postService.get("http://jsonplaceholder.typicode.com/posts", postsStart, postsEnd)
        .do(() => { this.postsStart += 2; this.postsEnd += 2; })
        .subscribe(res => { resolve(res); })
    });
  }
}

interface Post {
  id: number,
  title: string,
  body: string,
  userId: number
}