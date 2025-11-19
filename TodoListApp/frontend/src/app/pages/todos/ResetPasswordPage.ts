import { Component } from '@angular/core';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
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
    <ion-buttons slot="start">
      <ion-button class="back-button" (click)="goBack()">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </ion-button>
    </ion-buttons>

    <ion-title>Redefinir Senha</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="reset-content ion-padding">

  <!-- Email -->
  <ion-item>
    <ion-label position="stacked">Email</ion-label>
    <ion-input [(ngModel)]="email" type="email" placeholder="Digite seu email"></ion-input>
  </ion-item>

  <!-- Botão Enviar Instruções -->
  <ion-button class="send-button" (click)="getSecurityQuestion()" *ngIf="!showQuestion">
    Enviar Instruções
  </ion-button>

  <!-- Pergunta de segurança + nova senha -->
  <div class="reset-container" *ngIf="showQuestion">
    <ion-item>
      <ion-label position="stacked">{{ securityQuestion }}</ion-label>
      <ion-input [(ngModel)]="securityAnswer" type="text" placeholder="Resposta"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Nova senha</ion-label>
      <ion-input [(ngModel)]="newPassword" type="password" placeholder="Digite a nova senha"></ion-input>
    </ion-item>

    <ion-button class="reset-button" (click)="resetPassword()">
      Redefinir Senha
    </ion-button>
  </div>

</ion-content>
`,
  styles: [`
/* ================= RESET PASSWORD PAGE ================= */
.reset-content {
  --background: #F5F5F7;
  display: flex;
  flex-direction: column;
}

:host-context(.dark) .reset-content {
  --background: #121212;
}

/* ================= CABEÇALHO ================= */
ion-toolbar {
  --background: #FFFFFF;
  box-shadow: none;
}

:host-context(.dark) ion-toolbar {
  --background: #1E1E1E;
}

ion-title {
  color: #334A80;
  font-weight: 700;
}

:host-context(.dark) ion-title {
  color: #E0E0E0;
}

/* Botão de voltar */
.back-button {
  --color: #334A80 !important;
  font-size: 1.2rem;
}

:host-context(.dark) .back-button {
  --color: #E0E0E0 !important;
}

/* ================= FORM ITEMS ================= */
ion-item {
  --background: #FFFFFF;
  --border-radius: 12px;
  margin: 10px 0;
  padding: 0 12px;
}

ion-item ion-label {
  color: #334A80 !important;
  font-weight: 600;
  margin-bottom: 4px;
}

ion-item ion-input {
  --color: #334A80 !important;
  color: #334A80 !important;
}

ion-item ion-input::placeholder {
  color: #6E7BA5 !important;
}

:host-context(.dark) ion-item {
  --background: #1E1E1E;
}

:host-context(.dark) ion-item ion-label,
:host-context(.dark) ion-item ion-input,
:host-context(.dark) ion-item ion-input::placeholder {
  color: #E0E0E0 !important;
}

ion-input {
  --padding-start: 12px;
  --padding-end: 12px;
  --border-radius: 12px;
}

/* ================= BOTÕES ================= */
ion-button {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 12px auto;
  height: 40px;
  font-weight: 600;
  font-size: 0.95rem;
  --border-radius: 12px;

}

ion-button.send-button {
  --background: #467DA9;
  color: #fff;
}

:host-context(.dark) ion-button.send-button {
  --background: #3A5F8D;
}

ion-button.reset-button {
  --background: #D32F2F;
  color: #fff;
}

:host-context(.dark) ion-button.reset-button {
  --background: #B71C1C;
}

/* ================= CONTAINER ================= */
.reset-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

/* ================= RESPONSIVIDADE ================= */
@media (max-width: 400px) {
  ion-button {
    max-width: 90%;
  }

  ion-item {
    margin: 8px 0;
  }
}
  `]
})
export class ResetPasswordPage {
  email: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';
  newPassword: string = '';
  showQuestion: boolean = false;

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api/auth';

  constructor(
    private http: HttpClient, 
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  goBack() {
    this.navCtrl.back();
  }

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
        this.showQuestion = false;
      },
      error: err => this.showToast(err.error?.message || 'Erro ao redefinir senha', 'danger')
    });
  }
}
