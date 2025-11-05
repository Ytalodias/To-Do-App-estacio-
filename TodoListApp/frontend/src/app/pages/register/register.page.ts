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
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient) {}

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert("Preencha todos os campos!");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const body = { email: this.email, password: this.password };

this.http.post('https://todolist-backend-4ya9.onrender.com/api/auth/register', body).subscribe({
  next: (res: any) => {
    console.log('Usuário registrado:', res);
    alert(res.message);
    window.location.href = '/login'; // redireciona para login
  },
  error: (err) => {
    console.error('Erro ao registrar:', err.error?.message || err);
    alert(err.error?.message || 'Erro ao registrar');
  }
});

  }
}
