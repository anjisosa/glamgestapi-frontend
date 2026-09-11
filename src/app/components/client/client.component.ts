import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../../core/application/auth/auth.facade';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  template: `
    <div class="dashboard client-dashboard">
      <aside class="sidebar">
        <div class="brand">Glamgest</div>
        <nav>
          <button class="nav-item active">Inicio</button>
          <button class="nav-item">Reservas</button>
          <button class="nav-item">Servicios</button>
          <button class="nav-item">Perfil</button>
        </nav>
      </aside>

      <main class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">Panel de cliente</p>
            <h1>Bienvenido</h1>
          </div>
          <div class="actions">
            <button class="secondary-btn" type="button" (click)="logout()">Cerrar sesión</button>
            <button class="primary-btn" type="button">Nueva reserva</button>
          </div>
        </header>

        <section class="cards">
          <article class="card accent">
            <span>Próxima cita</span>
            <strong>Viernes 14:00</strong>
            <small>Tratamiento facial</small>
          </article>
          <article class="card">
            <span>Reservas</span>
            <strong>3</strong>
            <small>Este mes</small>
          </article>
          <article class="card">
            <span>Puntos</span>
            <strong>180</strong>
            <small>Club Glamgest</small>
          </article>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fb 0%, #eef5ff 100%);
      font-family: Arial, sans-serif;
      color: #19263d;
    }

    .dashboard {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
    }

    .sidebar {
      background: #ffffff;
      border-right: 1px solid #e8edf7;
      padding: 28px 20px;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2e5bff;
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
      color: #435476;
      font-weight: 600;
      cursor: pointer;
    }

    .nav-item.active {
      background: #edf3ff;
      color: #214ae1;
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

    .actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .eyebrow {
      margin: 0 0 6px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #6b7ea3;
      font-size: 0.72rem;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: 2.2rem;
      color: #18243f;
    }

    .primary-btn,
    .secondary-btn {
      border: none;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-btn {
      background: linear-gradient(135deg, #2f6bff 0%, #6ea0ff 100%);
      color: white;
      box-shadow: 0 8px 18px rgba(47, 107, 255, 0.2);
    }

    .secondary-btn {
      background: #fff;
      color: #d24d5d;
      border: 1px solid #f2ced3;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(180px, 1fr));
      gap: 20px;
    }

    .card {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #edf1fb;
      border-radius: 18px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 10px 25px rgba(17, 27, 48, 0.04);
    }

    .card.accent {
      background: linear-gradient(135deg, #edf4ff 0%, #ffffff 100%);
    }

    .card span,
    .card small {
      color: #697d9b;
    }

    .card strong {
      font-size: 2rem;
      color: #1b2942;
    }

    @media (max-width: 760px) {
      .dashboard {
        grid-template-columns: 1fr;
      }

      .sidebar {
        border-right: none;
        border-bottom: 1px solid #e8edf7;
      }

      .cards {
        grid-template-columns: 1fr;
      }

      .topbar {
        flex-direction: column;
        align-items: flex-start;
      }

      .actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class ClientDashboardComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  logout(): void {
    this.authFacade.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login')
    });
  }
}
