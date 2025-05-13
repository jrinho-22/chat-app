import {
    Directive,
    ElementRef,
    Input,
    Renderer2,
    SimpleChanges,
    OnChanges
  } from '@angular/core';
  
  @Directive({
    selector: '[paint]',
    standalone: true
  })
  export class PaintDirective implements OnChanges {
    @Input('paint') active!: boolean;
  
    constructor(private el: ElementRef, private renderer: Renderer2) {}
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['active']) {
        const isActive = changes['active'].currentValue;
        const host = this.el.nativeElement;
  
        this.clearPrevious();
  
        if (isActive) {
          for (let i = 1; i <= 3; i++) {
            const div = this.renderer.createElement('div');
            this.renderer.addClass(div, `item_animate-${i}`);
            this.renderer.appendChild(host, div);
          }
        }
      }
    }
  
    private clearPrevious() {
      const host = this.el.nativeElement;
      const children = Array.from(host.children) as HTMLElement[];
  
      for (const child of children) {
        if (child.className.startsWith('item_animate-')) {
          this.renderer.removeChild(host, child);
        }
      }
    }
  }
  