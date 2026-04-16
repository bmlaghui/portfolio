import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { ProjectsComponent } from '../../components/projects/projects';
import { ContactComponent } from '../../components/contact/contact';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    HeroComponent, 
    ProjectsComponent, 
    ContactComponent, 
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero id="about"></app-hero>
      <app-projects id="projects"></app-projects>
      <app-contact id="contact"></app-contact>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    main {
      padding-bottom: 5rem;
    }
  `]
})
export class HomeComponent {}
