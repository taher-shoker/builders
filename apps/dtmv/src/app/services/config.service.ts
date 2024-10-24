// src/app/config.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

interface Config {
  fileValidation: { acceptType: string[]; sizeWithMegaBytes: number };
  characterLimit: { descriptionLength: number; nameLength: number };
  pageSizesOptions: { name: string; id: string }[];
  defaultPageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config!: Config;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http
      .get<Config>('assets/config.json')
      .pipe(map((config) => (this.config = config)))
      .toPromise()
      .then(() => {
        console.log('config loading');
      });
  }

  getConfig(): Config {
    return this.config;
  }
}
