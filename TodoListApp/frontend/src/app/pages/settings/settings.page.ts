import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class SettingsPage implements OnInit {
  darkMode = false;
  notifications = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Carrega preferências
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.notifications = localStorage.getItem('notifications') !== 'false';

    // Aplica dark mode
    this.applyDarkMode();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', String(this.darkMode));
    this.applyDarkMode();
  }

  toggleNotifications() {
    this.notifications = !this.notifications;
    localStorage.setItem('notifications', String(this.notifications));
    console.log('Notifications:', this.notifications);
  }

  private applyDarkMode() {
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  goBack() {
    this.router.navigate(['/todos']); // Ajuste para a rota anterior
  }
}
