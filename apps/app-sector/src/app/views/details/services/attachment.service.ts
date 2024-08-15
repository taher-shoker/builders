import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadKPIAttachment(files: File, addAttachmentDto: any): Observable<any> {
    const addAttachmentDtoBlob = new Blob([JSON.stringify(addAttachmentDto)], {
      type: 'application/json',
    });
    const formData = new FormData();

    formData.append('file', files);
    formData.append('addAttachmentDto', addAttachmentDtoBlob);

    return this.http.post(
      `${this.baseUrl}v2/scrs/dashboard/sector/kpi-details/attachment`,
      formData
    );
  }

  deleteKPIAttachment(id: number) {
    return this.http.delete(
      `${this.baseUrl}v2/scrs/dashboard/sector/kpi-details/attachment/${id}`
    );
  }

  downloadKPIAttachment(id: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}v2/scrs/dashboard/sector/kpi-details/attachment/${id}`,
      { responseType: 'blob' }
    );
  }
}
