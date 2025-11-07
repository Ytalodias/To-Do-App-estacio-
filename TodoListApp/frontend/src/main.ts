import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { SplashPage } from './app/pages/splash/splash.page';
import { LoginPage } from './app/pages/login/login.page';
import { RegisterPage } from './app/pages/register/register.page';
import { TodosPage } from './app/pages/todos/todos.page';
import { SettingsPage } from './app/pages/settings/settings.page';
import { ChangePasswordPage } from './app/pages/todos/change-password.page'; // <--- importar a página

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideRouter([
      { path: '', component: SplashPage },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: 'todos', component: TodosPage },
      { path: 'settings', component: SettingsPage },
      { path: 'forgot-password', component: ChangePasswordPage }, // <--- rota adicionada
      { path: '**', redirectTo: '' }
    ])
  ]
}).catch(err => console.error(err));
