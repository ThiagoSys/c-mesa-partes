import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';

import { MessageService } from '../../services/message.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { SoaptramiteService } from '../../services/soaptramite.service';
import { Router } from '@angular/router';

declare var bootstrap: any; // Suponiendo que Bootstrap está disponible globalmente

interface propsExpdiente {
  ID_DOCUMENTO: String,
  tipo_documento: String,
  NRO_DOCUMENTO: String,
  ID_REMITENTE: String,
  REMITENTE: String,
  FEC_RECEPCION: Date,
  ASUNTO: String,
  EXPEDIENTE: String,
  AVANCES: String,
  ID_CORRELATIVO: String,
  ID_DESDE: String,
  DESDE: String,
  ID_HACIA: String,
  HACIA: String,
  TIPO: String,
  ID_ESTADO: String,
  ESTADO: String,
  FEC_DERIVACION: Date,
  DOCUMENTO_ADJUNTADO: String,
  OBSERVACIONES_AL_ENVIAR: String,
  FEC_ENVIO: Date,
  FEC_RECIBIDO: Date,
  FEC_ARCHIVO: Date,
  OBSERVACIONES_AL_ARCHIVAR: String,
  UBICACION_ARCHIVO: String,
}

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit  {

  @ViewChild('toastTrigger') toastTrigger!: ElementRef;
  // public robot:boolean=true;

  public getWidth:any;
  public getHeight:any;

  public loading: boolean = false;

  // Metodos del captcha, revisar los parametros si se borran o se agrega el captcha 
  @ViewChild('captchaElem') captchaElem!: ReCaptcha2Component;
  @ViewChild('langInput') langInput!: ElementRef;
  public recaptchaSiteKey: string = '6LdxFMgnAAAAADUqMRQQ-Zzg3cMDH1PC70R3r7ou';
  public captchaIsLoad = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string; 
  public theme: 'light'|'dark'='light';
  public size: 'compact'|'normal'='normal';
  public lang = 'en';
  public type: 'image'|'audio'='image'; 

  // Seleccion combox año 
  public selectTipoYear: any = [];
  public listExpediente: propsExpdiente[]=[];

  // Valiadaciones 
  public errorLength: any = null; // Veridifica si se cumple la cantidad de caracteres tiene el expediente


  // Form Group 
  public formGroupConsul: FormGroup;
  public formGroupCaptcha!: FormGroup;

  // TODO Form Search
  public year: FormControl = new FormControl('', Validators.required);
  public nroExpediente: FormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  public claveWeb: FormControl = new FormControl('', Validators.required);

  // TODO Form Captcha
  public recaptcha: FormControl = new FormControl('', Validators.required);

  constructor(
    private router : Router,
    public fb: FormBuilder,
    private messageService: MessageService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private soapTramite: SoaptramiteService,
  ){
    this.formGroupConsul = this.fb.group({
      year:this.year,
      nroExpediente:this.nroExpediente,
      claveWeb: this.claveWeb,
    });

  }

  ngOnInit() {
    this.formGroupCaptcha = this.fb.group({
      recaptcha: this.recaptcha
    });

    this.getWidth = window.innerWidth
    this.getHeight = window.innerHeight

    const fechaInicial = new Date('2010-01-01'); // Cambia esta fecha a la fecha deseada
    const _list = this.obtenerListaDeAnios(fechaInicial);
    this.selectTipoYear =  _list;
  }

  obtenerListaDeAnios(desdeFecha:Date) {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const listaDeAnios = [];

    let fecha = new Date(desdeFecha);

    while (fecha.getFullYear() <= anioActual) {
      const _listYear = {
        id:this.obtenerTresUltimosDigitos(fecha.getFullYear()),
        year:fecha.getFullYear(),
      }
      listaDeAnios.push(_listYear);
      fecha.setFullYear(fecha.getFullYear() + 1);
    }
    return listaDeAnios;
  }

  obtenerTresUltimosDigitos(numero:number) {
    const ultimosTresDigitos = (numero % 1000).toString();
    return ultimosTresDigitos.slice(-3);
  }

  tipoYear(e:any){
    // console.log(e)
  }

  clicCap(e:any){
    // console.log('REdddd',e)
  }
  
  handleReady(){

  }
  handleReset(){

  }
  handleExpire(){

  }

  handleLoad(){

  }

  handleSuccess(data:any){
    // console.log(data)
  }


  onRecaptchaResolved(response: string): void {
    // Aquí puedes manejar la respuesta del reCAPTCHA
    // console.log('Recaptcha resolved:', response);
  }

  buscarExp(val:any){
    this.loading=true;
    this.consularExpediente(val)

  }

  consularExpediente(exp:any){
    const _expdiente = {
      nroexp:exp.nroExpediente,
      anio:exp.year,
      claveweb:exp.claveWeb,
    }

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toasExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));
    this.soapTramite.apiConsultarExp(_expdiente).subscribe((resp:any)=>{
      if(resp.ok){
        this.listExpediente = resp.data;
        this.loading=false;
        toasExito.show();
      } else {
        this.loading=false;
        this.listExpediente = [];
        toastError.show();
      }
    })
  }

  changeExp(event:any){
    if(event.length>0&&event.length<6){
      const error = this.formGroupConsul.get('nroExpediente')?.errors
        this.errorLength = {
          _lengthMin:( error!==undefined)&&(error!==null&&(error['minlength']?.actualLength))
        }
    }else{
      if(event.length>6){
        const error = this.formGroupConsul.get('nroExpediente')?.errors
        this.errorLength = {
          _lengthMin:( error!==undefined)&&(error!==null&&(error['maxlength']?.actualLength))
        }
      }else{
        this.errorLength = null
      }
    }
  }

  inputClaveWeb(event:any){
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.toUpperCase();
    this.formGroupConsul.get('claveWeb')?.setValue(newValue, { emitEvent: false });
  }

  helpExp(){
    this.openModal();
  }

  // TODO AQUI MODAL OPEN Y CLOSE

  openModal() {
    var _modal:HTMLInputElement = (<HTMLInputElement>document.getElementById('myModal'));
    if(_modal!=null){ _modal.style.display = 'block' }
  }
  closeModal(){
    var _modal:HTMLInputElement = (<HTMLInputElement>document.getElementById('myModal'));
    if(_modal!=null){ _modal.style.display = 'none' }
  }

  btn1(){
    // console.log(this.formGroupConsul)
  }

  backBtn(){
    this.router.navigate([''])
  }
  // TODO METODO QUE RETORNA LA FECHA EXAMPLE 23-04-2023
  getFecha(_date:Date):String{
    const _fecha = new Date(_date);
    const _year = _fecha.getFullYear() // Año
    const _month = _fecha.getMonth() // Mes
    const _dayMonth = _fecha.getDate() // Dia del mes
    const _day = _fecha.getDay() // Dia de semana

    let _diaSemanaLetra:String
    let _diaMesNum:String
    let _mesLetra:String
    let _mesNum:String

    switch(_dayMonth.toString().length){
      case 1: _diaMesNum=`0${_dayMonth}`; break;
      case 2: _diaMesNum=`${_dayMonth}`; break;
      default: _diaMesNum=''
    }

    switch(_day){
      case 0: _diaSemanaLetra='Domingo'; break;
      case 1: _diaSemanaLetra='Martes'; break;
      case 2: _diaSemanaLetra='Martes'; break;
      case 3: _diaSemanaLetra='Miercoles'; break;
      case 4: _diaSemanaLetra='Jueves'; break;
      case 5: _diaSemanaLetra='Viernes'; break;
      case 6: _diaSemanaLetra='Sabado'; break;
      default: _diaSemanaLetra=''
    }

    switch(_month){
      case 0: _mesLetra='Enero';_mesNum='01'; break;
      case 1: _mesLetra='Febrero';_mesNum='02'; break;
      case 2: _mesLetra='Marzo';_mesNum='03'; break;
      case 3: _mesLetra='Abril';_mesNum='04'; break;
      case 4: _mesLetra='Mayo';_mesNum='05'; break;
      case 5: _mesLetra='Junio';_mesNum='06'; break;
      case 6: _mesLetra='Julio';_mesNum='07'; break;
      case 7: _mesLetra='Agosto';_mesNum='08'; break;
      case 8: _mesLetra='Setiembre';_mesNum='09'; break;
      case 9: _mesLetra='Octubre';_mesNum='10'; break;
      case 10: _mesLetra='Noviembre';_mesNum='11'; break;
      case 11: _mesLetra='Diciembre';_mesNum='12'; break;
      default: _mesLetra='';_mesNum=''
    }

    return `${_diaMesNum}/${_mesNum}/${_year}`
  }

  // TODO METODO DE DIAS EN LA OFICINA FECHA1 FECHA2
  getNroDias(fecha1:Date, fecha2:Date){
    let _fecha1 = new Date(fecha1);
    let _fecha2 = new Date(fecha2);
    let diferencia = _fecha2.getTime() - _fecha1.getTime();
    let diasDeDiferencia = Math.round(diferencia / 1000 / 60 / 60 / 24);
    return `${diasDeDiferencia}`
  }




    @HostListener('window:resize', ['$event'])
    onWindowsResize(){
      this.getWidth=window.innerWidth
      this.getHeight=window.innerHeight
    }

}
