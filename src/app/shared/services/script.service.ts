import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  get renderer(): Renderer2 {
    return this.currentRenderer;
  }

  set renderer(renderer: Renderer2) {
    if (!this.currentRenderer) {
      this.currentRenderer = renderer;
    }
  }

  get body(): HTMLElement {
    return this.document.body;
  }

  private currentRenderer!: Renderer2;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  loadScripts(renderer: Renderer2): void {
    this.renderer = renderer;
  }

  createScriptWithContent(content: string): void {
    if (this.renderer) {
      const script: HTMLScriptElement = this.renderer.createElement('script');
      script.innerHTML = content;
      this.renderer.appendChild(this.body, script);
    }
  }

  createScript(src: string): void {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.setAttribute(script, 'async', 'true');
    this.renderer.setAttribute(script, 'defer', 'true');
    this.renderer.appendChild(this.body, script);
  }
}
