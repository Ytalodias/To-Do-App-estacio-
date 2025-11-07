import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
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
  <ion-item>
    <ion-label position="stacked">Email</ion-label>
    <ion-input [(ngModel)]="email" type="email" placeholder="Digite seu email"></ion-input>
  </ion-item>

  <ion-button expand="block" (click)="forgotPassword()" style="margin-top: 20px;">
    Enviar Instruções
  </ion-button>
</ion-content>
  `,
  styles: [`
ion-content { --background: #f5f5f5; }
ion-item { margin-bottom: 15px; }
`]
})
export class ChangePasswordPage {
  email = '';
  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api'; // Ajuste para sua URL de backend

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  // Função para exibir mensagens toast
  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({ 
      message, 
      color, 
      duration: 2500, 
      position: 'top' 
    });
    await toast.present();
  }

  // Função para solicitar email de redefinição
  forgotPassword() {
    if (!this.email) { 
      this.showToast('Informe seu email', 'warning'); 
      return; 
    }

    this.http.post(`${this.API_URL}/forgot-password`, { email: this.email })
      .subscribe({
        next: (res: any) => {
          // Confirmação de envio
          this.showToast(res?.message || 'Email enviado com instruções!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          // Exibe erro retornado pelo backend ou genérico
          const msg = err.error?.message || 'Erro ao enviar email';
          this.showToast(msg, 'danger');
        }
      });
  }
}
