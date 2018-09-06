import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map"
import { Observable } from '../../../node_modules/rxjs/Observable';

@Injectable()
export class PostService {

  constructor(public http: Http) {
    //console.log("Post service provided");
  }

  get(postsUrl, j, k) {
    return this.http.get(postsUrl)
      .map(val => val.json())
      .map(res => res.slice(j,k));
  }

}
