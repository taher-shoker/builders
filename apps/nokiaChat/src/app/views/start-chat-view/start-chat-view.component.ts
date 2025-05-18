import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-start-chat-view',
  templateUrl: './start-chat-view.component.html',
  styleUrl: './start-chat-view.component.scss',
})
export class StartChatViewComponent {
  isAnimated = false;
  displayName = '';

  textToSpeak = 'Welcome ';

  audioUrl = 'assets/audios/';
  @ViewChild('speechButton', { static: true })
  speechButton!: ElementRef<HTMLButtonElement>;

  constructor(private router: Router, private cookieService: CookieService) {}
  ngOnInit() {
    this.displayName = JSON.parse(
      this.cookieService.get('MODERN_SYSTEM_USER')!
    ).name;

    this.textToSpeak += this.displayName;

    setTimeout(() => {
      this.isAnimated = true;
    }, 100);

    this.speechButton?.nativeElement.click();
  }
  startChatNavigation() {
    this.playBackgroundAudio(this.displayName);
    this.router.navigate(['/chatView']);
  }

  playTimeout: any;
  playBackgroundAudio(name: string) {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const source = audioContext.createBufferSource();

    fetch(`${this.audioUrl}${name}.wav`)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioContext.decodeAudioData(buffer))
      .then((decodedData) => {
        source.buffer = decodedData;
        source.connect(audioContext.destination);
        // source.loop = true;
        source.start(0);
      })
      .catch((error) => {
        this.playBackgroundAudio('welcome');
        console.error('Error loading audio with Web Audio API:', error);
      });
  }

  isSpeechInitialized = false;

  initializeSpeech() {
    console.log('User interaction received. Initializing speech synthesis...');
    this.initializeSpeechSynthesis();
    this.initializeVoicesAndSpeak();
    this.isSpeechInitialized = true;
  }
  initializeSpeechSynthesis() {
    const utterance = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.cancel();
  }

  initializeVoicesAndSpeak() {
    const retryVoiceLoading = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log('Voices loaded successfully:', voices);
        this.speakText();
      } else {
        console.warn('No voices loaded. Retrying...');
        setTimeout(retryVoiceLoading, 200);
      }
    };

    retryVoiceLoading();
  }

  speakText() {
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      console.error('No voices loaded.');
      return;
    }

    utterance.voice =
      voices.find((voice) => voice.name.includes('Google US English Female')) ||
      voices.find((voice) => voice.lang === 'en-US') ||
      voices[0];

    utterance.lang = 'en-US';
    utterance.rate = 1.2;
    utterance.pitch = 1.5;

    utterance.onstart = () => console.log('Speech started');
    utterance.onend = () => console.log('Speech ended');
    utterance.onerror = (event) =>
      console.error('Speech synthesis error:', event.error);

    window.speechSynthesis.speak(utterance);
  }
}
