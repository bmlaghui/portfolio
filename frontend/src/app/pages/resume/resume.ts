import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService } from '../../core/services/seo.service';
import { Education, EducationService } from '../../services/education.service';
import { Experience, ExperienceService } from '../../services/experience.service';
import { Profile, ProfileService } from '../../services/profile.service';
import { Skill, SkillsService } from '../../services/skills.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <main class="resume-shell">
      <div class="actions container">
        <a href="/">← Portfolio</a>
        <button (click)="print()">{{ t.currentLang() === 'fr' ? 'Imprimer / Enregistrer en PDF' : 'Print / Save as PDF' }} ↓</button>
      </div>
      @if (profile(); as p) {
        <article class="resume">
          <header>
            <span class="monogram">BM</span>
            <div><h1>{{ p.name }}</h1><h2>{{ t.currentLang() === 'en' && p.titleEn ? p.titleEn : p.title }}</h2></div>
            <address>
              @if (p.email) { <a [href]="'mailto:' + p.email">{{ p.email }}</a> }
              @if (p.location) { <span>{{ p.location }}</span> }
              @if (p.linkedin) { <a [href]="p.linkedin">LinkedIn</a> }
              @if (p.github) { <a [href]="p.github">GitHub</a> }
            </address>
          </header>
          <section class="intro"><span>PROFILE</span><p>{{ t.currentLang() === 'en' && p.bioEn ? p.bioEn : p.bio }}</p></section>
          <div class="columns">
            <section class="main">
              <h3>EXPÉRIENCE</h3>
              @for (item of experiences(); track item.id) {
                <div class="entry">
                  <div class="date">{{ item.startDate | date:'yyyy' }} — {{ item.current ? (t.currentLang() === 'fr' ? 'Présent' : 'Present') : (item.endDate | date:'yyyy') }}</div>
                  <div><h4>{{ t.currentLang() === 'en' && item.positionEn ? item.positionEn : item.position }}</h4><strong>{{ item.company }}</strong><p>{{ t.currentLang() === 'en' && item.descriptionEn ? item.descriptionEn : item.description }}</p><small>{{ item.skills.join(' · ') }}</small></div>
                </div>
              }
            </section>
            <aside>
              <section><h3>EXPERTISE</h3><div class="skill-list">@for (skill of skills(); track skill.id) { <span>{{ skill.name }}</span> }</div></section>
              <section><h3>FORMATION</h3>@for (item of education(); track item.id) { <div class="education"><b>{{ item.degree }}</b><span>{{ item.field }}</span><small>{{ item.school }} · {{ item.endDate | date:'yyyy' }}</small></div> }</section>
            </aside>
          </div>
        </article>
      }
    </main>
  `,
  styles: [`
    .resume-shell{padding:7rem 1rem 5rem;background:#0a0910;min-height:100vh}.actions{display:flex;justify-content:space-between;align-items:center;padding:2rem 0}.actions a{color:var(--text-muted);text-decoration:none}.actions button{border:0;background:var(--primary);color:#fff;border-radius:10px;padding:.85rem 1.1rem;font-weight:800;cursor:pointer}
    .resume{width:min(1050px,100%);margin:auto;background:#fff;color:#17151d;padding:4rem;box-shadow:0 30px 100px rgba(0,0,0,.4)}header{display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;border-bottom:3px solid #17151d;padding-bottom:2rem}
    .monogram{display:grid;place-items:center;width:72px;height:72px;border-radius:18px;background:#17151d;color:#fff;font-weight:900;font-size:1.25rem}h1{font-size:2.5rem;line-height:1;margin:0}header h2{font-size:1rem;color:#645e69;margin:.6rem 0 0}address{display:flex;flex-direction:column;gap:.25rem;font-style:normal;font-size:.7rem;text-align:right}address a{color:inherit}
    .intro{display:grid;grid-template-columns:130px 1fr;gap:2rem;padding:2.5rem 0;border-bottom:1px solid #ddd}.intro span,h3{font-size:.63rem;letter-spacing:2px;font-weight:900}.intro p{margin:0;line-height:1.65;color:#514b56}
    .columns{display:grid;grid-template-columns:2fr 1fr;gap:4rem;padding-top:2.5rem}h3{border-bottom:1px solid #ddd;padding-bottom:.75rem;margin:0 0 1.5rem}.entry{display:grid;grid-template-columns:90px 1fr;gap:1.5rem;margin-bottom:2rem}.date{font-size:.65rem;color:#716b75}.entry h4{margin:0;font-size:1rem}.entry strong{display:block;color:#6f36a8;font-size:.72rem;margin:.3rem 0}.entry p{font-size:.76rem;line-height:1.55;color:#514b56}.entry small{font-size:.6rem;color:#716b75}
    aside section{margin-bottom:2.5rem}.skill-list{display:flex;flex-wrap:wrap;gap:.45rem}.skill-list span{font-size:.64rem;border:1px solid #ccc;padding:.35rem .5rem;border-radius:4px}.education{margin-bottom:1.2rem}.education b,.education span,.education small{display:block}.education b{font-size:.76rem}.education span{font-size:.67rem;margin:.25rem 0}.education small{font-size:.58rem;color:#716b75}
    @media(max-width:750px){.resume{padding:2rem}.columns,header{grid-template-columns:1fr}.intro{grid-template-columns:1fr}address{text-align:left}.entry{grid-template-columns:1fr}.resume-shell{padding-top:5rem}}
    @media print{app-navbar,.actions{display:none!important}.resume-shell{padding:0;background:#fff}.resume{width:100%;box-shadow:none;padding:12mm}.entry{break-inside:avoid}@page{size:A4;margin:0}}
  `]
})
export class ResumeComponent implements OnInit {
  t = inject(TranslationService);
  private profiles = inject(ProfileService);
  private experienceService = inject(ExperienceService);
  private educationService = inject(EducationService);
  private skillService = inject(SkillsService);
  private seo = inject(SeoService);
  private analytics = inject(AnalyticsService);
  profile = signal<Profile | null>(null);
  experiences = signal<Experience[]>([]);
  education = signal<Education[]>([]);
  skills = signal<Skill[]>([]);

  ngOnInit() {
    this.seo.setPage({ title: 'CV — Brahim MLAGHUI', description: 'CV dynamique de Brahim MLAGHUI, Tech Lead et développeur Full-Stack.', path: '/cv' });
    forkJoin({
      profile: this.profiles.get(),
      experiences: this.experienceService.getAll(),
      education: this.educationService.getAll(),
      skills: this.skillService.getAll(),
    }).subscribe(data => {
      this.profile.set(data.profile);
      this.experiences.set(data.experiences);
      this.education.set(data.education);
      this.skills.set(data.skills);
    });
  }

  print() {
    this.analytics.track('cv_view', { resource: 'resume', path: '/cv' });
    window.print();
  }
}
