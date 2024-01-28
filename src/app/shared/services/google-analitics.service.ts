import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ScriptService } from './script.service';
import { environment } from '@env/environment';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

type GtagFunction = {
  (data: unknown): void;
};

interface GtagWindow extends Window {
  gtag?: GtagFunction;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAnaliticsService implements OnDestroy {
  get gtag(): GtagFunction | undefined {
    return (this.document.defaultView as GtagWindow)?.gtag;
  }

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private scriptService: ScriptService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initialize(): void {
    this.onRouteChange();
    this.scriptService.createScript(
      `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalytics}`,
    );

    this.scriptService.createScriptWithContent(`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${environment.googleAnalytics}')`);
  }

  onRouteChange(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
      if (event instanceof NavigationEnd && this.gtag) {
        this.gtag({
          page_path: event.urlAfterRedirects,
          page_location: document.location.href,
          page_referrer: document.referrer,
          send_page_view: true,
        });
      }
    });
  }
}
