import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'stc-apps-start-chat-view',
  templateUrl: './start-chat-view.component.html',
  styleUrl: './start-chat-view.component.scss',
})
export class StartChatViewComponent implements OnInit {
  isAnimated = false;
  displayName = '';
  @ViewChild('speechButton', { static: true })
  speechButton!: ElementRef<HTMLButtonElement>;

  textToSpeak = 'Welcome ';

  audioUrl = 'assets/audios/';

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    this.displayName = JSON.parse(
      this.cookieService.get('MODERN_SYSTEM_USER')!
    ).name;

    this.textToSpeak += this.displayName;
    // Trigger the animation after the component is initialized
    setTimeout(() => {
      this.isAnimated = true;
    }, 100); // Delay for smoother animation (optional)

    this.speechButton.nativeElement.click();
  }
  startChatNavigation() {
    // this.initializeSpeech();
    this.playAudio(this.displayName);
    this.router.navigate(['/chatView']);
  }

  playAudio(name: string) {
    const audio = new Audio(`${this.audioUrl}${name}.wav`);
    audio
      .play()
      .then(() => {
        console.log('Audio playback started');
      })
      .catch((error) => {
        const audio = new Audio(`${this.audioUrl}welcome.wav`);
        audio.play();
        console.error('Error playing audio:', error);
      });
  }

  isSpeechInitialized = false;

  initializeSpeech() {
    console.log('User interaction received. Initializing speech synthesis...');
    this.initializeSpeechSynthesis();
    this.initializeVoicesAndSpeak();
    this.isSpeechInitialized = true; // Hide the button after initialization
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
