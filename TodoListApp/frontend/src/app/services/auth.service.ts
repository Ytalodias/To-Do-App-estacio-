import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private storage: Storage) {
    this.storage.create();
  }

  // Simula login (depois conectará ao backend)
  async login(email: string, password: string) {
    await this.storage.set('user', { email });
    return true;
  }

  // Simula registro
  async register(email: string, password: string) {
    return true;
  }

  async logout() {
    await this.storage.remove('user');
  }
}
