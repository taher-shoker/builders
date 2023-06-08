import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  apps = [
    {
      id: 1,
      name: 'users settings',
      icon: 'setting.png',
      path: 'home/users-settings',
      internal: true,
    },
    {
      id: 2,
      name: 'stc ceo dashboard app',
      icon: 'setting.png',
      path: 'app2',
      internal: false,
    },
    {
      id: 3,
      name: 'app3',
      icon: 'setting.png',
      path: 'https://www.figma.com/file/NwaPofGdpwoD1pS4W8emuS/Fraud-Admin-system?type=design&node-id=141-1561&t=mjzx4k9pMtUYcVsf-0',
      internal: false,
    },
    {
      id: 4,
      name: 'app4',
      icon: 'setting.png',
      path: 'app4',
      internal: false,
    },
    {
      id: 5,
      name: 'app5',
      icon: 'setting.png',
      path: 'app5',
      internal: false,
    },
    {
      id: 6,
      name: 'app6',
      icon: 'setting.png',
      path: 'app6',
      internal: false,
    },
    {
      id: 7,
      name: 'app7',
      icon: 'setting.png',
      path: 'app7',
      internal: false,
    },
  ];
}
