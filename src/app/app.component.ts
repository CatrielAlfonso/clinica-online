import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationStart, Router } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatTooltip } from '@angular/material/tooltip';
import { HomeComponent } from './components/home/home.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { slideInAnimation } from './animations';
import { FormsModule } from '@angular/forms';
import { PipesModule } from './modules/pipes/pipes/pipes.module';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    HeaderComponent,
  FooterComponent,
  CommonModule, 
  FormsModule,
  PipesModule,
    // HomeComponent,
    // BienvenidaComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [ slideInAnimation ]
})
export class AppComponent {
  title = 'clinica-online';

 router: Router = inject(Router);
  
  estoyEnAnimacion: boolean = false;
  
  constructor() 
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) 
      {
        this.estoyEnAnimacion = true; 
        setTimeout(() => { this.estoyEnAnimacion = false; }, 500);
      }
    });
  }

	EstoyEnIngreso(): boolean
	{
		if(this.router.url == "/inicio-sesion") { return true; }
		return false;
	}

  EstoyEnRegistro(): boolean
  {
    if(this.router.url == "/registro") { return true; }
		return false;
  }

  EstoyEnLandingPage(): boolean
	{
		if(this.router.url == "/bienvenida") { return true; }
		return false;
	}


}
