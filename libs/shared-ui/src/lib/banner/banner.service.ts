import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BannerData {
  title: string;
  text: string;
}
@Injectable({
  providedIn: 'root',
})
export class BannerDataService {
  private dataSource = new BehaviorSubject({
    title: 'title',
    text: '',
  });

  public data = this.dataSource.asObservable();

  updateData(value: BannerData) {
    this.dataSource.next(value);
  }
}
