import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class SplashPage {

  constructor(private router: Router) {}

  ngOnInit() {
    // Redireciona após 2,5 segundos
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2500);
  }
}
