import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class mentionRegexService {
  generateRegex(mentions: string[]) {
    if (mentions && mentions.length !== 0) {
      const usernamesRegex = mentions
        .map((username: string) => `${this.escapeRegExp(username)}`)
        .join('|');
      return new RegExp(`(${usernamesRegex})`, 'g');
    }
    // Escape special characters in usernames and join them with '|' for regex OR condition
    else {
      return '';
    }
  }

  // Function to escape special characters in a string for regex
  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
