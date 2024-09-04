import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class SectorService {
  private sectorNameKey = 'sectorName';

  constructor(private cookieService: CookieService) {}

  setSectorName(name: string): void {
    this.cookieService.set(this.sectorNameKey, name, { expires: 7, path: '/' });
  }

  getSectorName(): string | null {
    return this.cookieService.get(this.sectorNameKey) || null;
  }

  clearSectorName(): void {
    this.cookieService.delete(this.sectorNameKey, '/');
  }
}
