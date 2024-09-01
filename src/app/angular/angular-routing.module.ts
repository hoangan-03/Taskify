import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { InboxComponent } from './inbox/inbox.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: '', redirectTo: '/angular/todo', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/angular/todo' }, // Wildcard route for any undefined route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AngularRoutingModule { }