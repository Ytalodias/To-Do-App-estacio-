import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, CommonModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Redefinir Senha</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-item>
    <ion-label position="stacked">Email</ion-label>
    <ion-input [(ngModel)]="email" type="email"></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Resposta da pergunta</ion-label>
    <ion-input [(ngModel)]="securityAnswer" type="text"></ion-input>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Nova senha</ion-label>
    <ion-input [(ngModel)]="newPassword" type="password"></ion-input>
  </ion-item>

  <ion-button expand="block" (click)="resetPassword()">Redefinir Senha</ion-button>
</ion-content>
`
})
export class ResetPasswordPage {
  email: string = '';
  securityAnswer: string = '';
  newPassword: string = '';

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api/auth';

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  async showToast(message: string, color: 'success'|'danger'='success'): Promise<void> {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500 });
    await toast.present();
  }

  resetPassword(): void {
    if (!this.email || !this.securityAnswer || !this.newPassword) {
      this.showToast('Preencha todos os campos', 'danger');
      return;
    }

    this.http.post<{ message: string }>(
      `${this.API_URL}/reset-password`,
      {
        email: this.email,
        securityAnswer: this.securityAnswer,
        newPassword: this.newPassword
      }
    ).subscribe({
      next: res => this.showToast(res.message || 'Senha redefinida com sucesso!', 'success'),
      error: err => this.showToast(err.error?.message || 'Erro ao redefinir senha', 'danger')
    });
  }
}
