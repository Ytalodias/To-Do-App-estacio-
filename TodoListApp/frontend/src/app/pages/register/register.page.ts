import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule, HttpClientModule]
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  securityQuestion: string = '';
  securityAnswer: string = '';

  constructor(private http: HttpClient) {}

  register(): void {
    if (!this.email || !this.password || !this.confirmPassword || !this.securityQuestion || !this.securityAnswer) {
      alert("Preencha todos os campos!");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const body = { 
      email: this.email, 
      password: this.password,
      securityQuestion: this.securityQuestion,
      securityAnswer: this.securityAnswer
    };

    this.http.post('https://todolist-backend-4ya9.onrender.com/api/auth/register', body)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Cadastro realizado com sucesso!');
          window.location.href = '/login';
        },
        error: (err) => {
          alert(err.error?.message || 'Erro ao registrar');
        }
      });
  }
}
