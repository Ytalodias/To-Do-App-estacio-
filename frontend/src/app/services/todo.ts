import { Injectable } from '@angular/core';

export interface Todo {
  id: number;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];

  constructor() {}

  async getTodos(): Promise<Todo[]> {
    return this.todos;
  }

  async addTodo(text: string): Promise<void> {
    const id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1;
    this.todos.push({ id, text });
  }

  async deleteTodo(id: number): Promise<void> {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}
