import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private darkMode = false;
  private notifications = true;

  constructor(private storage: Storage) {
    this.storage.create();
  }

  getDarkMode() {
    return this.darkMode;
  }

  getNotifications() {
    return this.notifications;
  }

  setDarkMode(value: boolean) {
    this.darkMode = value;
    this.storage.set('darkMode', value);
    document.body.classList.toggle('dark', value); // aplica tema escuro
  }

  setNotifications(value: boolean) {
    this.notifications = value;
    this.storage.set('notifications', value);
  }
}
