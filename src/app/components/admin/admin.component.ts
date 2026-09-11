import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="dashboard admin-dashboard">
      <aside class="sidebar">
        <div class="brand">Glamgest</div>
        <nav>
          <button class="nav-item active">Overview</button>
          <button class="nav-item">Empleados</button>
          <button class="nav-item">Servicios</button>
          <button class="nav-item">Reportes</button>
        </nav>
      </aside>

      <main class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">Panel de administrador</p>
            <h1>Resumen general</h1>
          </div>
          <button class="primary-btn">Nuevo reporte</button>
        </header>

        <section class="cards">
          <article class="card accent">
            <span>Ingresos</span>
            <strong>$12.4K</strong>
            <small>+18% este mes</small>
          </article>
          <article class="card">
            <span>Citas</span>
            <strong>248</strong>
            <small>Este mes</small>
          </article>
          <article class="card">
            <span>Clientes</span>
            <strong>1.2K</strong>
            <small>Activos</small>
          </article>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f7fbf9 0%, #eefbf5 100%);
      font-family: Arial, sans-serif;
      color: #172b2a;
    }

    .dashboard {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
    }

    .sidebar {
      background: #ffffff;
      border-right: 1px solid #e6f1ec;
      padding: 28px 20px;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1d9d6b;
      margin-bottom: 32px;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .nav-item {
      border: none;
      background: transparent;
      text-align: left;
      padding: 12px 14px;
      border-radius: 12px;
      color: #40615c;
      font-weight: 600;
      cursor: pointer;
    }

    .nav-item.active {
      background: #eafaf4;
      color: #167a5a;
    }

    .content {
      padding: 32px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
    }

    .eyebrow {
      margin: 0 0 6px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #69877d;
      font-size: 0.72rem;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: 2.2rem;
      color: #17332d;
    }

    .primary-btn {
      border: none;
      background: linear-gradient(135deg, #1f9d6b 0%, #48c192 100%);
      color: white;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 18px rgba(31, 157, 107, 0.2);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(180px, 1fr));
      gap: 20px;
    }

    .card {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #ebf5f1;
      border-radius: 18px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 10px 25px rgba(17, 48, 38, 0.04);
    }

    .card.accent {
      background: linear-gradient(135deg, #ebfaf3 0%, #ffffff 100%);
    }

    .card span,
    .card small {
      color: #5d7f75;
    }

    .card strong {
      font-size: 2rem;
      color: #132f2d;
    }

    @media (max-width: 760px) {
      .dashboard {
        grid-template-columns: 1fr;
      }

      .sidebar {
        border-right: none;
        border-bottom: 1px solid #e6f1ec;
      }

      .cards {
        grid-template-columns: 1fr;
      }

      .topbar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class AdminDashboardComponent {}
