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

  <ion-button expand="block" (click)="getSecurityQuestion()" *ngIf="!showQuestion">
    Enviar Instruções
  </ion-button>

  <div *ngIf="showQuestion">
    <ion-item>
      <ion-label position="stacked">{{ securityQuestion }}</ion-label>
      <ion-input [(ngModel)]="securityAnswer" type="text"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Nova senha</ion-label>
      <ion-input [(ngModel)]="newPassword" type="password"></ion-input>
    </ion-item>

    <ion-button expand="block" (click)="resetPassword()">
      Redefinir Senha
    </ion-button>
  </div>
</ion-content>
`
})
export class ResetPasswordPage {
  email: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  showQuestion: boolean = false;

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api/auth';

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  async showToast(message: string, color: 'success'|'danger'='success') {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500 });
    await toast.present();
  }

  getSecurityQuestion() {
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

  resetPassword() {
    if (!this.securityAnswer || !this.newPassword) {
      this.showToast('Preencha todos os campos', 'danger');
      return;
    }

    const normalizedAnswer = this.securityAnswer.trim().toLowerCase();

    this.http.post<{ message: string }>(
      `${this.API_URL}/reset-password`,
      {
        email: this.email,
        securityAnswer: normalizedAnswer,
        newPassword: this.newPassword
      }
    ).subscribe({
      next: res => {
        this.showToast(res.message || 'Senha redefinida com sucesso!', 'success');
        // opcional: resetar campos
        this.showQuestion = false;
        this.securityAnswer = '';
        this.newPassword = '';
      },
      error: err => this.showToast(err.error?.message || 'Erro ao redefinir senha', 'danger')
    });
  }
}
