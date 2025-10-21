import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TodosPage } from './pages/todos/todos.page';
import { SettingsPage } from './pages/settings/settings.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { SplashPage } from './pages/splash/splash.page';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashPage },
  { path: 'todos', component: TodosPage },
  { path: 'settings', component: SettingsPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
