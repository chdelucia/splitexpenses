import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { GoogleAnaliticsService, ScriptService } from '@shared/services';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2);
  private googleAnalitics = inject(GoogleAnaliticsService);
  private scriptService = inject(ScriptService);

  title = 'splity';

  ngOnInit(): void {
    this.scriptService.loadScripts(this.renderer);
    this.googleAnalitics.initialize();
  }
}
