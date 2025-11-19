import { Component } from '@angular/core';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, RouterModule, CommonModule],
  template: `
<ion-content [fullscreen]="true" class="login-content">
  <div class="login-wrapper">
    <h1>Login</h1>

    <!-- Email -->
    <div class="input-container">
      <input type="email" [(ngModel)]="email" placeholder="Digite seu email" class="input-field">
    </div>

    <!-- Senha -->
    <div class="input-container">
      <input type="password" [(ngModel)]="password" placeholder="Digite sua senha" class="input-field">
    </div>

    <ion-button expand="block" class="login-button" (click)="login()">Entrar</ion-button>

<div class="links-container">
  <p class="forgot-password">
    <a routerLink="/forgot-password">Esqueceu a senha?</a>
  </p>

  <p class="register">
    <a routerLink="/register">Cadastre-se</a>
  </p>
</div>


  </div>
</ion-content>
  `,
  styles: [`
/* ====================== LOGIN - LIGHT MODE ====================== */

ion-content.login-content {
  --background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrapper {
  width: 90%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

h1 {
  text-align: center;
  color: #334A80;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  margin-left: 35px;
  margin-top: 35px;
}

.input-container {
  display: flex;
  width: 100%;
  margin-left: 20px;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #000;
  border-radius: 8px;
  background-color: #fff;
  color: #000;
}

.input-field::placeholder {
  color: #000;
  opacity: 1;
}

.login-button {
  --background: #334A80;
  --color: #fff;
  font-weight: 600;
  --border-radius: 8px;
  margin-left: 35px;
  margin-top: 85px;
}

/* ====== CENTRALIZAR E AJUSTAR ESPAÇAMENTO DOS LINKS ====== */

.links-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-top: 10px;   /* AFASTAR do botão de entrar */
  gap: 2px;           /* APROXIMAR um do outro */
}

.links-container a {
  color: #334A80;
  font-weight: 600;
  text-decoration: none;
}

:host-context(.dark) .links-container a {
  color: #BB86FC;
}




/* ====================== DARK MODE ====================== */
:host-context(.dark) ion-content.login-content {
  --background: #121212;
}

:host-context(.dark) h1 {
  color: #E0E0E0;
}

:host-context(.dark) .input-field {
  background-color: #1E1E1E;
  color: #FFFFFF;
  border: 1px solid #444;
}

:host-context(.dark) .input-field::placeholder {
  color: #BBBBBB;
}

:host-context(.dark) .login-button {
  --background: #3A5F8D;
  --color: #fff;
}

:host-context(.dark) .link1 a,
:host-context(.dark) .link2 a {
  color: #BB86FC;
}


  `]
})
export class LoginPage {
  email = '';
  password = '';

  private API_URL = 'https://todolist-backend-4ya9.onrender.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
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

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Entrando...',
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Preencha todos os campos!', 'warning');
      return;
    }

    const loading = await this.presentLoading(); // ⬅ inicia carregamento

    const body = { email: this.email, password: this.password };

    this.http.post(`${this.API_URL}/login`, body, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: async (res: any) => {
        await loading.dismiss(); // ⬅ fecha carregamento

        if (res.token) {
          localStorage.setItem('token', res.token);
          this.showToast('Login realizado com sucesso!', 'success');
          this.router.navigate(['/todos']);
        } else {
          this.showToast('Token não recebido do servidor', 'danger');
        }
      },
      error: async (err) => {
        await loading.dismiss(); // ⬅ fecha carregamento
        this.showToast(err.error?.message || 'Erro ao fazer login', 'danger');
      }
    });
  }
}
