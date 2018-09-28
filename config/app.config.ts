import { Injectable } from '@angular/core';
import * as config from './config.json';

@Injectable()
export class AppConfig {
    static settings
    constructor() {}

    load() {
        AppConfig.settings = config
    }
}