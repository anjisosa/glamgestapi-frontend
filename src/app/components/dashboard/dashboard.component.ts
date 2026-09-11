import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="eyebrow">Panel principal</p>
          <h2>Bienvenido a Glamgest</h2>
        </div>
      </header>

      <div class="stats-grid">
        <article class="stat-card">
          <span>Agenda</span>
          <strong>Próximamente</strong>
        </article>
        <article class="stat-card">
          <span>Clientes</span>
          <strong>Próximamente</strong>
        </article>
        <article class="stat-card">
          <span>Servicios</span>
          <strong>Próximamente</strong>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display:block; }
      .dashboard-shell { padding: 32px; }
      .dashboard-header { margin-bottom: 24px; }
      .eyebrow { margin:0 0 10px; color:#155eef; font-size:11px; letter-spacing:.16em; text-transform:uppercase; font-weight:800; }
      h2 { margin:0; color:#15233d; font-size:32px; }
      .stats-grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; }
      .stat-card { background:#eef4ff; border-radius:12px; padding:24px; display:grid; gap:10px; }
      .stat-card span { color:#155eef; font-weight:700; font-size:12px; }
      .stat-card strong { color:#15233d; font-size:18px; }
      @media (max-width: 720px) { .stats-grid { grid-template-columns:1fr; } }
    `
  ]
})
export class DashboardComponent {}
