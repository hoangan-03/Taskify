import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { InboxComponent } from './inbox/inbox.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DownloadedComponent } from './downloaded/downloaded.component';
const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'downloaded', component: DownloadedComponent },
  { path: '', redirectTo: '/angular/todo', pathMatch: 'full' },
  { path: '**', redirectTo: '/angular/todo' }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AngularRoutingModule { }