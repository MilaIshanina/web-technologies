import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {Router, RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { BrokersComponent } from './brokers/brokers.component';
import { StoksComponent } from './stoks/stoks.component';
import { SettingsComponent } from './settings/settings.component';


const appRoutes: Routes = [
  {path: 'brokers', component: BrokersComponent},
  {path: 'stoks', component: StoksComponent},
  {path: 'setting', component: SettingsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    BrokersComponent,
    StoksComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
