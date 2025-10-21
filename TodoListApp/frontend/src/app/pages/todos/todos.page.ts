import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Todo {
  id: number;
  title: string;
  description: string;
}

// ==================== MODAL ADICIONAR ====================
@Component({
  selector: 'app-add-todo-modal',
  standalone: true,
  imports: [IonicModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Nova Tarefa</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input [(ngModel)]="title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Descrição</ion-label>
        <ion-input [(ngModel)]="description"></ion-input>
      </ion-item>
      <ion-button expand="full" (click)="add()">Adicionar</ion-button>
    </ion-content>
  `
})
export class AddTodoModal {
  title = '';
  description = '';

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  add() {
    if (!this.title.trim()) {
      alert('Título é obrigatório!');
      return;
    }
    this.modalCtrl.dismiss({ title: this.title, description: this.description });
  }
}

// ==================== MODAL EDITAR ====================
@Component({
  selector: 'app-edit-todo-modal',
  standalone: true,
  imports: [IonicModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Tarefa</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input [(ngModel)]="title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Descrição</ion-label>
        <ion-input [(ngModel)]="description"></ion-input>
      </ion-item>
      <ion-button expand="full" (click)="save()">Salvar</ion-button>
    </ion-content>
  `
})
export class EditTodoModal implements OnInit {
  @Input() todo!: Todo;
  title = '';
  description = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.todo) {
      this.title = this.todo.title;
      this.description = this.todo.description;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.title.trim()) {
      alert('Título é obrigatório!');
      return;
    }
    this.modalCtrl.dismiss({ title: this.title, description: this.description });
  }
}

// ==================== PAGINA PRINCIPAL ====================
@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>ToDo List</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openAddModal()">
            <ion-icon slot="icon-only" name="add-circle-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="todos-content">
      <ion-list>
        <ion-item *ngFor="let todo of todos" class="todo-item">
          <ion-label>
            <h2>{{ todo.title }}</h2>
            <p>{{ todo.description }}</p>
          </ion-label>
          <div class="todo-buttons">
            <ion-button fill="outline" color="primary" (click)="openEditModal(todo)">Editar</ion-button>
            <ion-button fill="outline" color="danger" (click)="deleteTodo(todo.id)">Excluir</ion-button>
          </div>
        </ion-item>
      </ion-list>

      <ion-button expand="full" color="medium" (click)="logout()">Sair</ion-button>
    </ion-content>
  `,
  styles: [`
    .todos-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      height: 100%;
      overflow-y: auto;
      background: linear-gradient(to bottom, #e0eafc, #cfdef3);
    }
    ion-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .todo-item {

      border-radius: 15px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .todo-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(0,0,0,0.12);
    }
    .todo-item h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: #1a237e;
    }
    .todo-item p {
      font-size: 0.95rem;
      color: #555;
      margin: 0;
    }
    .todo-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    .todo-buttons ion-button {
      flex: 1;
      font-weight: 600;
      border-radius: 12px;
    }
    ion-button[expand="full"] {
      margin-top: 1rem;
      font-weight: 700;
      --border-radius: 12px;
      --background: #ff6f61;
      --background-activated: #e65c50;
      color: #fff;
    }
    @media (max-width: 480px) {
      .todo-item h2 { font-size: 1rem; }
      .todo-item p { font-size: 0.85rem; }
      .todo-buttons ion-button { font-size: 0.85rem; }
    }
  `]
})
export class TodosPage implements OnInit {
  todos: Todo[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() { this.loadTodos(); }

  private getAuthHeaders(): { headers: HttpHeaders } | null {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado!');
      this.router.navigate(['/login']);
      return null;
    }
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  loadTodos() {
    const headers = this.getAuthHeaders();
    if (!headers) return;
    this.http.get<Todo[]>('http://localhost:5000/api/todos', headers)
      .subscribe({
        next: res => this.todos = res,
        error: err => {
          if ([401,403].includes(err.status)) { alert('Token inválido ou expirado. Faça login novamente.'); this.logout(); }
          else { alert(err.error?.message || 'Erro ao carregar tarefas'); }
        }
      });
  }

  async openAddModal() {
    const modal = await this.modalCtrl.create({ component: AddTodoModal });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) this.addTodo(data.title, data.description);
  }

  async openEditModal(todo: Todo) {
    const modal = await this.modalCtrl.create({ component: EditTodoModal, componentProps: { todo } });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) this.updateTodo(todo.id, data.title, data.description);
  }

  addTodo(title: string, description: string) {
    const headers = this.getAuthHeaders();
    if (!headers) return;
    this.http.post('http://localhost:5000/api/todos', { title, description }, headers)
      .subscribe({ next: () => this.loadTodos(), error: err => alert(err.error?.message || 'Erro ao adicionar tarefa') });
  }

  updateTodo(id: number, title: string, description: string) {
    const headers = this.getAuthHeaders();
    if (!headers) return;
    this.http.put(`http://localhost:5000/api/todos/${id}`, { title, description }, headers)
      .subscribe({ next: () => this.loadTodos(), error: err => alert(err.error?.message || 'Erro ao atualizar tarefa') });
  }

  deleteTodo(id: number) {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;
    const headers = this.getAuthHeaders();
    if (!headers) return;
    this.http.delete(`http://localhost:5000/api/todos/${id}`, headers)
      .subscribe({ next: () => this.loadTodos(), error: err => alert(err.error?.message || 'Erro ao excluir tarefa') });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
