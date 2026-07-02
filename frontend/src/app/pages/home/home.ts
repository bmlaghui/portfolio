import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { AboutComponent } from '../../components/about/about';
import { ExperienceComponent } from '../../components/experience/experience';
import { EducationComponent } from '../../components/education/education';
import { ProjectsComponent } from '../../components/projects/projects';
import { BlogComponent } from '../../components/blog/blog';
import { ContactComponent } from '../../components/contact/contact';
import { FooterComponent } from '../../components/footer/footer';
import { TestimonialsComponent } from '../../components/testimonials/testimonials';
import { SeoService } from '../../core/services/seo.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    HeroComponent, 
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectsComponent,
    BlogComponent,
    ContactComponent, 
    FooterComponent,
    TestimonialsComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-projects></app-projects>
      <app-experience></app-experience>
      <app-education></app-education>
      <app-testimonials></app-testimonials>
      <app-blog></app-blog>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    section {
      scroll-margin-top: 100px;
    }
  `]
})
export class HomeComponent implements AfterViewInit {
  private seo = inject(SeoService);
  constructor() {
    this.seo.setPage({
      title: 'Brahim MLAGHUI — Tech Lead & Développeur Full-Stack',
      description: 'Tech Lead spécialisé Angular, Symfony et NestJS. Architecture, UX et développement de produits web robustes.',
      path: '/',
    });
  }
  ngAfterViewInit() {
    const id = window.location.hash.slice(1);
    if (!id) return;
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });
    });
  }
}
