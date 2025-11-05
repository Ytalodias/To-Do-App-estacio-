import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
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
      <input type="email" [(ngModel)]="email" placeholder="@  Digite seu email" class="input-field">
    </div>

    <!-- Senha -->
    <div class="input-container">
      <input type="password" [(ngModel)]="password" placeholder="🔒 Digite sua senha" class="input-field">
    </div>

    <ion-button expand="block" class="login-button" (click)="login()">Entrar</ion-button>

    <!-- Links adicionais -->
    <div class="link1">
      <p class="forgot-password">
        <a routerLink="/forgot-password">Esqueceu a senha?</a>
      </p>
       </div>


      <div class= "link2">
        <p class="register">
          Não tem uma conta? <a routerLink="/register">Cadastre-se</a>
        </p>
      </div>





  </div>
</ion-content>
  `,
  styles: [`
/* Tela toda branca e centralizada */
ion-content.login-content {
  --background: #ffffffff;
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
  margin-left:35px;
  margin-top:35px;
}

.input-container {
  display: flex;
  width: 100%;
  margin-left:20px;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #000;
  border-radius: 8px;
  background-color: #fff;   /* fundo branco */
  color: #000;              /* texto digitado preto */
}

/* Placeholder preto */
.input-field::placeholder {
  color: #000;
  opacity: 1;
}

.login-button {
  --background: #334A80;
  --color: #fff;
  font-weight: 600;
  --border-radius: 8px;
  margin-left:35px;
  margin-top:85px;
}

/* Links adicionais */
.link1 {
  display: block;        /* para poder usar margin-left/margin-right */
  margin-left: 120px;     /* ajuste horizontal do link */
}

.link1 p {
  margin: 0;
  font-size: 0.9rem;
}

.link1 a {
  color: #334A80;
  font-weight: 600;
  text-decoration: none;
}




.link2 {
  display: block;        /* para poder usar margin-left/margin-right */
  margin-right: 18px;     /* ajuste horizontal do link */
}

.link2 p {
  margin: 0;
  font-size: 0.9rem;
}

.link2 a {
  color: #334A80;
  font-weight: 600;
  text-decoration: none;
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

  // Forçar Content-Type application/json
  this.http.post(`${this.API_URL}/login`, body, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: (res: any) => {
      console.log("Resposta do servidor:", res);

      if (res.token) {
        localStorage.setItem('token', res.token);
        this.showToast('Login realizado com sucesso!', 'success');
        this.router.navigate(['/todos']);
      } else {
        this.showToast('Token não recebido do servidor', 'danger');
      }
    },
    error: (err) => {
      console.error("Erro no login:", err);
      this.showToast(err.error?.message || 'Erro ao fazer login', 'danger');
    }
  });
}
}