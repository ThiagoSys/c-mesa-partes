import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormulariosRoutingModule } from './formularios-routing.module';
import { FormularioComponent } from './components/formulario/formulario.component';
import { InicioComponent } from './pages/inicio/inicio.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { MatInputModule } from "@angular/material/input";
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { ExpedienteComponent } from './pages/expediente/expediente.component';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { MenuComponent } from './pages/menu/menu.component';

import { VideoplayerComponent} from './pages/videoplayer/videoplayer.component'

// import { BsStepperModule } from 'bs-stepper';
// import { StepperModule } from 'bs-stepper/dist/bs-stepper.module';

import { NgxCaptchaModule } from 'ngx-captcha';



@NgModule({
  declarations: [
    FormularioComponent,
    InicioComponent,
    ExpedienteComponent,
    ConsultaComponent,
    MenuComponent,
    VideoplayerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormulariosRoutingModule,
    ReactiveFormsModule,
    //MatInputModule,

    // Material Angular
    MatTooltipModule,
    MatButtonModule,
    MatStepperModule,

    // RecaptchaModule,
    NgxCaptchaModule
  ],
  // providers :[{
  //   provide:RECAPTCHA_SETTINGS,
  //   useValue:{ siteKey: 'TU_CLAVE_DEL_SITIO' } as RecaptchaSettings,
  // }]
})
export class FormulariosModule { }
