import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrashComponent } from './trash/trash.component';
import { TodoComponent } from './todo/todo.component';
import { InboxComponent } from './inbox/inbox.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  {path:'trash',component:TrashComponent},
  {path:'todo',component:TodoComponent},
  {path:'inbox',component:InboxComponent},  
  {path:'calendar',component:CalendarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AngularRoutingModule { }
