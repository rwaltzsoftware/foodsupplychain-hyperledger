import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'angular5-data-table';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  // {path:'',redirectTo:'user',pathMatch:'full'},
  {path:'',component:DashboardComponent}
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    NgxSpinnerModule
  ],
  declarations: [DashboardComponent]
})
export class AdminModule { }
