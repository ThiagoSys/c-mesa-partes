import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormulariosModule } from './formularios/formularios.module';
import { ButtonModule } from 'primeng/button';
import { PrimeNgModule } from './prime-ng/prime-ng.module';

// import { BsStepperModule } from 'bs-stepper';
// import { StepperModule } from 'bs-stepper/dist/bs-stepper.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,

    FormulariosModule,
    
  ],
  // providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
