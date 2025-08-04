import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-logs-expansion-body',
  templateUrl: './logs-expansion-body.component.html',
  styleUrl: './logs-expansion-body.component.scss',
})
export class LogsExpansionBodyComponent {
  desc: InputSignal<string> = input('');
  attachaments: InputSignal<
    { attachmentId: number; attachmentName: string; fileSize: number }[]
  > = input(
    [] as { attachmentId: number; attachmentName: string; fileSize: number }[]
  );
  testFiles: File[] = [
    new File(['Dummy content 1'], 'test-document.pdf', {
      type: 'application/pdf',
      lastModified: new Date().getTime(),
    }),
    new File(['Sample image content'], 'image1.png', {
      type: 'image/png',
      lastModified: new Date().getTime(),
    }),
    new File(['Another dummy file'], 'notes.txt', {
      type: 'text/plain',
      lastModified: new Date().getTime(),
    }),
  ];
}
