import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';





interface Todo {
  id: number;
  title: string;
  description: string;
  targetDate?: string; // nova propriedade
}



// ===== Adicionar Tarefa =====
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
      <input
        type="text"
        [(ngModel)]="title"
        placeholder="Digite o título"
        class="input-field"
      />
    </div>

    <div class="input-container">
      <input
        type="text"
        [(ngModel)]="description"
        placeholder="Digite a descrição"
        class="input-field"
      />
    </div>

    <div class="input-container">
      <ion-datetime
        presentation="date-time"
        [(ngModel)]="targetDate"
        placeholder="Selecione data e hora"
        class="input-field"
        display-timezone="offset"
        value-format="YYYY-MM-DDTHH:mm:ss">
      </ion-datetime>
    </div>

    <ion-button expand="block" class="save-button" (click)="add()">
      Adicionar
    </ion-button>
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
  // Valor padrão: data/hora atual completa até segundos
  targetDate = new Date().toISOString().slice(0, 19);

  constructor(private modalCtrl: ModalController) {}

  add() {
    if (!this.title.trim()) {
      alert('Título é obrigatório!');
      return;
    }

    if (!this.targetDate) {
      alert('Data e hora são obrigatórias!');
      return;
    }

    // Converte para 'YYYY-MM-DD HH:MM:SS' no horário local
    const dt = new Date(this.targetDate);
    const formatted = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}:${String(dt.getSeconds()).padStart(2,'0')}`;

    this.modalCtrl.dismiss({
      title: this.title,
      description: this.description,
      targetDate: formatted
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
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
  presentation="date-time"
  [(ngModel)]="targetDate"
  placeholder="Selecione data e hora"
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

    if (!this.targetDate) {
      alert('Data e hora são obrigatórias!');
      return;
    }

    // Converte para 'YYYY-MM-DD HH:MM:SS' no horário local
    const dt = new Date(this.targetDate);
    const formatted = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}:${String(dt.getSeconds()).padStart(2,'0')}`;

    this.modalCtrl.dismiss({
      title: this.title,
      description: this.description,
      targetDate: formatted
    });
  }
}


@Component({
  selector: 'app-todo-details-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
<ion-content class="modal-content">

  <!-- Botão de voltar -->
  <ion-button class="back-button" fill="clear" (click)="dismiss()">
    ←
  </ion-button>

  <div class="todo-card">
    <h2 class="todo-title">{{ todo.title }}</h2>

    <!-- LINHA DE SEPARAÇÃO -->
    <div class="divider"></div>

    <p>{{ todo.description }}</p>

    <!-- DATA COM CONTAINER ESCURO -->
    <div *ngIf="todo.targetDate" class="target-date-container">
      <p class="target-date">
         {{ formatDateDMY(todo.targetDate!) }} ({{ calculateCountdown(todo.targetDate!) }})
      </p>
    </div>

    <!-- BOTÕES -->
    <div class="button-group">
      <ion-button class="editar" (click)="edit()">Editar</ion-button>
      <ion-button color="danger" (click)="remove()">Excluir</ion-button>
    </div>
  </div>

</ion-content>
  `,
  styles: [`
/* ===== CONTAINER GERAL ===== */
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #ffffff;
  min-height: 100vh;
  position: relative;
}

:host-context(.dark) ion-content.modal-content {
  --background: #121212;
  --ion-background-color: #121212;
}

/* ===== BOTÃO VOLTAR ===== */
.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 1.5rem;
  color: #414D64;
  --padding-start: 0;
  --padding-end: 0;
}

/* ===== CARD ===== */
.todo-card {
  background: #EBEBEB;
  padding: 1.7rem;
  border-radius: 18px;
  width: 100%;
  max-width: 330px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.10);
  margin: 90px auto 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== LINHA DE SEPARAÇÃO ===== */
.divider {
  width: 80%;
  height: 1px;
  background: #b7b7b7;
  margin: 0.5rem auto;
  border-radius: 1px;
}

/* ===== TÍTULO ===== */
.todo-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2f2f2f;
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* ===== TEXTO ===== */
p {
  font-size: 1rem;
  color: #212122ff;
  margin: 0;
  word-wrap: break-word;
}

/* ===== DATA COM CONTAINER ESCURO ===== */
.target-date-container {
  background-color: #585757ff;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  margin-top: 2rem;
  display: inline-block;
  color: #ffffff;
}

.target-date-container .target-date {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: inherit;
}

/* ===== BOTÕES ===== */
.button-group {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  max-width: 330px;
  margin: 30px auto 0;
}

.button-group ion-button {
  flex: 1;
  --border-radius: 14px;
  font-weight: 600;
  height: 45px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button-group ion-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 480px) {
  .todo-card {
    max-width: 90%;
    padding: 1.2rem;
  }

  .todo-title {
    font-size: 1.3rem;
  }

  p {
    font-size: 0.95rem;
  }

  .button-group {
    flex-direction: column;
    max-width: 90%;
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

  dismiss(data?: any) { 
    this.modalCtrl.dismiss(data); 
  }

  edit() { 
    this.modalCtrl.dismiss({ action: 'edit', todo: this.todo }); 
  }

  remove() { 
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.modalCtrl.dismiss({ action: 'delete', todo: this.todo }); 
    }
  }

  // ====================== COUNTDOWN ======================
  calculateCountdown(targetDate?: string): string {
    if (!targetDate) return "";

    // Remove timezone automático (+3)
    const parsed = this.parseDateUTC(targetDate);
    if (!parsed) return "Data inválida";

    const target = new Date(parsed.year, parsed.month - 1, parsed.day);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Concluído";
    if (days === 0) return "Hoje";

    return `${days} dia${days > 1 ? "s" : ""}`;
  }

  // ====================== FORMATAR DATA EXIBIDA ======================
  formatDateDMY(dateString: string): string {
    const d = this.parseDateUTC(dateString);
    if (!d) return "Data inválida";

    const dia = d.day.toString().padStart(2, '0');
    const mes = d.month.toString().padStart(2, '0');
    const ano = d.year;

    const h = d.hour.toString().padStart(2, '0');
    const m = d.minute.toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${h}:${m}`;
  }

  // ====================== PARSER SEM CONVERSÃO DE FUSO ======================
  private parseDateUTC(dateString: string) {
    if (!dateString) return null;

    // Formato pode vir com " " ou "T"
    let [datePart, timePart] = dateString.split(/[\sT]/);

    if (!datePart || !timePart) return null;

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    if (!year || !month || !day) return null;

    return { year, month, day, hour, minute };
  }
}

interface Todo {
  id: number;
  title: string;
  description: string;
  targetDate?: string;
}


//pagina Principal
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
  gap: 0.5rem;            /* reduz gap entre cards */
}

/* Cards individuais */
.lembrete-card {
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 5px;
  max-width: 320px;
   width: 90%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top:10px;
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
  width: 100%;
  gap: 0.5rem;
  flex-wrap: nowrap; /* 👈 impede quebra de linha */
}


/* Título do lembrete */
.lembrete-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #334A80;

  /* 👇 aplica o corte de texto com "..." */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 75%; /* evita que colida com a data */
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
  API_URL = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.API_URL = 'https://todolist-backend-4ya9.onrender.com/api';
    } else {
      this.API_URL = `http://${hostname}:5000/api`;
    }
  }

  async ngOnInit(): Promise<void> {
    // ===== PERMISSÃO PARA NOTIFICAÇÕES =====
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted') {
      console.log('✅ Permissão concedida para notificações.');
    } else {
      console.warn('❌ Permissão negada.');
    }

    this.loadTodos();

    // ===== DARK MODE =====
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', darkMode);

    window.addEventListener('storage', () => {
      const dark = localStorage.getItem('darkMode') === 'true';
      document.body.classList.toggle('dark', dark);
    });

    // ===== REABRIR MODAIS =====
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

  // ====================== CARREGAR TODOS ======================
  loadTodos(): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.get<any[]>(`${this.API_URL}/todos`, headers).subscribe({
      next: res => {
        console.log('TODOS RECEBIDOS DO BACKEND:', res);

        this.todos = res.map(todo => ({
          ...todo,
          description: todo.description || '',
          targetDate: todo.targetDate
        }));

        this.todos.forEach(t => this.scheduleNotification(t));
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

  // ====================== ADICIONAR ======================
  addTodo(title: string, description: string, targetDate?: string): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.post(`${this.API_URL}/todos`, { title, description, targetDate }, headers)
      .subscribe({
        next: async (res: any) => {
          console.log('✅ Tarefa adicionada:', res);
          await this.scheduleNotification(res);
          this.loadTodos();
        },
        error: err => {
          console.error('❌ Erro ao adicionar tarefa:', err);
          alert(err.error?.message || 'Erro ao adicionar tarefa');
        }
      });
  }

  // ====================== ATUALIZAR ======================
  updateTodo(id: number, title: string, description: string, targetDate?: string): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.put(`${this.API_URL}/todos/${id}`, { title, description, targetDate }, headers)
      .subscribe({
        next: () => this.loadTodos(),
        error: err => alert(err.error?.message || 'Erro ao atualizar tarefa')
      });
  }

  // ====================== EXCLUIR ======================
  deleteTodo(id: number): void {
    const headers = this.getAuthHeaders();
    if (!headers) return;

    this.http.delete(`${this.API_URL}/todos/${id}`, headers)
      .subscribe({
        next: () => this.loadTodos(),
        error: err => alert(err.error?.message || 'Erro ao excluir tarefa')
      });
  }

  // ====================== COUNTDOWN ======================
  calculateCountdown(targetDate?: string): string {
    if (!targetDate) return '';

    const target = new Date(targetDate);
    const now = new Date();

    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Concluído';
    if (days === 0) return 'Hoje';
    return `${days} dia${days > 1 ? 's' : ''}`;
  }

  // ====================== PARSER UTC ======================
  private parseDateUTC(dateString: string) {
    const match = dateString.match(
      /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\+(\d{2})$/
    );

    if (!match) {
      console.warn('❌ Formato de data inválido:', dateString);
      return null;
    }

    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5])
    };
  }

  // ====================== NOTIFICAÇÃO ======================
async scheduleNotification(todo: any) {
  if (!todo.targetDate) return;

  // O JS já converte automaticamente +00 para horário local
  const localDate = new Date(todo.targetDate);

  // Se estiver no passado → ignora
  if (localDate.getTime() <= Date.now()) {
    console.log("⏩ Ignorando notificação antiga:", localDate);
    return;
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: todo.id,
        title: '📅 Lembrete!',
        body: `${todo.title} - ${todo.description}`,
        schedule: { at: localDate },
        sound: 'default'
      }
    ]
  });

  console.log("🔔 Notificação agendada para:", localDate);
}


  // ====================== MODAIS ======================
  async openAddModal() {
    localStorage.setItem('openModal', 'add');

    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', darkMode);

    const modal = await this.modalCtrl.create({
      component: AddTodoModal,
      cssClass: darkMode ? 'dark' : 'light'
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    localStorage.removeItem('openModal');

    if (data) this.addTodo(data.title, data.description, data.targetDate);
  }

  async openEditModal(todo: Todo) {
    localStorage.setItem('openModal', `edit-${todo.id}`);
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', darkMode);

    const modal = await this.modalCtrl.create({
      component: EditTodoModal,
      componentProps: { todo },
      cssClass: darkMode ? 'dark' : 'light'
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

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
