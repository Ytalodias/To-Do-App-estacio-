import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    try {
      const result = await LocalNotifications.requestPermissions();
      console.log('✅ Permissão para notificações:', result);
    } catch (err) {
      console.error('❌ Erro ao solicitar permissão de notificação:', err);
    }
  }
}
