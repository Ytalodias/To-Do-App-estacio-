import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosPage } from './todos.page';

const routes: Routes = [
  { path: '', component: TodosPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodosPageRoutingModule {}
