import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatsApiService } from '../../services/admin-api.services';
import { DashboardStats } from '../../interfaces/admin.interfaces';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge"><i></i> Analytics Live</div>
          <h1>Command Center</h1>
          <p>Audience, contenu et signaux du portfolio sur les 30 derniers jours.</p>
        </div>
        <div class="sync-status"><span>DERNIÈRE SYNCHRONISATION</span><b>{{ stats()?.updatedAt | date:'HH:mm:ss' }}</b><button type="button" (click)="load()" [class.loading]="loading()">↻</button></div>
      </div>

      <div class="dashboard-state" *ngIf="!stats()">
        <div class="state-orbit" [class.error]="!!error()"><i></i></div>
        <h2>{{ error() ? 'Données indisponibles' : 'Synchronisation des données…' }}</h2>
        <p>{{ error() || 'Le centre de contrôle prépare vos indicateurs.' }}</p>
        <button type="button" *ngIf="error()" (click)="load()">Réessayer</button>
      </div>

      <ng-container *ngIf="stats() as data">
        <section class="kpi-grid">
          <article class="kpi purple">
            <div class="kpi-head"><span>VUES DU PORTFOLIO</span><i>↗</i></div>
            <strong>{{ data.pageViews }}</strong>
            <footer><b [class.negative]="data.trafficGrowth < 0">{{ data.trafficGrowth >= 0 ? '+' : '' }}{{ data.trafficGrowth }}%</b><span>· {{ data.uniqueVisitors }} visiteur{{ data.uniqueVisitors > 1 ? 's' : '' }} unique{{ data.uniqueVisitors > 1 ? 's' : '' }}</span></footer>
          </article>
          <article class="kpi cyan">
            <div class="kpi-head"><span>INTERACTIONS</span><i>◎</i></div>
            <strong>{{ data.interactions }}</strong>
            <footer><b>{{ data.unreadMessages }}</b><span>message{{ data.unreadMessages > 1 ? 's' : '' }} à traiter</span></footer>
          </article>
          <article class="kpi green">
            <div class="kpi-head"><span>ABONNÉS ACTIFS</span><i>＋</i></div>
            <strong>{{ data.subscribers }}</strong>
            <footer><b>{{ data.messages }}</b><span>contacts reçus au total</span></footer>
          </article>
          <article class="kpi amber">
            <div class="kpi-head"><span>TAUX DE PUBLICATION</span><i>◒</i></div>
            <strong>{{ data.publicationRate }}<small>%</small></strong>
            <footer><b>{{ data.publicationStatus.drafts }}</b><span>brouillon{{ data.publicationStatus.drafts > 1 ? 's' : '' }} restant{{ data.publicationStatus.drafts > 1 ? 's' : '' }}</span></footer>
          </article>
        </section>

        <section class="dashboard-grid">
          <article class="panel traffic-panel">
            <header><div><span>ÉVOLUTION DU TRAFIC</span><h2>Audience quotidienne</h2></div><div class="legend"><span><i class="views"></i>Vues</span><span><i class="events"></i>Interactions</span></div></header>
            <div class="line-chart">
              <div class="y-labels"><span>{{ timelineMax() }}</span><span>{{ halfTimelineMax() }}</span><span>0</span></div>
              <svg viewBox="0 0 720 220" preserveAspectRatio="none" role="img" aria-label="Évolution des vues et interactions">
                <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c084fc" stop-opacity=".28"/><stop offset="1" stop-color="#c084fc" stop-opacity="0"/></linearGradient></defs>
                <g class="grid-lines"><line x1="20" y1="30" x2="700" y2="30"/><line x1="20" y1="110" x2="700" y2="110"/><line x1="20" y1="190" x2="700" y2="190"/></g>
                <path class="area" [attr.d]="areaPath()"/>
                <path class="views-line" [attr.d]="linePath('views')"/>
                <path class="events-line" [attr.d]="linePath('interactions')"/>
                <g class="points"><circle *ngFor="let point of chartPoints('views'); trackBy: trackByIndex" [attr.cx]="point.x" [attr.cy]="point.y" r="3"><title>{{ point.label }} : {{ point.value }} vues</title></circle></g>
              </svg>
              <div class="x-labels"><span *ngFor="let item of timelineLabels()">{{ item }}</span></div>
            </div>
          </article>

          <article class="panel distribution-panel">
            <header><div><span>RÉPARTITION DU CONTENU</span><h2>Écosystème éditorial</h2></div><b>{{ contentTotal() }}</b></header>
            <div class="donut-wrap">
              <div class="donut" [style.background]="pieGradient()"><div><strong>{{ contentTotal() }}</strong><span>ÉLÉMENTS</span></div></div>
              <ul><li *ngFor="let item of data.contentDistribution"><i [style.background]="item.color"></i><span>{{ item.label }}</span><b>{{ item.value }}</b></li></ul>
            </div>
          </article>

          <article class="panel bars-panel">
            <header><div><span>MATRICE TECHNIQUE</span><h2>Compétences par catégorie</h2></div><b>{{ data.skills }}</b></header>
            <div class="column-chart">
              <div class="columns">
                <div class="column" *ngFor="let item of data.skillCategories">
                  <span class="column-value">{{ item.value }}</span>
                  <div><i [style.height.%]="barHeight(item.value)"></i></div>
                  <small>{{ item.label }}</small>
                </div>
                <div class="empty-chart" *ngIf="!data.skillCategories.length">Aucune compétence enregistrée</div>
              </div>
            </div>
          </article>

          <article class="panel pages-panel">
            <header><div><span>DESTINATIONS</span><h2>Pages les plus consultées</h2></div><b>30J</b></header>
            <div class="page-list">
              <div *ngFor="let page of data.traffic.topPages; let i = index">
                <span class="rank">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <span class="path">{{ page.path }}</span>
                <div class="page-bar"><i [style.width.%]="pageWidth(page.views)"></i></div>
                <b>{{ page.views }}</b>
              </div>
              <div class="empty-chart" *ngIf="!data.traffic.topPages.length">Les premières visites apparaîtront ici.</div>
            </div>
          </article>

          <article class="panel activity-panel">
            <header><div><span>JOURNAL D’ACTIVITÉ</span><h2>Derniers événements</h2></div><a routerLink="/admin/messages">Tout voir →</a></header>
            <div class="activity-list">
              <div *ngFor="let item of data.recentActivity">
                <i [attr.data-type]="item.type">{{ activityIcon(item.type) }}</i>
                <div><b>{{ item.label }}</b><span>{{ activityLabel(item.type) }}</span></div>
                <time>{{ item.date | date:'dd MMM · HH:mm' }}</time>
              </div>
            </div>
          </article>
        </section>

        <section class="content-strip">
          <a routerLink="/admin/projects"><span>PROJETS</span><b>{{ data.projects }}</b><i>→</i></a>
          <a routerLink="/admin/blog"><span>ARTICLES</span><b>{{ data.blog }}</b><i>→</i></a>
          <a routerLink="/admin/experience"><span>EXPÉRIENCES</span><b>{{ data.experience }}</b><i>→</i></a>
          <a routerLink="/admin/testimonials"><span>TÉMOIGNAGES</span><b>{{ data.testimonials }}</b><i>→</i></a>
        </section>
      </ng-container>
    </div>
  `,
  styles: [`
    .cyber-badge i{display:inline-block;width:6px;height:6px;margin-right:.4rem;background:#4ade80;border-radius:50%;box-shadow:0 0 8px #4ade80}.sync-status{display:grid;grid-template-columns:1fr auto;align-items:center;gap:.15rem .7rem;text-align:right}.sync-status span{grid-column:1/-1;color:#343b46;font:.5rem monospace;letter-spacing:1.2px}.sync-status b{color:#dce2eb;font:800 1rem monospace}.sync-status button{width:28px;height:28px;color:var(--primary);background:#101010;border:1px solid #202020;border-radius:7px;cursor:pointer}.sync-status button.loading{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
    .dashboard-state{min-height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#0a0a0a;border:1px solid #191919;border-radius:16px}.state-orbit{width:55px;height:55px;display:grid;place-items:center;margin-bottom:1rem;border:1px solid rgba(192,132,252,.22);border-radius:50%;animation:spin 1.5s linear infinite}.state-orbit i{width:8px;height:8px;background:var(--primary);border-radius:50%;box-shadow:0 0 12px var(--primary);transform:translateY(-26px)}.state-orbit.error{animation:none;border-color:rgba(239,68,68,.25)}.state-orbit.error i{background:#ef4444;box-shadow:0 0 12px #ef4444;transform:none}.dashboard-state h2{margin:0;color:#dce2eb;font-size:1rem}.dashboard-state p{max-width:430px;margin:.5rem 0 0;color:#4b5360;font-size:.7rem;line-height:1.6}.dashboard-state button{margin-top:1rem;padding:.6rem 1rem;color:#080808;background:var(--primary);border:0;border-radius:8px;cursor:pointer;font-size:.66rem;font-weight:850}
    .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1rem}.kpi{position:relative;overflow:hidden;padding:1.2rem;background:#0a0a0a;border:1px solid #191919;border-radius:14px}.kpi::before{content:'';position:absolute;inset:0 auto 0 0;width:2px;background:var(--kpi)}.kpi.purple{--kpi:#c084fc}.kpi.cyan{--kpi:#22d3ee}.kpi.green{--kpi:#4ade80}.kpi.amber{--kpi:#f59e0b}.kpi-head{display:flex;justify-content:space-between;color:#4b5360;font-size:.55rem;font-weight:900;letter-spacing:1px}.kpi-head i{color:var(--kpi);font-style:normal}.kpi>strong{display:block;margin:1rem 0;color:#f5f7fa;font-size:2.5rem;line-height:1}.kpi>strong small{font-size:1rem;color:#69727f}.kpi footer{display:flex;align-items:center;gap:.45rem}.kpi footer b{color:#4ade80;font-size:.65rem}.kpi footer b.negative{color:#f87171}.kpi footer span{color:#3b424d;font-size:.56rem}
    .dashboard-grid{display:grid;grid-template-columns:1.45fr 1fr;gap:1rem}.panel{min-width:0;padding:1.25rem;background:#0a0a0a;border:1px solid #191919;border-radius:15px}.panel>header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.2rem}.panel header span{color:#3c4450;font:.5rem monospace;letter-spacing:1.2px}.panel header h2{margin:.3rem 0 0;color:#dfe4eb;font-size:.9rem}.panel header>b{color:#596270;font:700 .7rem monospace}.traffic-panel{grid-column:1/-1}.legend{display:flex;gap:1rem}.legend span{display:flex;align-items:center;gap:.35rem}.legend i{width:7px;height:7px;border-radius:50%}.legend .views{background:#c084fc}.legend .events{background:#22d3ee}
    .line-chart{position:relative;padding-left:32px}.line-chart svg{width:100%;height:230px;overflow:visible}.grid-lines line{stroke:#171717;stroke-width:1}.area{fill:url(#areaGradient)}.views-line,.events-line{fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.views-line{stroke:#c084fc;filter:drop-shadow(0 0 5px rgba(192,132,252,.35))}.events-line{stroke:#22d3ee;stroke-dasharray:5 5}.points circle{fill:#0a0a0a;stroke:#c084fc;stroke-width:2}.y-labels{position:absolute;left:0;top:26px;height:166px;display:flex;flex-direction:column;justify-content:space-between;color:#303742;font:.52rem monospace}.x-labels{display:flex;justify-content:space-between;padding:0 1rem;color:#343b46;font:.5rem monospace}
    .distribution-panel,.bars-panel{min-height:310px}.donut-wrap{display:grid;grid-template-columns:150px 1fr;align-items:center;gap:1.3rem}.donut{width:145px;height:145px;display:grid;place-items:center;border-radius:50%}.donut>div{width:94px;height:94px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0a0a0a;border-radius:50%;box-shadow:0 0 0 1px #171717}.donut strong{color:#f1f5f9;font-size:1.5rem}.donut span{color:#3e4651;font:.48rem monospace;letter-spacing:1px}.donut-wrap ul{display:flex;flex-direction:column;gap:.55rem;margin:0;padding:0;list-style:none}.donut-wrap li{display:grid;grid-template-columns:7px 1fr auto;align-items:center;gap:.5rem;color:#5c6572;font-size:.6rem}.donut-wrap li i{width:7px;height:7px;border-radius:2px}.donut-wrap li b{color:#9aa3af}
    .column-chart{height:220px}.columns{height:100%;display:flex;align-items:flex-end;justify-content:space-around;gap:.7rem;padding-top:1rem;border-bottom:1px solid #1b1b1b}.column{height:100%;min-width:42px;display:grid;grid-template-rows:18px 1fr 28px;gap:.3rem;text-align:center}.column-value{color:#69727f;font:.55rem monospace}.column>div{position:relative;height:100%;display:flex;align-items:flex-end;justify-content:center;background:repeating-linear-gradient(to top,#141414 0,#141414 1px,transparent 1px,transparent 25%)}.column i{width:55%;min-height:4px;background:linear-gradient(to top,#7c3aed,#c084fc);border-radius:5px 5px 0 0;box-shadow:0 0 10px rgba(192,132,252,.16);transition:.5s}.column small{overflow:hidden;color:#424a55;font-size:.5rem;text-overflow:ellipsis}.empty-chart{margin:auto;color:#343b46;font-size:.65rem}
    .page-list{display:flex;flex-direction:column;gap:.85rem}.page-list>div{display:grid;grid-template-columns:22px minmax(80px,1fr) minmax(70px,1fr) 30px;align-items:center;gap:.65rem}.rank{color:#343b46;font:.52rem monospace}.path{overflow:hidden;color:#747e8b;font:.6rem monospace;text-overflow:ellipsis;white-space:nowrap}.page-bar{height:3px;background:#191919;border-radius:3px}.page-bar i{display:block;height:100%;background:#22d3ee;border-radius:3px}.page-list b{color:#9aa3af;font:.6rem monospace;text-align:right}.activity-panel header a{color:var(--primary);font-size:.58rem;text-decoration:none}.activity-list{display:flex;flex-direction:column}.activity-list>div{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:.7rem;padding:.65rem 0;border-bottom:1px solid #151515}.activity-list>div:last-child{border:0}.activity-list>div>i{width:30px;height:30px;display:grid;place-items:center;color:#c084fc;background:rgba(192,132,252,.07);border:1px solid rgba(192,132,252,.13);border-radius:8px;font-style:normal;font-size:.7rem}.activity-list i[data-type=blog]{color:#6366f1}.activity-list i[data-type=message]{color:#22d3ee}.activity-list div div{min-width:0;display:flex;flex-direction:column;gap:.1rem}.activity-list b{overflow:hidden;color:#9da6b2;font-size:.62rem;text-overflow:ellipsis;white-space:nowrap}.activity-list span{color:#3d4550;font-size:.53rem}.activity-list time{color:#343b46;font:.5rem monospace}
    .content-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;overflow:hidden;margin-top:1rem;background:#191919;border:1px solid #191919;border-radius:13px}.content-strip a{display:grid;grid-template-columns:1fr auto;gap:.3rem;padding:1rem;color:#454d59;background:#0a0a0a;text-decoration:none}.content-strip span{font:.52rem monospace;letter-spacing:1px}.content-strip b{grid-row:2;color:#dce2eb;font-size:1.2rem}.content-strip i{grid-column:2;grid-row:2;color:var(--primary);font-style:normal}.content-strip a:hover{background:#0e0e0e}
    @media(max-width:1000px){.kpi-grid{grid-template-columns:1fr 1fr}.dashboard-grid{grid-template-columns:1fr}.traffic-panel{grid-column:auto}.content-strip{grid-template-columns:1fr 1fr}}
    @media(max-width:600px){.kpi-grid{grid-template-columns:1fr}.sync-status{display:none}.panel{padding:1rem}.line-chart svg{height:190px}.x-labels span:nth-child(even){display:none}.donut-wrap{grid-template-columns:1fr}.donut{margin:auto}.content-strip{grid-template-columns:1fr 1fr}.legend{display:none}.page-list>div{grid-template-columns:20px minmax(80px,1fr) 35px}.page-bar{display:none}}
  `],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats = signal<DashboardStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  statsApi = inject(StatsApiService);
  private refreshTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.load();
    this.refreshTimer = setInterval(() => this.load(), 60_000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.statsApi.getStats().pipe(timeout(12_000)).subscribe({
      next: result => {
        this.stats.set(this.normalizeStats(result));
        this.loading.set(false);
      },
      error: response => {
        this.stats.set(null);
        this.error.set(
          response.name === 'TimeoutError'
            ? 'Le backend met trop de temps à répondre. Vérifiez PostgreSQL et Redis, puis réessayez.'
            : response.error?.message || 'Impossible de charger les statistiques. Vérifiez que le backend et les migrations sont à jour.',
        );
        this.loading.set(false);
      },
    });
  }

  timelineMax() {
    const items = this.stats()?.traffic.timeline || [];
    return Math.max(1, ...items.flatMap(item => [item.views, item.interactions]));
  }

  halfTimelineMax() { return Math.ceil(this.timelineMax() / 2); }

  chartPoints(key: 'views' | 'interactions') {
    const items = this.stats()?.traffic.timeline || [];
    const max = this.timelineMax();
    return items.map((item, index) => ({
      x: 20 + (index / Math.max(1, items.length - 1)) * 680,
      y: 190 - (item[key] / max) * 160,
      value: item[key],
      label: item.label,
    }));
  }

  linePath(key: 'views' | 'interactions') {
    return this.chartPoints(key).map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  }

  areaPath() {
    const points = this.chartPoints('views');
    if (!points.length) return '';
    return `${this.linePath('views')} L ${points.at(-1)!.x} 190 L ${points[0].x} 190 Z`;
  }

  timelineLabels() {
    const items = this.stats()?.traffic.timeline || [];
    return items.filter((_, index) => index % 2 === 0 || index === items.length - 1).map(item => item.label);
  }

  contentTotal() { return (this.stats()?.contentDistribution || []).reduce((sum, item) => sum + item.value, 0); }

  pieGradient() {
    const items = this.stats()?.contentDistribution || [];
    const total = this.contentTotal() || 1;
    let cursor = 0;
    const stops = items.map(item => {
      const start = cursor;
      cursor += (item.value / total) * 100;
      return `${item.color} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${stops.join(',') || '#1a1a1a 0 100%'})`;
  }

  barHeight(value: number) {
    const max = Math.max(1, ...(this.stats()?.skillCategories || []).map(item => item.value));
    return Math.max(5, (value / max) * 100);
  }

  pageWidth(value: number) {
    const max = Math.max(1, ...(this.stats()?.traffic.topPages || []).map(item => item.views));
    return (value / max) * 100;
  }

  activityIcon(type: string) { return type === 'project' ? '◆' : type === 'blog' ? '✎' : '✉'; }
  activityLabel(type: string) { return type === 'project' ? 'Projet mis à jour' : type === 'blog' ? 'Article mis à jour' : 'Nouveau contact'; }
  trackByIndex(index: number) { return index; }

  private normalizeStats(result: Partial<DashboardStats>): DashboardStats {
    const projects = result.projects || 0;
    const blog = result.blog || 0;
    const experience = result.experience || 0;
    const education = result.education || 0;
    const skills = result.skills || 0;
    const testimonials = result.testimonials || 0;
    return {
      projects,
      blog,
      experience,
      education,
      skills,
      testimonials,
      messages: result.messages || 0,
      unreadMessages: result.unreadMessages || 0,
      subscribers: result.subscribers || 0,
      pageViews: result.pageViews || 0,
      uniqueVisitors: result.uniqueVisitors || 0,
      uniqueSessions: result.uniqueSessions || 0,
      interactions: result.interactions || 0,
      trafficGrowth: result.trafficGrowth || 0,
      publicationRate: result.publicationRate || 0,
      traffic: {
        timeline: result.traffic?.timeline || [],
        topPages: result.traffic?.topPages || [],
      },
      contentDistribution: result.contentDistribution || [
        { label: 'Projets', value: projects, color: '#c084fc' },
        { label: 'Articles', value: blog, color: '#6366f1' },
        { label: 'Expériences', value: experience, color: '#22d3ee' },
        { label: 'Formations', value: education, color: '#f59e0b' },
        { label: 'Compétences', value: skills, color: '#4ade80' },
        { label: 'Témoignages', value: testimonials, color: '#f472b6' },
      ],
      skillCategories: result.skillCategories || [],
      publicationStatus: result.publicationStatus || { published: 0, drafts: 0 },
      recentActivity: result.recentActivity || [],
      updatedAt: result.updatedAt || new Date().toISOString(),
    };
  }
}
