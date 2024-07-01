import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  downloadFile(fileUrl: string, fileName: string) {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
