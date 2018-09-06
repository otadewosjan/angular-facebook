import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable } from '../../../node_modules/rxjs/Observable';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  allPosts: Post[] = [];
  posts: Post[] = [];
  itemsPP: number = 5;
  p: number = 1;
  total: number = 100;
  page: number = 1;
  pages: number[] = [1, 2, 3, 4, 5];
  j = 0;
  k = 2;

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.loadPosts()
      .then(() => this.checkPosts()
        .then(() => {
          this.postSlicer()
        }));
  }

  test(num) {
    console.log(num);
  }

  postSlicer() {
    this.posts = this.allPosts.slice((this.page - 1) * this.itemsPP, this.page * this.itemsPP);
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
    }
  }

  onNext(page) {
    this.page += 1;

    this.setPages(page);

    if (this.allPosts.length < this.page * this.itemsPP) {
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
    }
    this.page = page;
    if (this.allPosts.length < this.page * this.itemsPP) {
      this.loadPosts()
        .then(() => this.checkPosts())
        .then(() => {
          this.postSlicer()
        })
    }
    this.postSlicer()
  }

  checkPosts() {
    if ((this.allPosts.length / this.page) < this.itemsPP) {
      return this.loadPosts().then(() => { return this.checkPosts() });
    }
  }

  loadPosts() {
    return this.getPosts(this.j, this.k)
      .then((res) => {
        for (let i = 0; i < 2; i++) {
          this.allPosts.push(res[i])
        }
      })
  }

  getPosts(j, k) {
    return new Promise((resolve) => {
      this.postService.get("http://jsonplaceholder.typicode.com/posts", j, k)
        .do(() => { this.j += 2; this.k += 2; })
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