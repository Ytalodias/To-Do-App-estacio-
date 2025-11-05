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
  targetDate?: string; // nova propriedade
}



//Adicionar Tarefa
@Component({
  selector: 'app-add-todo-modal',
  standalone: true,
  imports: [IonicModule, FormsModule],
  template: `
<ion-content class="modal-content">
  <ion-button class="close-button" fill="clear" (click)="dismiss()">✕</ion-button>

  <div class="modal-wrapper">
    <h1>Nova Tarefa</h1>

    <div class="input-container">
      <input type="text" [(ngModel)]="title" placeholder="Digite o título" class="input-field">
    </div>

    <div class="input-container">
      <input type="text" [(ngModel)]="description" placeholder="Digite a descrição" class="input-field">
    </div>

    <div class="input-container">
      <ion-datetime
        display-format="DD/MM/YYYY"
        placeholder="Data alvo"
        [(ngModel)]="targetDate"
        class="input-field">
      </ion-datetime>
    </div>

    <ion-button expand="block" class="save-button" (click)="add()">Adicionar</ion-button>
  </div>
</ion-content>
  `,
  styles: [`
/* ===== CONTEÚDO DO MODAL ===== */
ion-content.modal-content {
  --background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.6rem;
  color: #334A80;
  z-index: 10;
}

.modal-wrapper {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

h1 {
  text-align: center;
  color: #334A80;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.input-container { width: 100%; }

.input-field, ion-datetime {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #000;
  border-radius: 8px;
  background-color: #fff;
  color: #000;
}

.input-field::placeholder { color: #000; opacity: 0.7; }

.save-button {
  --background: #334A80;
  --color: #fff;
  font-weight: 600;
  --border-radius: 8px;
  margin-top: 1.5rem;
  width: 100%;
}

/* ===== DARK MODE ===== */
:host-context(.dark) ion-content.modal-content {
  --background: #1E1E1E;
}

:host-context(.dark) .modal-wrapper {
  background: #2C2C2C;
  box-shadow: 0 6px 20px rgba(0,0,0,0.6);
}

:host-context(.dark) h1 {
  color: #BB86FC;
}

:host-context(.dark) .input-field, 
:host-context(.dark) ion-datetime {
  background-color: #3A3A3A;
  color: #ffffff;
  border: 1px solid #555;
}

:host-context(.dark) .input-field::placeholder {
  color: #BBBBBB;
}

:host-context(.dark) .save-button {
  --background: #BB86FC;
  --color: #121212;
}
  `]
})
export class AddTodoModal {
  title = '';
  description = '';
  targetDate?: string;

  constructor(private modalCtrl: ModalController) {}

  dismiss() { this.modalCtrl.dismiss(); }

  add() {
    if (!this.title.trim()) { alert('Título é obrigatório!'); return; }

    let formattedDate: string | null = null;
    if (this.targetDate) {
      try { formattedDate = new Date(this.targetDate).toISOString().split('T')[0]; }
      catch { formattedDate = null; }
    }

    this.modalCtrl.dismiss({ title: this.title, description: this.description, targetDate: formattedDate });
  }
}



// Editar Tarefa com dark mode
@Component({
  selector: 'app-edit-todo-modal',
  standalone: true,
  imports: [IonicModule, FormsModule],
  template: `
<ion-content class="modal-content">
  <ion-button class="close-button" fill="clear" (click)="dismiss()">✕</ion-button>

  <div class="modal-wrapper">
    <h1>Editar Tarefa</h1>

    <div class="input-container">
      <input type="text" [(ngModel)]="title" placeholder="Digite o título" class="input-field">
    </div>

    <div class="input-container">
      <input type="text" [(ngModel)]="description" placeholder="Digite a descrição" class="input-field">
    </div>

    <div class="input-container">
      <ion-datetime
        display-format="DD/MM/YYYY"
        placeholder="Data alvo"
        [(ngModel)]="targetDate"
        class="input-field">
      </ion-datetime>
    </div>

    <ion-button expand="block" class="save-button" (click)="save()">Salvar</ion-button>
  </div>
</ion-content>
  `,
styles: [`
/* ===== CONTEÚDO DO MODAL ===== */
ion-content.modal-content {
  --background: #121212; /* Dark mode como padrão */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  transition: background 0.3s ease;
}

/* ===== BOTÃO FECHAR ===== */
.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.6rem;
  color: #BB86FC;
  z-index: 10;
  background: transparent;
}

/* ===== CONTAINER DO MODAL ===== */
.modal-wrapper {
  width: 100%;
  max-width: 400px;
  background: #1E1E1E;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* ===== TÍTULO ===== */
h1 {
  text-align: center;
  color: #BB86FC;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* ===== INPUTS ===== */
.input-container {
  width: 100%;
}

.input-field, ion-datetime {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  border: 1px solid #555;
  border-radius: 8px;
  background-color: #2A2A2A;
  color: #FFF;
  outline: none;
  transition: border 0.3s ease, background 0.3s ease;
}

.input-field:focus, ion-datetime:focus {
  border-color: #BB86FC;
  background-color: #333;
}

.input-field::placeholder {
  color: #BBBBBB;
}

/* ===== BOTÃO SALVAR ===== */
.save-button {
  --background: #BB86FC;
  --color: #121212;
  font-weight: 600;
  --border-radius: 8px;
  margin-top: 1.5rem;
  width: 100%;
  transition: 0.3s ease;
}

.save-button:hover {
  filter: brightness(1.1);
}

/* ===== RESPONSIVO ===== */
@media (max-width: 480px) {
  .modal-wrapper {
    width: 95%;
    padding: 1.5rem;
  }
  h1 {
    font-size: 1.5rem;
  }
}

/* ===== LIGHT MODE ===== */
:host-context(.light) ion-content.modal-content {
  --background: #F5F5F5;
}

:host-context(.light) .modal-wrapper {
  background: #FFFFFF;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

:host-context(.light) h1 {
  color: #334A80;
}

:host-context(.light) .input-field,
:host-context(.light) ion-datetime {
  background-color: #FFFFFF;
  color: #000;
  border: 1px solid #CCC;
}

:host-context(.light) .input-field::placeholder {
  color: #555;
}

:host-context(.light) .save-button {
  --background: #334A80;
  --color: #FFF;
}
`]

})
export class EditTodoModal implements OnInit {
  @Input() todo!: Todo;
  title = '';
  description = '';
  targetDate?: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.todo) {
      this.title = this.todo.title;
      this.description = this.todo.description;
      this.targetDate = this.todo.targetDate;
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

    let formattedDate: string | null = null;
    if (this.targetDate) {
      try {
        formattedDate = new Date(this.targetDate).toISOString().split('T')[0];
      } catch {
        formattedDate = null;
      }
    }

    this.modalCtrl.dismiss({
      title: this.title,
      description: this.description,
      targetDate: formattedDate
    });
  }
}



//Pagina de Detalhes

@Component({
  selector: 'app-todo-details-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
<ion-content class="modal-content">

  <!-- Botão de voltar manual -->
  <ion-button class="back-button" fill="clear" (click)="dismiss()">
    ←
  </ion-button>

 
  <div class="todo-card">
    <h2>{{todo.title}}</h2>
    <p>{{todo.description}}</p>
    <p *ngIf="todo.targetDate" class="target-date">
      Meta: {{todo.targetDate}} ({{calculateCountdown(todo.targetDate!)}})
    </p>
  </div>

  <div class="button-group">
      <ion-button class="editar" (click)="edit()">Editar</ion-button>
      <ion-button color="danger" (click)="remove()">Excluir</ion-button>
    </div>
</ion-content>
  `,
  styles: [`
.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  background: #ffffff; /* CORRETO */
  min-height: 100%;
  position: relative;
}


/* ===== DARK MODE ===== */
:host-context(.dark) ion-content.modal-content {
  --background: #121212;
  --ion-background-color: #121212;
}

.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 1.5rem;
  color: #414D64;
  --padding-start: 0;
  --padding-end: 0;
  --border-radius: 12px;
}

.todo-card {
  background: #EBEBEB;
  padding: 1.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top:120px;
  margin-left:40px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #363636;
  margin: 0;
  word-wrap: break-word;
}

p {
  font-size: 1rem;
  color: #4b5563;
  margin: 0;
  word-wrap: break-word;
}

.target-date {
  font-weight: 600;
  color: #252829ff;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto; /* empurra os botões para baixo */
  height:30px;
  width:300px;
  margin-top:30px;
  margin-left:40px;
  border:none;
}

.button-group ion-button {
  flex: 1;
  --border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button-group ion-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* Responsividade */
@media (max-width: 480px) {
  .todo-card {
    padding: 1rem;
  }
  h2 {
    font-size: 1.3rem;
  }
  p {
    font-size: 0.95rem;
  }
  .button-group {
    flex-direction: column;
  }
  .button-group ion-button {
    width: 100%;
  }
}
  `]
})
export class TodoDetailsModal {
  @Input() todo!: Todo;

  constructor(private modalCtrl: ModalController) {}

  dismiss(data?: any) { this.modalCtrl.dismiss(data); }

  edit() { this.modalCtrl.dismiss({ action: 'edit', todo: this.todo }); }

  remove() { 
    if(confirm('Deseja realmente excluir esta tarefa?')) 
      this.modalCtrl.dismiss({ action: 'delete', todo: this.todo }); 
  }

  calculateCountdown(targetDate?: string): string {
    if (!targetDate) return '';
    
    const parts = targetDate.split('-');
    const target = new Date(+parts[0], +parts[1]-1, +parts[2]); // Ano, Mês (0-11), Dia
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? 'Vencido' : `${days} dia${days > 1 ? 's' : ''}`;
  }
}

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="end">
      <ion-button (click)="goToSettings()">
        <ion-icon slot="icon-only" name="settings-sharp" class="settings-icon"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="lembretes-content">
  <!-- Título principal -->
  <h1 class="lembretes-titulo-principal">Lembretes</h1>

  <div class="lembretes-container">
    <div class="lembrete-card" *ngFor="let todo of todos" (click)="openDetails(todo)">
      <div class="lembrete-header">
        <div class="lembrete-titulo">{{todo.title}}</div>
        <div *ngIf="todo.targetDate" class="lembrete-meta">
          {{ calculateCountdown(todo.targetDate) }}
        </div>
      </div>
    </div>
  </div>

  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button color="primary" (click)="openAddModal()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</ion-content>
  `,
  styles: [`
/* Conteúdo da página */
.lembretes-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  padding-top: 1rem;
  background: #F5F5F7;
  flex-direction: column;
  padding-bottom: 4rem; /* espaço para fab */
}

ion-header, ion-toolbar {
  --background: #FFFFFF;
  --border-width: 0;
  --border-color: transparent;
  box-shadow: none;
}

/* Ícone de configurações */
.settings-icon {
  color: #414D64;
  font-size: 1.6rem;
}

/* Título principal */
.lembretes-titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  color: #334A80;
  text-align: center;
  margin: 1.5rem 0 2rem;
}

/* Container de cards */
.lembretes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Cards individuais */
.lembrete-card {
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 5px;
  width: 320px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top:30px;
}

.lembrete-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);
}

/* Header do card */
.lembrete-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Título do lembrete */
.lembrete-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #334A80;
  word-break: break-word;
}

/* Contagem de dias */
.lembrete-meta {
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  color: #334A80;
}

/* FAB botão */
ion-fab-button {
  --border-radius: 50%;
  margin-bottom: 80px;
  margin-right: 30px;
}

/* Responsividade */
@media(max-width:480px){
  .lembrete-card {
    width: 90%;
    padding: 1rem;
  }
  .lembrete-titulo {
    font-size: 1.3rem;
  }
  .lembrete-meta {
    font-size: 0.9rem;
    padding: 0.15rem 0.5rem;
  }
  .lembretes-titulo-principal {
    font-size: 1.6rem;
    margin: 1rem 0;
  }
}

/* ===== DARK MODE ===== */
:host-context(.dark) ion-content.lembretes-content {
  --background: #121212;
  background: #121212;
}

:host-context(.dark) ion-header, 
:host-context(.dark) ion-toolbar {
  --background: #121212;
}

:host-context(.dark) .lembrete-card {
  background: #1E1E1E;
  box-shadow: 0 8px 20px rgba(0,0,0,0.5);
}

:host-context(.dark) .lembretes-titulo-principal,
:host-context(.dark) .lembrete-titulo,
:host-context(.dark) .lembrete-meta,
:host-context(.dark) .settings-icon {
  color: #E0E0E0;
}
  `]
})

export class TodosPage implements OnInit {
  todos: Todo[] = [];
  API_URL = ''; // URL base da API

constructor(
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    this.API_URL = 'https://todolist-backend-4ya9.onrender.com/api';
  }


ngOnInit(): void {
  this.loadTodos();

  // Aplica dark mode se estava ativo
  const darkMode = localStorage.getItem('darkMode') === 'true';
document.body.classList.toggle('dark', darkMode);


  // Atualiza dark mode se mudar nas configurações enquanto estiver na página
window.addEventListener('storage', () => {
  const dark = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark', dark);
});

  // Reabrir modal caso algum estivesse aberto
  setTimeout(() => {
    const openModal = localStorage.getItem('openModal');
    if (!openModal) return;

    if (openModal === 'add') {
      this.openAddModal();
    } else if (openModal.startsWith('edit-')) {
      const id = parseInt(openModal.split('-')[1], 10);
      const todo = this.todos.find(t => t.id === id);
      if (todo) this.openEditModal(todo);
    } else if (openModal.startsWith('details-')) {
      const id = parseInt(openModal.split('-')[1], 10);
      const todo = this.todos.find(t => t.id === id);
      if (todo) this.openDetails(todo);
    }
  }, 500);
}

  private getAuthHeaders(): { headers: HttpHeaders } | null {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado!');
      this.router.navigate(['/login']);
      return null;
    }
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  private logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

loadTodos(): void {
  const headers = this.getAuthHeaders();
  if (!headers) return;

  this.http.get<any[]>(`${this.API_URL}/todos`, headers).subscribe({
    next: res => {
      console.log('TODOS RECEBIDOS DO BACKEND:', res);

      // Mapear target_date → targetDate e remover horário (opcional)
      this.todos = res.map(todo => ({
        ...todo,
        targetDate: todo.target_date ? todo.target_date.split('T')[0] : undefined
      }));
    },
    error: err => {
      if ([401, 403].includes(err.status)) {
        alert('Token inválido ou expirado. Faça login novamente.');
        this.logout();
      } else {
        alert(err.error?.message || 'Erro ao carregar tarefas');
      }
    }
  });
}


  addTodo(title: string, description: string, targetDate?: string): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.post(`${this.API_URL}/todos`, { title, description, targetDate }, headers)
      .subscribe({
        next: () => this.loadTodos(),
        error: err => alert(err.error?.message || 'Erro ao adicionar tarefa')
      });
  }

  updateTodo(id: number, title: string, description: string, targetDate?: string): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.put(`${this.API_URL}/todos/${id}`, { title, description, targetDate }, headers)
      .subscribe({
        next: () => this.loadTodos(),
        error: err => alert(err.error?.message || 'Erro ao atualizar tarefa')
      });
  }

  deleteTodo(id: number): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.delete(`${this.API_URL}/todos/${id}`, headers)
      .subscribe({
        next: () => this.loadTodos(),
        error: err => alert(err.error?.message || 'Erro ao excluir tarefa')
      });
  }

calculateCountdown(targetDate?: string): string {
  if (!targetDate) return '';
  
  // targetDate = 'YYYY-MM-DD'
  const parts = targetDate.split('-');
  const target = new Date(+parts[0], +parts[1]-1, +parts[2]); // Ano, Mês (0-11), Dia
  
  const today = new Date();
  // Zerar horas para contar apenas dias
  today.setHours(0,0,0,0);
  
  const diff = target.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days < 0 ? 'Vencido' : `${days} dia${days > 1 ? 's' : ''}`;
}

// ===== Métodos de modais =====
async openAddModal() {
  localStorage.setItem('openModal', 'add');

  const modal = await this.modalCtrl.create({
    component: AddTodoModal,
    cssClass: document.body.classList.contains('dark') ? 'dark' : ''
  });

  await modal.present();
  const { data } = await modal.onWillDismiss();
  localStorage.removeItem('openModal');
  if (data) this.addTodo(data.title, data.description, data.targetDate);
}

async openEditModal(todo: Todo) {
  localStorage.setItem('openModal', `edit-${todo.id}`);

  const modal = await this.modalCtrl.create({
    component: EditTodoModal,
    componentProps: { todo },
    cssClass: document.body.classList.contains('dark') ? 'dark' : ''
  });

  await modal.present();
  const { data } = await modal.onWillDismiss();
  localStorage.removeItem('openModal');
  if (data) this.updateTodo(todo.id, data.title, data.description, data.targetDate);
}

async openDetails(todo: Todo) {
  localStorage.setItem('openModal', `details-${todo.id}`);

  const modal = await this.modalCtrl.create({
    component: TodoDetailsModal,
    componentProps: { todo },
    cssClass: document.body.classList.contains('dark') ? 'dark' : ''
  });

  await modal.present();
  const { data } = await modal.onWillDismiss();
  localStorage.removeItem('openModal');
  if (!data) return;
  if (data.action === 'edit') this.openEditModal(data.todo);
  if (data.action === 'delete') this.deleteTodo(data.todo.id);
}

// ===== Navegação para Configurações =====
goToSettings(): void {
  this.router.navigate(['/settings']);
}
}