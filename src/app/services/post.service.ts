import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map"

@Injectable()
export class PostService {

  constructor(public http: Http) { 
    console.log("Post service provided");
  }

  get() {
    return this.http.get("http://jsonplaceholder.typicode.com/posts")
    .map(val => val.json());
  }

}
