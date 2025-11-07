import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, CommonModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Redefinir Senha</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <!-- Email -->
  <ion-item>
    <ion-label position="stacked">Email</ion-label>
    <ion-input [(ngModel)]="email" type="email" placeholder="Digite seu email"></ion-input>
  </ion-item>

  <!-- Pergunta de segurança -->
  <ion-item *ngIf="showQuestion">
    <ion-label position="stacked">{{ securityQuestion }}</ion-label>
    <ion-input [(ngModel)]="securityAnswer" type="text" placeholder="Digite a resposta"></ion-input>
  </ion-item>

  <!-- Nova senha -->
  <ion-item *ngIf="showQuestion">
    <ion-label position="stacked">Nova senha</ion-label>
    <ion-input [(ngModel)]="newPassword" type="password" placeholder="Digite a nova senha"></ion-input>
  </ion-item>

  <ion-button expand="block" (click)="handleSubmit()" style="margin-top: 20px;">
    {{ showQuestion ? 'Redefinir Senha' : 'Enviar Instruções' }}
  </ion-button>
</ion-content>
  `
})
export class ChangePasswordPage {
  email = '';
  securityQuestion = '';
  securityAnswer = '';
  newPassword = '';
  showQuestion = false;

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api/auth';

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500, position: 'top' });
    await toast.present();
  }

  handleSubmit() {
    if (!this.showQuestion) {
      // Primeira etapa: pegar pergunta de segurança
      if (!this.email) {
        this.showToast('Informe seu email', 'warning');
        return;
      }

      this.http.post<{securityQuestion: string}>(`${this.API_URL}/forgot-password`, { email: this.email })
        .subscribe({
          next: res => {
            this.securityQuestion = res.securityQuestion;
            this.showQuestion = true;
          },
          error: err => this.showToast(err.error?.message || 'Usuário não encontrado', 'danger')
        });

    } else {
      // Segunda etapa: redefinir senha
      if (!this.securityAnswer || !this.newPassword) {
        this.showToast('Preencha todos os campos', 'danger');
        return;
      }

      this.http.post<{message?: string}>(`${this.API_URL}/reset-password`, {
        email: this.email,
        securityAnswer: this.securityAnswer,
        newPassword: this.newPassword
      }).subscribe({
        next: res => this.showToast(res.message || 'Senha redefinida!', 'success'),
        error: err => this.showToast(err.error?.message || 'Erro ao redefinir senha', 'danger')
      });
    }
  }
}
