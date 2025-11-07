// src/app/pages/todos/ResetPasswordPage.ts

import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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
    <ion-label position="stacked">Nova Senha</ion-label>
    <ion-input [(ngModel)]="newPassword" type="password" placeholder="Digite sua nova senha"></ion-input>
  </ion-item>

  <ion-button expand="block" (click)="resetPassword()" style="margin-top: 20px;">
    Alterar Senha
  </ion-button>

</ion-content>
  `,
  styles: [`
ion-content { --background: #f5f5f5; }
ion-item { margin-bottom: 15px; }
`]
})
export class ResetPasswordPage {
  newPassword = '';
  token = '';

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) {
    // Captura o token do link (ex: /reset-password/:token)
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({ message, color, duration: 2500, position: 'top' });
    await toast.present();
  }

  resetPassword() {
    if (!this.newPassword) {
      this.showToast('Digite uma nova senha', 'danger');
      return;
    }

    this.http.post(`${this.API_URL}/reset-password/${this.token}`, { newPassword: this.newPassword })
      .subscribe({
        next: (res: any) => this.showToast(res.message || 'Senha redefinida com sucesso!', 'success'),
        error: (err: HttpErrorResponse) =>
          this.showToast(err.error?.message || 'Erro ao redefinir senha', 'danger')
      });
  }
}
