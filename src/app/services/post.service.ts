import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map"
import { AppConfig } from '../../../config/app.config';

@Injectable()
export class PostService {
  apiServer = AppConfig.settings["apiServer"].posts;
  constructor(public http: Http) {}

  get(sliceStart: number, sliceEnd: number) {
    return this.http.get(this.apiServer)
      .map(val => val.json())
      .map(res => res.slice(sliceStart, sliceEnd));
  }

}
