import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

/** Emblema minimalista de la S y el clavo, inspirado en la fotografía del usuario; comparte origen con favicon e iconos instalables. */
@Component({
  selector: 'of-logo',
  imports: [NgOptimizedImage],
  template: '<img ngSrc="icon-192.png" width="32" height="32" alt="" priority />',
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-flex;
      inline-size: 2rem;
      block-size: 2rem;
      flex-shrink: 0;
    }
    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      border-radius: var(--radius-md);
    }
  `,
})
export class LogoComponent {}
