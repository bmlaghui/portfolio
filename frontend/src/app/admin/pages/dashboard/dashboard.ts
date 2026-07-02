import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsApiService } from '../../services/admin-api.services';
import { DashboardStats } from '../../interfaces/admin.interfaces';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
           <div class="cyber-badge">System Status: Online</div>
           <h1>Command Center</h1>
           <p>Flux de données et métadonnées du portfolio en temps réel.</p>
        </div>
        <div class="sync-status">
           <span class="label">SYNC_TIMESTAMP</span>
           <span class="val">{{ stats()?.updatedAt | date:'HH:mm:ss' }}</span>
        </div>
      </div>

      <div class="stats-grid" *ngIf="stats()">
        <div class="stat-node glass-neo-deep">
           <div class="node-icon proj">📁</div>
           <div class="node-data">
              <span class="label">PROJETS_DEPLOYÉS</span>
              <span class="value">{{ stats()?.projects }}</span>
           </div>
           <div class="node-footer">DATABASE_STABLE</div>
        </div>

        <div class="stat-node glass-neo-deep">
           <div class="node-icon blog">✍️</div>
           <div class="node-data">
              <span class="label">ARCHIVES_BLOG</span>
              <span class="value">{{ stats()?.blog }}</span>
           </div>
           <div class="node-footer">NEURAL_STORAGE_OK</div>
        </div>

        <div class="stat-node glass-neo-deep urgent-wrap" [class.urgent]="(stats()?.unreadMessages || 0) > 0">
           <div class="node-icon msg">✉️</div>
           <div class="node-data">
              <span class="label">MESSAGES_FLUX</span>
              <span class="value">
                 {{ stats()?.messages }}
                 <span class="alert-pill" *ngIf="(stats()?.unreadMessages || 0) > 0">{{ stats()?.unreadMessages }} NEW</span>
              </span>
           </div>
           <div class="node-footer">{{ (stats()?.unreadMessages || 0) > 0 ? 'ACTION_REQUIRED' : 'NO_PENDING_MESSAGES' }}</div>
        </div>

        <div class="stat-node glass-neo-deep">
           <div class="node-icon skill">⚡</div>
           <div class="node-data">
              <span class="label">TECH_STACK_NODES</span>
              <span class="value">{{ stats()?.skills }}</span>
           </div>
           <div class="node-footer">ARSENAL_LOADED</div>
        </div>
      </div>

      <div class="details-console">
        <div class="sys-console glass-neo-deep">
           <header class="cons-header">
              <div class="p-dot"></div>
              <h2>DIAGNOSTIC_SYSTÈME</h2>
           </header>
           <div class="sys-grid">
              <div class="sys-cell">
                 <span class="s-label">CORE_POSTGRES</span>
                 <span class="s-status ok">OPERATIONAL // PORT_5432</span>
              </div>
              <div class="sys-cell">
                 <span class="s-label">CACHE_REDIS</span>
                 <span class="s-status ok">ACTIVE // VOLATILE_MEMORY</span>
              </div>
              <div class="sys-cell">
                 <span class="s-label">API_NESTJS</span>
                 <span class="s-status ok">ONLINE // REQ_200_OK</span>
              </div>
           </div>
        </div>

        <div class="quick-grid">
           <button class="q-tile glass-card" routerLink="/admin/projects">
              <span class="t-icon">🚀</span>
              <div class="t-text"><span>NEW_PROJECT</span><small>DÉPLOYER RÉALISATION</small></div>
           </button>
           <button class="q-tile glass-card" routerLink="/admin/profile">
              <span class="t-icon">👤</span>
              <div class="t-text"><span>UPDATE_IDENTITY</span><small>ÉDITER PARAMÈTRES CORE</small></div>
           </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --accent: #c084fc; }
    .sync-status { text-align: right; border-right: 3px solid var(--accent); padding-right: 1.5rem; }
    .sync-status .label { display: block; font-size: 0.6rem; font-weight: 900; color: #334155; letter-spacing: 2px; }
    .sync-status .val { font-size: 1.6rem; font-weight: 950; color: #fff; line-height: 1; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .stat-node { padding: 3rem; display: flex; flex-direction: column; gap: 2.5rem; transition: 0.4s; overflow: hidden; border-radius: 20px; }
    .stat-node:hover { transform: translateY(-5px); border-color: var(--accent) !important; }
    
    .node-icon { font-size: 2rem; width: 60px; height: 60px; background: rgba(255,255,255,0.02); border-radius: 15px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.05); }
    .node-icon.proj { color: #c084fc; }
    .node-icon.blog { color: #6366f1; }
    .node-icon.msg { color: #22d3ee; }
    .node-icon.skill { color: #4ade80; }

    .node-data .label { display: block; font-size: 0.7rem; font-weight: 900; color: #475569; letter-spacing: 2px; margin-bottom: 0.5rem; }
    .node-data .value { font-size: 4rem; font-weight: 950; color: #fff; line-height: 0.8; display: flex; align-items: flex-end; gap: 1rem; }
    
    .alert-pill { font-size: 0.8rem; background: #ef4444; color: #fff; padding: 0.3rem 0.8rem; border-radius: 4px; box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); animation: pulse-glow 2s infinite; }
    .node-footer { font-size: 0.6rem; font-weight: 900; color: #1e293b; letter-spacing: 1px; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.02); padding-top: 1rem; }

    .urgent-wrap.urgent { border-color: rgba(239, 68, 68, 0.2) !important; }

    .details-console { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
    .sys-console { padding: 3rem; border-radius: 24px; }
    .cons-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem; }
    .cons-header h2 { font-size: 1.2rem; font-weight: 950; color: #fff; letter-spacing: 1px; margin: 0; }
    .p-dot { width: 12px; height: 12px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 20px #4ade80; animation: pulse-glow 1.5s infinite; }

    .sys-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .sys-cell { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: rgba(255,255,255,0.01); border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }
    .s-label { font-size: 0.7rem; font-weight: 900; color: #475569; letter-spacing: 1px; }
    .s-status { font-family: monospace; font-size: 0.9rem; font-weight: 950; }
    .s-status.ok { color: #4ade80; }

    .quick-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
    .q-tile { padding: 2.5rem; display: flex; align-items: center; gap: 2rem; text-align: left; transition: 0.3s; cursor: pointer; border-radius: 20px; border: 1px solid #111; background: none; color: inherit; }
    .q-tile:hover { border-color: var(--accent); transform: translateX(10px); background: rgba(192, 132, 252, 0.05); }
    .t-icon { font-size: 2rem; }
    .t-text span { display: block; font-size: 1rem; font-weight: 950; color: #fff; }
    .t-text small { font-size: 0.65rem; color: #475569; font-weight: 900; letter-spacing: 1px; }

    @media (max-width: 1024px) { .details-console { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  statsApi = inject(StatsApiService);
  ngOnInit() { this.load(); setInterval(() => this.load(), 30000); }
  load() { this.statsApi.getStats().subscribe((res: DashboardStats) => this.stats.set(res)); }
}
