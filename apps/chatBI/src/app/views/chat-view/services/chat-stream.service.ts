import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { chunkData } from '../models/chatModel';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/chatBI/src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ChatStreamService {
  chunkStageSubject = new Subject<chunkData[]>();
  baseURL = environment.apiUrl;
  lastStage = '';

  token = this.cookieService.get('token');
  messageStreamUrl = this.baseURL + 'v2/chatBI/message';
  constructor(private http: HttpClient, private cookieService: CookieService) {
    console.log(this.token);
  }
  getStreamedResponse(url: string, body: string) {
    return this.http.post(
      url,
      { content: body },
      {
        responseType: 'text', // or 'json' depending on your API
        reportProgress: true,
        observe: 'events',
      }
    );
  }
  getStreamChatMessages(body: string): Observable<any> {
    return new Observable((observer) => {
      fetch(this.messageStreamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ content: body }),
      })
        .then((response) => {
          if (!response.ok || !response.body) {
            observer.error(`HTTP error! status: ${response.status}`);
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          const readChunk = () => {
            reader
              .read()
              .then(({ done, value }) => {
                if (done) {
                  observer.complete();
                  return;
                }

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                  const trimmed = line.trim();

                  if (trimmed.startsWith('data:')) {
                    const jsonStr = trimmed.replace(/^data:\s*/, '');

                    if (jsonStr) {
                      try {
                        const outer = JSON.parse(jsonStr);

                        if (outer.data) {
                          const inner = JSON.parse(outer.data);
                          const processedChunk = {
                            ...outer,
                            data: inner,
                          };
                          observer.next(processedChunk);
                        } else {
                          observer.next(outer);
                        }
                      } catch (err) {
                        console.warn('Failed to parse streamed data:', err);
                      }
                    }
                  }
                }

                readChunk();
              })
              .catch((err) => observer.error(err));
          };

          readChunk();
        })
        .catch((err) => observer.error(err));
    });
  }
  updateAssistantMessage(chunkStream: any[], chunk: any) {
    const lastMessage = chunkStream[chunkStream.length - 1];

    if (lastMessage) {
      lastMessage.stageContent = this.processChunk(
        chunk,
        lastMessage.stageContent
      );
    }
  }

  private processChunk(chunk: any, currentContent: string): string {
    return currentContent + this.getStageChunkContent(chunk);
  }

  getStageChunkContent(chunk: any) {
    let stageContent;
    if (
      chunk.stage == 'Deep Thinking' ||
      chunk.stage == 'Business Understanding'
    ) {
      const content =
        typeof chunk.data?.result?.choices?.[0]?.delta?.content == 'string'
          ? chunk.data?.result?.choices?.[0]?.delta?.content
          : '';
      stageContent = content;
    } else if (chunk.stage == 'Time Reason') {
      stageContent = chunk.data?.normalizedTimeQuery;
    } else if (chunk.stage == 'Critical Info') {
      stageContent = chunk.data?.columnContent;
    } else if (chunk.stage == 'SQL Generate') {
      stageContent = chunk.data?.sql;
    } else if (chunk.stage == 'Data Query') {
      stageContent = chunk.data?.content;
    } else if (chunk.stage == 'Diagnostic Analysis') {
      stageContent = chunk.data?.message;
    } else {
      stageContent = '';
    }
    return stageContent;
  }
}
