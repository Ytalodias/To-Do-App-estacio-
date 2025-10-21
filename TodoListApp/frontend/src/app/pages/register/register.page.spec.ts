import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule]
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';

  register() {
    console.log('Cadastro:', this.email, this.password, this.confirmPassword);
    // Aqui você pode redirecionar para o login
    // Ex: this.router.navigate(['/login']);
  }
}
