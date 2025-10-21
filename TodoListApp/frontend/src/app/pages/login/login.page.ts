// login.page.ts
import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, RouterModule, CommonModule],
  template: `
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>Login</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true" class="login-content">
  <div class="login-wrapper">
    <div class="login-container">
      <img src="assets/logo.png" alt="Logo" class="logo">

      <h2>Bem-vindo de volta!</h2>
      <p>Entre na sua conta para continuar</p>

      <ion-item>
        <ion-label position="floating">Email</ion-label>
        <ion-input type="email" [(ngModel)]="email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Senha</ion-label>
        <ion-input type="password" [(ngModel)]="password"></ion-input>
      </ion-item>

      <ion-button expand="block" (click)="login()">Entrar</ion-button>

      <p class="register-link">
        Não tem uma conta? 
        <a routerLink="/register">Criar conta</a>
      </p>
    </div>
  </div>
</ion-content>
  `,
  styles: [`
ion-content.login-content {
  --padding: 0;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  display: flex;
  flex-direction: column;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  flex: 1 0 auto;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo { width: 80px; margin-bottom: 1.5rem; }
h2 { color: #2575fc; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; }
p { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; }

ion-item {
  width: 100%;
  margin-bottom: 1rem;
  --highlight-color-focused: #2575fc;
  --border-radius: 12px;
}

ion-button {
  width: 100%;
  margin-top: 1rem;
  --border-radius: 12px;
  --background: #2575fc;
  --background-activated: #1a5dcc;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.register-link {
  margin-top: 1rem;
  font-size: 0.85rem;
}
.register-link a {
  color: #2575fc;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem 1rem;
  }
  h2 { font-size: 1.5rem; }
  p { font-size: 0.85rem; }
  .logo { width: 70px; }
}
  `]
})
export class LoginPage {
  email = '';
  password = '';

  private API_URL = 'http://localhost:5000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  login() {
    if (!this.email || !this.password) {
      this.showToast('Preencha todos os campos!', 'warning');
      return;
    }

    const body = { email: this.email, password: this.password };

    this.http.post(`${this.API_URL}/login`, body).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.showToast('Login realizado com sucesso!', 'success');
          this.router.navigate(['/todos']);
        } else {
          this.showToast('Token não recebido do servidor', 'danger');
        }
      },
      error: (err) => this.showToast(err.error?.message || 'Erro ao fazer login', 'danger')
    });
  }
}
