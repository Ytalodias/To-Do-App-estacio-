import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: any[] = [];

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async getTodos() {
    const saved = await this.storage.get('todos');
    this.todos = saved || [];
    return this.todos;
  }

  async addTodo(text: string) {
    const id = new Date().getTime();
    this.todos.push({ id, text });
    await this.storage.set('todos', this.todos);
  }

  async deleteTodo(id: number) {
    this.todos = this.todos.filter(t => t.id !== id);
    await this.storage.set('todos', this.todos);
  }
}
