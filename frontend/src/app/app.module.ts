import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: 'WINDOW' , useFactory : getWindow}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getWindow(){
  return (typeof window !== "undefined") ? window : null;
}