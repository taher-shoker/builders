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
    },
    {
      id: 2,
      name: 'stc ceo dashboard app',
      icon: 'setting.png',
      path: 'app2',
    },
    {
      id: 3,
      name: 'app3',
      icon: 'setting.png',
      path: 'app3',
    },
    {
      id: 4,
      name: 'app4',
      icon: 'setting.png',
      path: 'app4',
    },
    {
      id: 5,
      name: 'app5',
      icon: 'setting.png',
      path: 'app5',
    },
    {
      id: 6,
      name: 'app6',
      icon: 'setting.png',
      path: 'app6',
    },
    {
      id: 7,
      name: 'app7',
      icon: 'setting.png',
      path: 'app7',
    },
  ];
}
