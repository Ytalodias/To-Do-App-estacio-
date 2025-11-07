import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, CommonModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Esqueci minha senha</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-item>
    <ion-label position="stacked">Email</ion-label>
    <ion-input [(ngModel)]="email" type="email"></ion-input>
  </ion-item>

  <ion-item *ngIf="showQuestion">
    <ion-label position="stacked">{{ securityQuestion }}</ion-label>
    <ion-input [(ngModel)]="securityAnswer" type="text"></ion-input>
  </ion-item>

  <ion-button expand="block" (click)="forgotPassword()">
    Enviar Instruções
  </ion-button>
</ion-content>
`
})
export class ChangePasswordPage {
  email: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  showQuestion: boolean = false;

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api/auth';

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  async showToast(message: string, color: 'success'|'danger'='success') {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500 });
    await toast.present();
  }

  forgotPassword() {
    if (!this.email) {
      this.showToast('Informe seu email', 'danger');
      return;
    }

    this.http.post<{ securityQuestion: string }>(
      `${this.API_URL}/forgot-password`,
      { email: this.email }
    ).subscribe({
      next: res => {
        this.securityQuestion = res.securityQuestion;
        this.showQuestion = true;
      },
      error: err => this.showToast(err.error?.message || 'Erro ao buscar pergunta', 'danger')
    });
  }
}
