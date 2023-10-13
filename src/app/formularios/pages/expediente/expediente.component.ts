import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { SearchPersonaService } from '../../services/search-persona.service';

// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
// import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DomSanitizer } from '@angular/platform-browser';

import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';
import { SoaptramiteService } from '../../services/soaptramite.service';
import { MessageService } from '../../services/message.service';

// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//import {MatDialog} from '@angular/material/dialog';

// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { StepperOrientation } from '@angular/cdk/stepper';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';

declare var bootstrap: any;


// import BsStepper from 'bs-stepper';

declare var $: any;

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit, AfterViewInit {

  stepperOrientation: Observable<StepperOrientation>;

  // @ViewChild('paternoRef') paternoRef!: ElementRef;


  @ViewChild('stepper', { static: false }) stepper!: ElementRef;
  //bsStepper!: BsStepper;
  // Modal REf

  @ViewChild('myModal') myModal!: ElementRef | undefined;

  // Selelecion para el combo de DOC y OFICIO
  public selectTipoDocCie : any = [];
  public selectTipoOfiCie : any = [];

  // Selelecion de Files
  public fileTmpDocSeleccion : any=[];
  public fileTmpAnexoSeleccion : any=[];

  // datos en el FormDoc
  public fileTmpDoc : any = [];
  public fileTmpAnexo : any = [];

  // Mostrar Seleccion Tipo Documento
  public dni: boolean = false;
  public pasaporte: boolean = false;
  public carnet : boolean = false;
  public razon_social: boolean = false;

  // Activar Desactivar Button Search
  public btnBuscar:boolean=true;
  public btnPersona:boolean=true;
  public btnEmpresa:boolean=true;

  // Activar Desactivar si enviara Anexos
  public radioAnexo:boolean=false;

  // Datos del documento enviado
  public resultDocumento:{
    numeroexpediente:String,
    clave_web:String,
    remitente:String,
    asunto:String,
    fec_recepcion:Date,
    folios:String,
    domicilio:String,
    nroDoc:String,
    tipoDocumento:String,
  }={numeroexpediente:'',clave_web:'',remitente:'',asunto:'',fec_recepcion:new Date(),folios:'',domicilio:'',nroDoc:'',tipoDocumento:''};


  // Carga el loading
  public toastMsgError: string = '';
  public toastMsgOk: string = '';
  public loading: boolean = false;
  public showFormDocumento: boolean = false;
  public getWidth:any;
  public getHeight:any;



  public archivos : any = [];
  public archivos2: any = [];
  public archivos3:any=[];
  public archivos4: any=[];
  public archivos5: any = [];
  public documento: any;

  public imagenFoto : string='';

  public pdfs : any;
  public pdfs2: any;
  //archvos de documentoAdj
  uploadedAnexoFiles: string =''
  uploadedDocumentoFiles!: string 
  
  //Archivos de Anexo1
  uploadedFiles_anexo1!: string 
  uploadedFiles2_anexo1!: string 
  //ARCHIVOS DE ANEXO 2
  uploadedFiles_anexo2!: string 
  uploadedFiles2_anexo2!: string 
  //ARCHIVOS DE ANEXO 3
  uploadedFiles_anexo3!: string 
  uploadedFiles2_anexo3!: string 
  //ARCHIVOS DE ANEXO 4
  uploadedFiles_anexo4!: string 
  uploadedFiles2_anexo4!: string 

  public adj_principal: boolean = true
  public adj_anexo1: boolean = false;
  
  public adj_anexo2: boolean = false;
  public adj_anexo3: boolean = false;
  public adj_anexo4: boolean = false;
  public boton_adj: boolean = false;
  public boton_adj_2 : boolean = false;
  public boton_adj_3 : boolean = false;
  public boton_adj_4 : boolean = false;


  public searchActive : boolean = true;


  // public errorMsg0: string = '(Seleccione un campo)';
  // public errorMsg1: string = '(No puede quedar vacio)';
  // public errorMsg2: string = '(Ingrese correctamente el DNI)';
  // public errorMsg3: string = '(Ingrese correctamente el RUC)';
  // public errorMsg4: string = '(Ingrese correctamente el Carnet de extranjería)';
  // public errorMsg5: string = '(Ingrese correctamente el Pasaporte)';


  public errorMsgTipoPersona: string = '';
  public errorMsgTipoDocumentoP: string = '';
  public errorMsgNroDocumento: string = '';

  public formGroupDoc: FormGroup;
  public formGroupSearch: FormGroup;
  public formGroupPersona: FormGroup;
  public formGroupEmpresa: FormGroup;


  // TODO Form Search
  public tipoPersonaSea: FormControl = new FormControl('', Validators.required);
  public tipoDocumentoP: FormControl = new FormControl('', Validators.required);
  public nroDocumento: FormControl = new FormControl('', [Validators.required]);

  // TODO Form Persona
  // public tipoPersonaPer: FormControl = new FormControl( '',Validators.required);
  public paterno: FormControl = new FormControl('', Validators.required);
  public materno: FormControl = new FormControl('', Validators.required);
  public nombres: FormControl = new FormControl('', Validators.required);
  public telefono: FormControl = new FormControl('', [Validators.required, this.phoneNumberValidator]);
  public correo: FormControl = new FormControl('',  [Validators.required, Validators.email]);
  public direccion: FormControl = new FormControl('', Validators.required);
  public photo: FormControl = new FormControl('', Validators.required);

  // TODO Form Empresa
  // public tipoPersonaEmp: FormControl = new FormControl( '',Validators.required);
  public correoEmp: FormControl = new FormControl('',  [Validators.required, Validators.email]);
  public telefonoEmp: FormControl = new FormControl('', [Validators.required, this.phoneNumberValidator]);
  public departamento: FormControl = new FormControl('', Validators.required);
  public provincia: FormControl = new FormControl('', Validators.required);
  public distrito: FormControl = new FormControl('', Validators.required);
  public razonSocial: FormControl = new FormControl('', Validators.required);
  public domicilioFiscal: FormControl = new FormControl('', Validators.required);
  public tipoContribuyente: FormControl = new FormControl('', Validators.required);

  // TODO Form Documento
  public asunto: FormControl = new FormControl('', Validators.required);
  public claveWeb: FormControl = new FormControl('', Validators.required);
  public fecCreacion: FormControl = new FormControl('', Validators.required);
  public fecDocumento: FormControl = new FormControl('', Validators.required);
  public flgAnexo: FormControl = new FormControl('', Validators.required);
  public flgTupa: FormControl = new FormControl('', Validators.required);
  public folios: FormControl = new FormControl(0, Validators.required);
  public idAno: FormControl = new FormControl('', Validators.required);
  public idDestino: FormControl = new FormControl('', Validators.required);
  public idDocumento: FormControl = new FormControl('', Validators.required);
  public idNroDocumento: FormControl = new FormControl('', Validators.required);
  public idRemitenteE: FormControl = new FormControl('', Validators.required);
  public idTipoDocumento: FormControl = new FormControl('', Validators.required);
  public idTupa: FormControl = new FormControl('', Validators.required);
  public idDocumentoPadre: FormControl = new FormControl('', Validators.required);
  public nombreRemitente: FormControl = new FormControl('', Validators.required);
  public nroDocumentoDoc: FormControl = new FormControl('', Validators.required);
  public numDocumentoPadre: FormControl = new FormControl('', Validators.required);
  public observaciones: FormControl = new FormControl('');
  public plazo: FormControl = new FormControl('', Validators.required);
  public remitente: FormControl = new FormControl('',);
  public reservado: FormControl = new FormControl('', Validators.required);
  public tipo: FormControl = new FormControl('', Validators.required);
  public usuCreacion: FormControl = new FormControl('', Validators.required);
  public tipoOficina: FormControl = new FormControl('', Validators.required);
  public tipoDocumentoCie: FormControl = new FormControl('', Validators.required);

  public countDocumento: FormControl = new FormControl('', Validators.required);
  public countAnexo: FormControl = new FormControl('');
  public fileDocumento: FormControl = new FormControl([], Validators.required);
  public fileAnexo: FormControl = new FormControl([]);

  // public valTipoPersona:string ='';

  constructor(
    
    private router:Router,
    public fb: FormBuilder,
    //private searchPersona:SearchPersonaService,
    private soapTramite: SoaptramiteService,
    library: FaIconLibrary,


    //public _MessageService: MessageService, 
    private sanitizer: DomSanitizer,
     @Inject(DOCUMENT)
    // private document: any, 

    private messageService: MessageService,
    //public dialog: MatDialog
    // private modalService: NgbModal

    private _formBuilder: FormBuilder, 
    breakpointObserver: BreakpointObserver
    
  ){

    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)').pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

    this.formGroupDoc = this.fb.group({
      asunto: this.asunto,
      claveWeb: this.claveWeb, // Valor 0
      fecCreacion: this.fecCreacion,
      fecDocumento: this.fecDocumento,
      flgAnexo: this.flgAnexo , // Valor 0
      flgTupa: this.flgTupa , // Valor 0
      folios: this.folios ,
      idAno: this.idAno ,
      idDestino: this.idDestino ,
      idDocumento: this.idDocumento , // Valor 0
      idNroDocumento: this.idNroDocumento , // Valor 0
      idRemitenteE: this.idRemitenteE ,
      idTipoDocumento: this.idTipoDocumento ,
      idTupa: this.idTupa , // Valor 0
      idDocumentoPadre: this.idDocumentoPadre , // Valor 0
      nombreRemitente: this.nombreRemitente ,
      nroDocumentoDoc: this.nroDocumentoDoc ,
      numDocumentoPadre: this.numDocumentoPadre , // Valor 0
      observaciones: this.observaciones ,
      plazo: this.plazo , // Valor 0
      remitente: this.remitente ,
      reservado: this.reservado ,
      tipo: this.tipo ,
      usuCreacion: this.usuCreacion,

      countDocumento: this.countDocumento,
      countAnexo: this.countAnexo,
      fileDocumento: this.fileDocumento,
      fileAnexo: this.fileAnexo,

    });

    this.formGroupSearch = this.fb.group({
      tipoPersonaSea:this.tipoPersonaSea,
      tipoDocumentoP: this.tipoDocumentoP,
      nroDocumento: this.nroDocumento,
    });

    this.formGroupPersona = this.fb.group({
      // tipoPersonaPer: this.tipoPersonaPer,
      // tipoDocumentoP: this.tipoDocumentoP,
      // nroDocumento: this.nroDocumento,
      paterno: this.paterno,
      materno: this.materno,
      nombres: this.nombres,
      telefono: this.telefono,
      correo: this.correo,
      direccion : this.direccion,
      // photo:this.photo,
    });

    this.formGroupEmpresa = this.fb.group({
      // tipoPersonaEmp: this.tipoPersonaEmp,
      // tipoDocumentoP: this.tipoDocumentoP,
      // nroDocumento: this.nroDocumento,
      razonSocial: this.razonSocial,
      departamento: this.departamento,
      provincia: this.provincia,
      distrito: this.distrito,
      domicilioFiscal : this.domicilioFiscal,
      tipoContribuyente : this.tipoContribuyente,
      telefonoEmp: this.telefonoEmp,
      correoEmp: this.correoEmp,
      // direccion : this.direccion,
    });

    library.addIcons(fasStar);
  }

  ngOnInit(): void {

    this.myFunction(this.nroDocumento);

    this.soapTramite.getDocumentosXml().subscribe({
      next:(resp:any)=>{
        if(resp.message==='Datos cargados'){
          this.selectTipoDocCie = resp.data
        }
        if(resp.message==='Error datos vacios documento'){
          console.log('No se cargo ningun dato documento')
        }
        if(resp.message==='Error XML a JSON documento'){
          console.log('Error de formato')
        }
      }, error:(error)=>{
        console.log('Error')
      }, complete:()=>{
        // console.log('Completo')
      }
    })

    this.soapTramite.getOficinasXml().subscribe({
      next:(resp:any)=>{
        if(resp.message==='Datos cargados'){
          const _idDes = resp.data.filter((_:any)=>{return _.ID=='9.31'});
          this.selectTipoOfiCie = _idDes;
          this.formGroupDoc.patchValue({'idDestino':_idDes[0].ID});
        }
        if(resp.message==='Error datos vacios oficina'){
          console.log('No se cargo ningun dato oficina')
        }
        if(resp.message==='Error XML a JSON oficina'){
          console.log('Error de formato')
        }

      }, error:(error)=>{
        console.log('Error')
      }, complete:()=>{
        // console.log('Completo')
      }
    })

    this.getWidth = window.innerWidth;
    this.getHeight = window.innerHeight;

    // this.openModal();
  }
  ngAfterViewInit(): void { 
    $('[data-bs-toggle="tooltip"]').tooltip();
  }



  phoneNumberValidator(control: FormControl): { [key: string]: boolean | string } | null {
    const value = control.value;
    if(value !== null&&value!==''){
      if(value[0]=='9'){ 
        if (value && !/^9\d{8}$/.test(value)) {  return { 'invalidPhoneNumber': true, 'msgError':'Si es celular comenzar con 9 y tener 9 dÍgitos'}; }
      }
      if(value[0]=='0'){
        if (value && !/^(0[1])\d{7}$/.test(value)) {  return { 'invalidPhoneNumber': true, 'msgError':'(Si es fijo colocar 01 antes del número)' }; }
      }
      if(value[0]!=='0'&&value[0]!=='9'){
        return { 'invalidPhoneNumber': true, 'msgError':'(Número no valido)' };
      }
    }
    return null;
  }


  cargarFormDoc(){
    const {year, month, day } = this.dateNow();
    this.formGroupDoc.get('idAno')?.setValue(year);
    //this.formGroupDoc.patchValue({'idAno':year});
    this.formGroupDoc.patchValue({'reservado':'FALSE'});
    this.formGroupDoc.patchValue({'tipo':'E'});
    this.formGroupDoc.patchValue({'usuCreacion': 'VIRTUAL'});
    this.formGroupDoc.patchValue({'fecCreacion': `${year}-${month}-${day}`});
    this.formGroupDoc.patchValue({'fecDocumento': `${year}-${month}-${day}`});

    this.formGroupDoc.get('claveWeb')?.setValue('0');
    this.formGroupDoc.get('flgAnexo')?.setValue('0');
    this.formGroupDoc.get('flgTupa')?.setValue('0');
    this.formGroupDoc.get('idDocumento')?.setValue('0');
    this.formGroupDoc.get('idNroDocumento')?.setValue('0');
    this.formGroupDoc.get('idTupa')?.setValue('0');
    this.formGroupDoc.get('idDocumentoPadre')?.setValue('0');
    this.formGroupDoc.get('numDocumentoPadre')?.setValue('0');
    this.formGroupDoc.get('plazo')?.setValue('0');

  }

  dateNow():{year:String, month:String, day:String}{
    const fecha = new Date()
    var _year = (fecha.getFullYear()).toString()
    var _monthText=''
    var _monthNumber=''
    var _dayMonth=''
  
    var _hours = ''
    var _minutes = ''
    var _seconds = ''
    var _milliseconds = ''
  
    if(fecha.getMonth()==0){ _monthText='Enero'; _monthNumber='01' }
    if(fecha.getMonth()==1){ _monthText='Febrero'; _monthNumber='02'}
    if(fecha.getMonth()==2){ _monthText='Marzo'; _monthNumber='03' }
    if(fecha.getMonth()==3){ _monthText='Abril'; _monthNumber='04'}
    if(fecha.getMonth()==4){ _monthText='Mayo'; _monthNumber='05'}
    if(fecha.getMonth()==5){ _monthText='Junio'; _monthNumber='06'}
    if(fecha.getMonth()==6){ _monthText='Julio'; _monthNumber='07'}
    if(fecha.getMonth()==7){ _monthText='Agosto'; _monthNumber='08'}
    if(fecha.getMonth()==8){ _monthText='Setiembre'; _monthNumber='09'}
    if(fecha.getMonth()==9){ _monthText='Octubre'; _monthNumber='10'}
    if(fecha.getMonth()==10){ _monthText='Noviembre'; _monthNumber='11'}
    if(fecha.getMonth()==11){ _monthText='Diciembre'; _monthNumber='12'}
  
    if(fecha.getDate().toString().length==1){ _dayMonth=`0${fecha.getDate()}`}else{_dayMonth=`${fecha.getDate()}`}
  
    if(fecha.getUTCHours().toString().length==1){_hours=`0${fecha.getUTCHours()}`} else {_hours=`${fecha.getUTCHours()}`}
    if(fecha.getMinutes().toString().length==1){_minutes=`0${fecha.getMinutes()}`} else {_minutes=`${fecha.getMinutes()}`}
    if(fecha.getSeconds().toString().length==1){_seconds=`0${fecha.getSeconds()}`} else {_seconds=`${fecha.getSeconds()}`}

    if(fecha.getMilliseconds().toString().length==1){_milliseconds=`00${fecha.getMilliseconds()}`} 
    if(fecha.getMilliseconds().toString().length==2){_milliseconds=`0${fecha.getMilliseconds()}`} 
    if(fecha.getMilliseconds().toString().length==3){_milliseconds=`${fecha.getMilliseconds()}`} 
  
    return {year:_year,month:_monthNumber,day:_dayMonth};
  }
  


  myFunction(rule:any){
    let item1 = (<HTMLInputElement>document.getElementById('nroDocumento'))
 
    let tipoDocumentoP = (<HTMLInputElement>document.getElementById('tipoDocumentoP')).value
    rule  = tipoDocumentoP
    // if(rule==='DNI'){
    //   const validators = this.nroDocumento.validator? [this.nroDocumento.validator, Validators.minLength(8)] : Validators.minLength(8);
    //   console.log('DNI',validators,  this.nroDocumento.validator)
    //   console.log('DNI',this.formGroupSearch)
    //   this.nroDocumento.setValidators(validators);
    //   this.nroDocumento.updateValueAndValidity();      
    // }

    // if(rule==='RUC'){
    //   const validators = this.nroDocumento.validator? [this.nroDocumento.validator, Validators.minLength(11)] : Validators.minLength(11);
    //   console.log('RUC',validators,  this.nroDocumento.validator)

    //   this.nroDocumento.setValidators(validators);
    //   this.nroDocumento.updateValueAndValidity();      
    // }




    this.searchActive=true;
    switch (rule) {
      case "RUC":
        item1.maxLength = 11
        item1.value = ""
       // this.nroDocumento.validator
        this.nroDocumento.reset();
        this.formGroupPersona.reset();
        this.formGroupEmpresa.reset();
        this.imagenFoto='';

       break;
     case "DNI": 
      item1.maxLength= 8
      item1.value= ""
      this.nroDocumento.reset();
      this.formGroupPersona.reset();
      this.formGroupEmpresa.reset();
      this.imagenFoto='';
      break;
    case "Pasaporte": 
      item1.maxLength =12
      item1.value= ""
      this.nroDocumento.reset();
      this.formGroupPersona.reset();
      this.formGroupEmpresa.reset();
      this.imagenFoto='';
     break; 
     case "Carnet de extranjería":
       item1.maxLength=12
       item1.value= ""
       this.nroDocumento.reset();
       this.formGroupPersona.reset();
       this.formGroupEmpresa.reset();
       this.imagenFoto='';
       break;
     default: 
       item1.maxLength = 0
       item1.value= ""
       this.nroDocumento.reset();
       this.formGroupPersona.reset();
       this.formGroupEmpresa.reset();
       this.imagenFoto='';
       break;
  
   }
   
   
 }

  onRadioSi(e:any){
    this.radioAnexo =true;

    this.countAnexo.setValidators([Validators.required]);
    this.countAnexo.updateValueAndValidity();
    this.fileAnexo.setValidators([Validators.required]);
    this.fileAnexo.updateValueAndValidity();

  }

  onRadioNo(e:any){
    this.radioAnexo =false;

    this.countAnexo.clearValidators();
    this.countAnexo.updateValueAndValidity();
    this.fileAnexo.clearValidators();
    this.fileAnexo.updateValueAndValidity();

    this.fileTmpAnexoSeleccion=[]
    this.fileTmpAnexo = [];
    this.uploadedAnexoFiles='';
    const _count = this.fileTmpDocSeleccion.length;

    this.formGroupDoc.patchValue({'folios': parseInt(_count)})
    this.formGroupDoc.get('countAnexo')?.setValue('');
    this.formGroupDoc.get('fileAnexo')?.setValue([]);

    // Solo para desarrollo
    // this.cargarFormDoc()
    // this.formGroupDoc.get('idRemitenteE')?.setValue('78');
    // this.formGroupDoc.patchValue({'nombreRemitente':'Mi persona'})

  }




   inputCulminado(e:any) {

    let htmlDoc = (<HTMLInputElement>document.getElementById('nroDocumento'))
    let docLength =  this.formGroupSearch.value.nroDocumento;
    if(htmlDoc.maxLength===docLength.length){ this.searchActive=false }
    else{ this.searchActive=true }

  }

  onPaste(event: ClipboardEvent): void { event.preventDefault(); }

   async inputFilter(event: any) {
    // const pattern = /[0-9-,/°#+*¿¡!?]/;
    const pattern = /^[A-Za-z\s]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async inputFilterAsunto(event: any) {
    // const pattern = /[0-9-,/°#+*¿¡!?]/;
    const pattern = /^[A-Za-z0-9\s.]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async inputFilterObs(event: any) {
    // const pattern = /[0-9-,/°#+*¿¡!?]/;
    const pattern = /^[A-Za-z0-9\s.,;:?¿!¡]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  seleccionTPSearch(e:any){
    if(e==='NATURAL'){ 
      this.dni=true
      this.razon_social=false
      this.formGroupSearch.get('tipoDocumentoP')?.setValue('');
      this.formGroupSearch.get('nroDocumento')?.setValue('');
      this.searchActive=true;
    }
    if(e==='JURIDICA'){
      this.dni=false  
      this.razon_social=true
      this.formGroupSearch.get('tipoDocumentoP')?.setValue('');
      this.formGroupSearch.get('nroDocumento')?.setValue('');
      this.searchActive=true;
    }
    if(e===''){
      this.dni=false;
      this.razon_social=false;
      this.formGroupSearch.get('tipoDocumentoP')?.setValue('');
      this.formGroupSearch.get('nroDocumento')?.setValue('');
      this.searchActive=true;
    }
  }


  public restrictNumeric(e:any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
   }

   inputPerMayu(event:any,getValue:String){
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.toUpperCase();
    this.formGroupPersona.get(`${getValue}`)?.setValue(newValue, { emitEvent: false });
   }
   inputEmpMayu(event:any,getValue:String){
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.toUpperCase();
    this.formGroupEmpresa.get(`${getValue}`)?.setValue(newValue, { emitEvent: false });
   }

   inputDocMayu(event:any,getValue:String){
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.toUpperCase();
    this.formGroupDoc.get(`${getValue}`)?.setValue(newValue, { emitEvent: false });
   }

  // telefonochange(event:any){
  //   let doc = (<HTMLInputElement>document.getElementById('telefono')).value
  //   console.log('MY', this.formGroupPersona)
  // }

  telefonoEmpchange($event:any){
    let doc = (<HTMLInputElement>document.getElementById('telefonoEmp')).value
  }

  // correochange($event:any) {
  //   let doc = (<HTMLInputElement>document.getElementById('correo')).value
  // }
  correoEmpchange($event:any) {
    let doc = (<HTMLInputElement>document.getElementById('correoEmp')).value
  }

  // direccionchange($event:any)
  // {
  //   let doc = (<HTMLInputElement>document.getElementById('direccion')).value

  // }

  tipodocchange($event:any)
  {
    let doc = (<HTMLInputElement>document.getElementById('idDestino')).value
  }

  tipodocchangeCie($event:any)
  {
    let doc = (<HTMLInputElement>document.getElementById('idTipoDocumento')).value

    const docSeleccionado = this.selectTipoDocCie;
    const docSelect = docSeleccionado.filter((_:any)=>{return _.ID_TIPO_DOCUMENTO==doc})
    this.formGroupDoc.patchValue({'nroDocumentoDoc':docSelect[0].DESCRIPCION})
    //console.log('event22', docSelect)

  }

  // TODO AQUI PARA BUSCARR PERSONAS O EMPRESAS DE LA BASE DE DATOS
  buscar(){

    // this.loading = true;
    this.openModalLoading()

    var tipo_do:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoDocumentoP'));
    var nro_doc:HTMLInputElement = (<HTMLInputElement>document.getElementById('nroDocumento'));

    const tipoDoc_Val: string = tipo_do.value;
    const nroDoc_Val: string = nro_doc.value;
    
    const documento = this.formGroupSearch.value.nroDocumento;

    if ( (nroDoc_Val.length !== 8 ) && tipoDoc_Val == 'DNI') {
      // this.errorNroDocumento=false;
      // this.errorNroDocumentoDigito=true;
      // this.errorMsgNroDocumento=this.errorMsg2;
      // document.getElementById('tipoDocumentoP').focus();
      // return alert('Ingrese correctamente el DNI')
    }
    else if ( nroDoc_Val.length !== 11  && tipoDoc_Val == 'RUC'){
      // this.errorNroDocumento=false;
      // this.errorNroDocumentoDigito=true;
      // this.errorMsgNroDocumento=this.errorMsg3;
    }else if ((nroDoc_Val.length !== 12  && tipoDoc_Val =='Carnet de extranjería') ){
      // this.errorNroDocumento=false;
      // this.errorNroDocumentoDigito=true;
      // this.errorMsgNroDocumento=this.errorMsg4;
    } 
    else if ((nroDoc_Val.length !== 12 && tipoDoc_Val =='Pasaporte') ){
      // this.errorNroDocumento=false;
      // this.errorNroDocumentoDigito=true;
      // this.errorMsgNroDocumento=this.errorMsg5;
    }
    else{
      // this.errorNroDocumento=false;
      // this.errorNroDocumentoDigito=false;
      // return console.log('CAmpos Errorr f werw er')  
      if(this.nroDocumento.valid&&this.tipoDocumentoP.valid){
        this.cargarFormDoc();
        // console.log('DATA SIN 999999',this.tipoDocumentoP)
        if(tipoDoc_Val==='RUC'){ return this.buscarEmpresa(documento)}
        if(tipoDoc_Val==='DNI'){ return this.buscarPersona(documento)}

      }
      else{
        // console.log('DATA SIN 0000',this.tipoDocumentoP)
      }
    }
  }

  buscarEmpresa(documento:string){
    var tipo_pe:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoPersonaSea'));
    var tipo_do:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoDocumentoP'));
    var nro_doc:HTMLInputElement = (<HTMLInputElement>document.getElementById('nroDocumento'));

    var _razonSocial:HTMLInputElement = (<HTMLInputElement>document.getElementById('razonSocial'));
    var _tipoContribuyente:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoContribuyente'));
    var _departamento:HTMLInputElement = (<HTMLInputElement>document.getElementById('departamento'));
    var _provincia:HTMLInputElement = (<HTMLInputElement>document.getElementById('provincia'));
    var _distritos:HTMLInputElement = (<HTMLInputElement>document.getElementById('distrito'));
    var _domicilioFiscal:HTMLInputElement = (<HTMLInputElement>document.getElementById('domicilioFiscal'));

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));


    this.soapTramite.getDatosEmpresaSunatXml({documento}).subscribe({
      next:(resp)=>{
        if(resp.message==='Documento no valido'){
          this.closeModalLoading();
          toastError.show();
          this.toastMsgError = 'Documento ingresado no valido'
        }

        if(resp.message==='Error api'){
          this.closeModalLoading();
          toastError.show();
          this.toastMsgError = 'Error de respuesta'
        }

        if(resp.message==='Error de formato'){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de formato'
        }

        if(resp.message==='Error servidor'){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error'
        }

        if(resp.message==='Datos encontrados'){
          this.closeModalLoading()

          this.btnBuscar = false;
          tipo_pe.disabled = true;
          tipo_do.disabled = true;
          nro_doc.disabled = true;

          _razonSocial.disabled = true;
          _tipoContribuyente.disabled = true;
          _departamento.disabled = true;
          _provincia.disabled = true;
          _distritos.disabled = true;
          _domicilioFiscal.disabled = true;

          this.formGroupEmpresa.patchValue({
            tipoPersonaEmp: resp.data.DescTipoPersona==='PERSONA NATURAL'?'NATURAL':'JURIDICA',
            razonSocial: resp.data.NombreRazonSocial,
            departamento: resp.data.Departamento,
            provincia: resp.data.Provincia,
            distrito: resp.data.Distrito,
            domicilioFiscal: resp.data.DomicilioFiscal,
            tipoContribuyente: resp.data.DescPersona,
          })

          toastExito.show();
          this.toastMsgOk = 'Documento entontrado.'
        }

        if(resp.message==='Datos no encontrados'){
          this.closeModalLoading()
          this.btnBuscar = false;
          tipo_pe.disabled = false;
          tipo_do.disabled = false;
          nro_doc.disabled = false;
          toastError.show();
          this.toastMsgError = 'Documento no encontrado, puede ingresar sus datos manualmente.'
        }
      },error:(error) => {
        this.closeModalLoading();
        toastError.show();
        this.toastMsgError = 'Error al cargar los datos'
      },complete:()=>{
        // console.log('RESP COMPLETO')  
      }
    })
  }

  buscarPersona(documento:string){
    var tipo_pe:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoPersonaSea'));
    var tipo_do:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoDocumentoP'));
    var nro_doc:HTMLInputElement = (<HTMLInputElement>document.getElementById('nroDocumento'));

    var _paterno:HTMLInputElement = (<HTMLInputElement>document.getElementById('paterno'));
    var _materno:HTMLInputElement = (<HTMLInputElement>document.getElementById('materno'));
    var _nombres:HTMLInputElement = (<HTMLInputElement>document.getElementById('nombres'));
    var _direccion:HTMLInputElement = (<HTMLInputElement>document.getElementById('direccion'));

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));

    this.soapTramite.getDatosPersonaReniecXml({documento}).subscribe({
      next:(resp)=>{
      if(resp.message==='Documento no valido'){
        this.imagenFoto='';
        this.closeModalLoading();
        toastError.show();
        this.toastMsgError = 'Documento ingresado no valido'
      }

      if(resp.message==='Error api'){
        this.imagenFoto='';
        this.closeModalLoading()
        toastError.show();
        this.toastMsgError = 'Error de respuesta'
      }

      if(resp.message==='Error de formato'){
        this.imagenFoto='';
        this.closeModalLoading()
        toastError.show();
        this.toastMsgError = 'Error de formato'
      }

      if(resp.message==='Error servidor'){
        this.imagenFoto='';
        this.closeModalLoading()
        toastError.show();
        this.toastMsgError = 'Error'
      }

      if(resp.message==='Datos encontrados'){
        this.closeModalLoading()

        this.btnBuscar = false;
        tipo_pe.disabled = true;
        tipo_do.disabled = true;
        nro_doc.disabled = true;

        _materno.disabled = true;
        _paterno.disabled = true;
        _nombres.disabled = true;
        _direccion.disabled = true;

        this.formGroupPersona.patchValue({
            tipoPersonaPer: 'NATURAL',
            tipoDocumentoP: this.tipoDocumentoP.value,
            nroDocumento: this.nroDocumento.value,
            paterno: resp.data.ApePaterno,
            materno: resp.data.ApeMaterno,
            nombres: resp.data.Nombres,
            direccion: resp.data.Direccion,
          })
          // console.log(this.formGroupPersona.value)
          this.imagenFoto = `data:image/jpeg;base64,${resp.data.FotoPer}`
          const image = new Image();
          image.src = this.imagenFoto;
          toastExito.show();
          this.toastMsgOk = 'Documento encontrado.'
      }

      if(resp.message==='Datos no encontrados'){
        // this.loading = false;
        this.closeModalLoading()

        this.btnBuscar = false;
        tipo_pe.disabled = true;
        tipo_do.disabled = true;
        nro_doc.disabled = true;

        toastError.show();
        this.toastMsgError = 'Documento no encontrado, puede ingresar sus datos manualmente.'
      }
    },error:(error) => {
      this.closeModalLoading();
      toastError.show();
      this.toastMsgError = 'Error al cargar los datos'
    },complete:()=>{
      // console.log('RESP COMPLETO')  
    }})
  }


  // TODO AQUI PARA AGREGAR PERSONAS O EMPRESAS A LA BASE DE DATOS
  addPersona(form:any){
    
    this.openModalLoading()
    var tipo_do:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoDocumentoP'));
    var nro_doc:HTMLInputElement = (<HTMLInputElement>document.getElementById('nroDocumento'));

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));

    const tipoDoc_Val: string = tipo_do.value;
    const nroDoc_Val: string = nro_doc.value;

    const documento = this.formGroupSearch.value.nroDocumento;
    if(documento!==null&&this.nroDocumento.valid&&this.tipoDocumentoP.valid){
      if(documento.length==8){
        if(tipoDoc_Val==='DNI'){ return this.persona(documento, form)}
      }
      if(documento.length==11){
         if(tipoDoc_Val==='RUC'){ return this.empresa(documento, form)}
      }
      if(documento.length!==8||documento.length!==11){
        this.closeModalLoading()
        toastError.show();
        this.toastMsgError = 'El documento no es valido'
     }
    }
    if(documento==null){
      if(documento==null){
        this.closeModalLoading()
        toastError.show();
        this.toastMsgError = 'El documento no debe estar vacio'
      }
    }
  }

  persona(documento:string, form:any){

    var _paterno:HTMLInputElement = (<HTMLInputElement>document.getElementById('paterno'));
    var _materno:HTMLInputElement = (<HTMLInputElement>document.getElementById('materno'));
    var _nombres:HTMLInputElement = (<HTMLInputElement>document.getElementById('nombres'));
    var _telefono:HTMLInputElement = (<HTMLInputElement>document.getElementById('telefono'));
    var _correo:HTMLInputElement = (<HTMLInputElement>document.getElementById('correo'));
    var _direccion:HTMLInputElement = (<HTMLInputElement>document.getElementById('direccion'));

    var _contentScroll:HTMLInputElement = (<HTMLInputElement>document.getElementById('content'));

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));
    
    const persona = {
      paterno: form.paterno.toUpperCase(),
      materno: form.materno.toUpperCase(),
      nombres : form.nombres.toUpperCase(),
      telefono: form.telefono,
      tipoDocumentoP:  this.formGroupSearch.value.tipoDocumentoP,
      tipoPersona: this.formGroupSearch.value.tipoPersonaSea[0],
      nroDoc: documento,
      ruc: '',
      correo:form.correo.toLowerCase(),
      direccion: form.direccion.toUpperCase(),
    }
    // this.loading=false;
    this.soapTramite.getDatosPersonaXml(persona).subscribe({
      next:(resp)=>{
        if(resp.message === "Datos persona"){
          this.showFormDocumento = true;
          this.btnPersona = false;
          _materno.disabled = true;
          _paterno.disabled = true;
          _nombres.disabled = true;
          _telefono.disabled = true;
          _correo.disabled = true;
          _direccion.disabled = true;

          setTimeout(() => {
            this.closeModalLoading()
            this.formGroupDoc.get('idRemitenteE')?.setValue(resp.data);
            this.formGroupDoc.patchValue({'nombreRemitente':`${persona.paterno} ${persona.materno} ${persona.nombres}`});
            var _remitente:HTMLInputElement = (<HTMLInputElement>document.getElementById('nombreRemitente'));
            _remitente.disabled = true;

            const scrollPosition = _contentScroll.scrollHeight;
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
          }, 1000);
        }
        if(resp.message === "Error api"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de respuesta'
          this.showFormDocumento = true;
        }

        if(resp.message === "Error servidor"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error'
        }

        if(resp.message === "Error de formato"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de formato'
        }


    },error:(error) => {
      this.closeModalLoading();
      toastError.show();
      this.toastMsgError = 'Error al cargar los datos'
    },complete:()=>{
      // console.log('RESP COMPLETO')  
    }
  })
  }

  empresa(documento:string, form:any){

    var _razonSocial:HTMLInputElement = (<HTMLInputElement>document.getElementById('razonSocial'));
    var _tipoContribuyente:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoContribuyente'));
    var _departamento:HTMLInputElement = (<HTMLInputElement>document.getElementById('departamento'));
    var _provincia:HTMLInputElement = (<HTMLInputElement>document.getElementById('provincia'));
    var _distritos:HTMLInputElement = (<HTMLInputElement>document.getElementById('distrito'));
    var _domicilioFiscal:HTMLInputElement = (<HTMLInputElement>document.getElementById('domicilioFiscal'));
    var _telefonoEmp:HTMLInputElement = (<HTMLInputElement>document.getElementById('telefonoEmp'));
    var _correoEmp:HTMLInputElement = (<HTMLInputElement>document.getElementById('correoEmp'));

    var _contentScroll:HTMLInputElement = (<HTMLInputElement>document.getElementById('content'));

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));

    const persona = {
      paterno: '',
      materno:'',
      nombres : form.razonSocial.toUpperCase(),
      telefono: form.telefonoEmp,
      tipoDocumentoP:  this.formGroupSearch.value.tipoDocumentoP,
      tipoPersona: this.formGroupSearch.value.tipoPersonaSea[0],
      nroDoc: '',
      ruc: documento,
      correo:form.correoEmp.toLowerCase(),
      direccion: form.domicilioFiscal.toUpperCase(),
    }

    // console.log(persona)
    // this.loading=false;

    this.soapTramite.getDatosPersonaXml(persona).subscribe({
      next:(resp)=>{
        if(resp.message === "Datos persona"){
          this.showFormDocumento = true;
          this.btnEmpresa = false;

          _razonSocial.disabled = true;
          _tipoContribuyente.disabled = true;
          _departamento.disabled = true;
          _provincia.disabled = true;
          _distritos.disabled = true;
          _domicilioFiscal.disabled = true;
          _telefonoEmp.disabled = true;
          _correoEmp.disabled = true;

          setTimeout(() => {  
            this.closeModalLoading()
            this.formGroupDoc.get('idRemitenteE')?.setValue(resp.data);
            this.formGroupDoc.patchValue({'nombreRemitente':`${persona.nombres}`});
            var _remitente:HTMLInputElement = (<HTMLInputElement>document.getElementById('nombreRemitente'));
            _remitente.disabled = true;

            const scrollPosition = _contentScroll.scrollHeight;
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
          }, 1000);          
        }

        if(resp.message === "Error api"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de respuesta'
        }

        if(resp.message === "Error servidor"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error'
        }

        if(resp.message === "Error de formato"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de formato'
        }

      },error:(error) => {
        this.closeModalLoading();
        toastError.show();
        this.toastMsgError = 'Error al cargar los datos'
      },complete:()=>{
        // console.log('RESP COMPLETO')  
      }
    })
  }
  
  // TODO AQUI PARA CANCELAR LA BUSQUEDA DE LA PERSONA O EMPRESA
  buscarOtro(){
    
    var tipo_pe:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoPersonaSea'));
    var tipo_do:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoDocumentoP'));
    var nro_doc:HTMLInputElement = (<HTMLInputElement>document.getElementById('nroDocumento'));

    nro_doc.maxLength = 0
    //nro_doc.value= ""

    tipo_pe.disabled = false;
    tipo_do.disabled = false;
    nro_doc.disabled = false;

    this.dni=false;
    this.razon_social=false;

    this.btnBuscar = true;
    this.btnPersona = true;
    this.btnEmpresa = true;
    this.searchActive = true;

    this.formGroupEmpresa.reset()
    this.formGroupPersona.reset()
    this.formGroupDoc.reset()

    this.formGroupSearch.get('tipoPersonaSea')?.setValue('');
    this.formGroupSearch.get('tipoDocumentoP')?.setValue('');
    this.formGroupSearch.get('nroDocumento')?.setValue('');

    this.showFormDocumento = false;
    if(this.formGroupSearch.value.tipoDocumentoP==="DNI"){

      var _paterno:HTMLInputElement = (<HTMLInputElement>document.getElementById('paterno'));
      var _materno:HTMLInputElement = (<HTMLInputElement>document.getElementById('materno'));
      var _nombres:HTMLInputElement = (<HTMLInputElement>document.getElementById('nombres'));
      var _telefono:HTMLInputElement = (<HTMLInputElement>document.getElementById('telefono'));
      var _correo:HTMLInputElement = (<HTMLInputElement>document.getElementById('correo'));
      var _direccion:HTMLInputElement = (<HTMLInputElement>document.getElementById('direccion'));

      _materno.disabled = false;
      _paterno.disabled = false;
      _nombres.disabled = false;
      _telefono.disabled = false;
      _correo.disabled = false;
      _direccion.disabled = false;

    }
    if(this.formGroupSearch.value.tipoDocumentoP==="RUC"){

      var _razonSocial:HTMLInputElement = (<HTMLInputElement>document.getElementById('razonSocial'));
      var _tipoContribuyente:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoContribuyente'));
      var _departamento:HTMLInputElement = (<HTMLInputElement>document.getElementById('departamento'));
      var _provincia:HTMLInputElement = (<HTMLInputElement>document.getElementById('provincia'));
      var _distritos:HTMLInputElement = (<HTMLInputElement>document.getElementById('distrito'));
      var _domicilioFiscal:HTMLInputElement = (<HTMLInputElement>document.getElementById('domicilioFiscal'));
      var _telefonoEmp:HTMLInputElement = (<HTMLInputElement>document.getElementById('telefonoEmp'));
      var _correoEmp:HTMLInputElement = (<HTMLInputElement>document.getElementById('correoEmp'));

      _razonSocial.disabled = false;
      _tipoContribuyente.disabled = false;
      _departamento.disabled = false;
      _provincia.disabled = false;
      _distritos.disabled = false;
      _domicilioFiscal.disabled = false;
      _telefonoEmp.disabled = false;
      _correoEmp.disabled = false;


    }
  }

  // TODO AQUI PARA PARA AGREGAR LOS ARCHIVOS PDF
  onFileAnexoChange(e:any){
    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));

    this.uploadedAnexoFiles = '';
    this.fileTmpAnexoSeleccion = [];

    const countFile = e.target.files;
    this.fileTmpAnexo = [];

    if(countFile.length < 4){

      let _countFile = 0;
      for (let i = 0; i < countFile.length; i++) {

        if(e.target.files[i].type === 'application/pdf'){
          const element = e.target.files[i];

          const bits = element.size;
          const kilobits = (bits/1024);
          const megabits = (kilobits/1024);

          if(megabits<10){
            const _ = { fileRaw:element, fileName:element.name };
            this.fileTmpAnexo.push(_);
            const _file= { name:countFile[i].name, size:bits, kilobit:kilobits, megabit:megabits }
            this.fileTmpAnexoSeleccion.push(_file)
            _countFile += 1 
          }else{
            toastError.show();
            if(countFile.length===1){ this.toastMsgError = `El tamaño del pdf no debe ser mayor a 10Mb` }
            if(countFile.length===2){ this.toastMsgError = `El tamaño del pdf no debe ser mayor a 10Mb` }
            if(countFile.length===3){ this.toastMsgError = `El tamaño del pdf no debe ser mayor a 10Mb` }
          }
        }else{
          toastError.show();
          this.toastMsgError = `Solo archivos PDF`;
        }
      }
      this.uploadedAnexoFiles = (_countFile==0)?"":(_countFile==1?`Archivo ${_countFile}`:`Archivos ${_countFile}`);
    } else {
      toastError.show();
      this.toastMsgError = `Solo se permite cargar 3 anexos `
    }

    this.formGroupDoc.patchValue({'fileAnexo':this.fileTmpAnexo})
    this.formGroupDoc.patchValue({'folios':parseInt(this.fileTmpDoc.length+this.fileTmpAnexo.length)})
    // this.reset();
  }

  onFileDocChange(e:any){

    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));

    this.uploadedDocumentoFiles = '';
    this.fileTmpDocSeleccion = [];

    const countFile = e.target.files;
    this.fileTmpDoc = [];
    //console.log('22222')
    if(countFile.length === 1){
      let _countFile = 0;
      for (let i = 0; i < countFile.length; i++) {
        if(e.target.files[i].type === 'application/pdf'){
          const element = e.target.files[i];

          const bits = element.size;
          const kilobits = (bits/1024);
          const megabits = (kilobits/1024);

          if(megabits<10){
            const _ = { 
              fileRaw:element,
              fileName:element.name,
            };

            this.fileTmpDoc.push(_);
            const _file= { name:countFile[i].name, size:bits, kilobit:kilobits, megabit:megabits }
            this.fileTmpDocSeleccion.push(_file);
            _countFile += 1;
          } else{
            toastError.show();
            this.toastMsgError = 'El tamaño del pdf no debe ser mayor a 10Mb'
          }
        }else{
          toastError.show();
          this.toastMsgError = `Solo archivos PDF`;
        }
      }
      this.uploadedDocumentoFiles = (_countFile==0)?"":(_countFile==1?`Archivo ${_countFile}`:`Archivos ${_countFile}`);

    } else {
        // console.log('FILE NO ENVIADO', countFile.length);
    }

    this.formGroupDoc.patchValue({'folios':parseInt(this.fileTmpDoc.length+this.fileTmpAnexo.length)})
    this.formGroupDoc.patchValue({'fileDocumento':this.fileTmpDoc })
    // this.reset();
  }

  // TODO AQUI PARA ELIMINAR LOS ARCHIVOS PDF SELECCIONADOS 
  removeDoc(e:any, index:number){
    this.fileTmpDocSeleccion.splice(index,1)
    const _count = this.fileTmpDocSeleccion.length;

    this.uploadedDocumentoFiles = (_count==0)?"":(_count==1?`Archivo ${_count}`:`Archivos ${_count}`);

    const _FileDoc = this.formGroupDoc.value.fileDocumento.filter((_:any)=>{return _.fileName!==e.name })
    this.fileTmpDoc= _FileDoc;

    this.formGroupDoc.patchValue({'countDocumento':(_count==0)&&''})
    this.formGroupDoc.patchValue({'folios':parseInt(this.fileTmpDoc.length+this.fileTmpAnexo.length)})
    this.formGroupDoc.patchValue({'fileDocumento':_FileDoc })
  }

  removeAnexo(e:any, index:number){
    this.fileTmpAnexoSeleccion.splice(index,1)
    const _count = this.fileTmpAnexoSeleccion.length;

    this.uploadedAnexoFiles = (_count==0)?"":(_count==1?`Archivo ${_count}`:`Archivos ${_count}`);

    const _FileAnexo = this.formGroupDoc.value.fileAnexo.filter((_:any)=>{return _.fileName!==e.name })
    this.fileTmpAnexo= _FileAnexo;

    if(_count==0){ this.formGroupDoc.patchValue({'countAnexo':(_count==0)&&''})  }
    this.formGroupDoc.patchValue({'folios': parseInt(this.fileTmpDoc.length+this.fileTmpAnexo.length)})
    this.formGroupDoc.patchValue({'fileAnexo':_FileAnexo })
  }

  // TODO AQUI PARA REGISTRAR UN DOCUMENTO A LA BASE DE DATOS
  enviar(formdoc:any){
    // this.loading =true;
    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));
    this.openModalLoading()
    const _doc = {
      asunto: formdoc.asunto,
      claveWeb: formdoc.claveWeb,
      documentoAdjunto: formdoc.documentoAdjunto,
      fecCreacion: formdoc.fecCreacion,
      fecDocumento: formdoc.fecDocumento,
      flgAnexo: formdoc.flgAnexo,
      flgTupa: formdoc.flgTupa,
      folios: formdoc.folios.toString(),
      idAno: formdoc.idAno,
      idDestino: formdoc.idDestino,
      idDocumento: formdoc.idDocumento,
      idDocumentoPadre: formdoc.idDocumentoPadre,
      idNroDocumento: formdoc.idNroDocumento,
      idRemitenteE: formdoc.idRemitenteE,
      idTipoDocumento: formdoc.idTipoDocumento,
      idTupa: formdoc.idTupa,
      nombreRemitente: formdoc.nombreRemitente,
      nroDocumentoDoc: formdoc.nroDocumentoDoc,
      numDocumentoPadre: formdoc.numDocumentoPadre,
      observaciones: formdoc.observaciones,
      plazo: formdoc.plazo,
      remitente: formdoc.remitente,
      reservado: formdoc.reservado,
      tipo: formdoc.tipo,
      usuCreacion: formdoc.usuCreacion,
    }
    // console.log(_doc.nombreRemitente)
    // console.log(formdoc.nombreRemitente)
    // console.log(_doc)
    this.soapTramite.getDatosDocumentosXml(_doc).subscribe({
      next:(resp:any)=>{
        // console.log('MY',resp)
        if(resp.ok&&resp.message==='Documento ingresado'){
          this.enviarPdfDoc(resp.data)
          this.enviarPdfAnexo(resp.data)
          this.obtenerDataDocumento(resp.data)
        }

        if(resp.message === "Error api"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de respuesta'
        }

        if(resp.message === "Error servidor"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error'
        }

        if(resp.message === "Error de formato"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de formato'
        }

      },error:(error) => {
        this.closeModalLoading();
        toastError.show();
        this.toastMsgError = 'Error al cargar los datos'
      },complete:()=>{
        // console.log('RESP COMPLETO')  
      }
    })
  }

  expSimplificado(val:string){
    const partes = val.split("-");
    if (partes.length === 3) {
      const resultado = partes[1]; // Obtenemos la parte en el índice 1
      return resultado
    } else {
      console.log("Formato de texto no válido");
      return ''
    }
  }

 // TODO AQUI PARA OBTENER LOS DATOS DEL DOCUMENTO REGISTRADO
  obtenerDataDocumento(idDoc:string){
    const _data = { idDoc: idDoc };
    const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
    const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));

    this.soapTramite.getDocumentoIngresadoXml(_data).subscribe({
      next:(response:any)=>{
        if(response.message==="Datos encontrados"){
          // crea object para mostrar el documento en el modal de la pagina HTML
          const _documento = {
            numeroexpediente: this.expSimplificado(response.data[0].numeroexpediente),
            clave_web: response.data[0].clave_web,
            remitente: response.data[0].remitente,
            fec_recepcion: response.data[0].fec_recepcion,
            asunto: response.data[0].asunto,
            folios: response.data[0].FOLIOS,
            domicilio: response.data[0].domicilio,
            nroDoc: response.data[0].DNI!==''?response.data[0].DNI:response.data[0].RUC,
            tipoDocumento: response.data[0].flg_persona==='N'?'D.N.I':'R.U.C',
          };
          this.resultDocumento = _documento;

          const _enviarDoc = {
            email:(this.formGroupSearch.value.tipoDocumentoP==='DNI')?
            (this.formGroupPersona.value.correo==''?'mesadepartesvirtual@municieneguilla.gob.pe':this.formGroupPersona.value.correo):
            (this.formGroupEmpresa.value.correoEmp==''?'mesadepartesvirtual@municieneguilla.gob.pe':this.formGroupEmpresa.value.correoEmp),
            documento: _documento,
          }
          this.generarFileJspdf(_data.idDoc, _documento.nroDoc, _enviarDoc );
        }

        if(response.message === "Datos no encontrados"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = response.message
        }
        
        if(response.message === "Error api"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de respuesta'
        }

        if(response.message === "Error servidor"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error'
        }

        if(response.message === "Error de formato"){
          this.closeModalLoading()
          toastError.show();
          this.toastMsgError = 'Error de formato'
        }

      },error:(error) => {
        this.closeModalLoading();
        toastError.show();
        this.toastMsgError = 'Error al cargar los datos'
      },complete:()=>{
        // console.log('RESP COMPLETO')  
      }
    })
  }

  // TODO AQUI PARA GUARDAR LOS PDF SELECCIONADO DEL DIRECTORIO O ESCRITORIO DEL USUARIO 

  async enviarPdfDoc(claveDoc:string){
    // console.log('CLAVE',claveDoc)
    if(this.fileTmpDoc.length!==0){
      for (let i = 0; i < this.fileTmpDoc.length; i++) {
        var formularioDeDatos = new FormData();
        formularioDeDatos.append("myfile", this.fileTmpDoc[i].fileRaw, this.fileTmpDoc[i].fileName);
        formularioDeDatos.append('nroDocumento', this.formGroupSearch.value.nroDocumento);
        formularioDeDatos.append('archivo', 'Documento');
        formularioDeDatos.append('orden', (i+1).toString());
        formularioDeDatos.append('claveDoc', claveDoc);
        this.soapTramite.saveOnePdf(formularioDeDatos).subscribe((resp:any)=>{
          // console.log('PDF DOC', resp)
        })
      }
    }
  }

  async enviarPdfAnexo(claveDoc:string){
    // console.log('CLAVE',claveDoc)
    if(this.fileTmpAnexo.length!==0){
      for (let i = 0; i < this.fileTmpAnexo.length; i++) {
        var formularioDeDatos = new FormData();
        formularioDeDatos.append("myfile", this.fileTmpAnexo[i].fileRaw, this.fileTmpAnexo[i].fileName);
        formularioDeDatos.append('nroDocumento', this.formGroupSearch.value.nroDocumento);
        formularioDeDatos.append('archivo', 'Anexo');
        formularioDeDatos.append('orden', (i+1).toString());
        formularioDeDatos.append('claveDoc', claveDoc);
        this.soapTramite.saveOnePdf(formularioDeDatos).subscribe((resp:any)=>{
          // console.log('PDF ANEXO', resp)
        })
      }      
    }
  }

  // TODO AQUI PARA CREAR Y GUARDAR EL PDF DEL EXPEDIENTE SOLICITADO
  async generarFileJspdf(claveDoc:string, nroDoc:string, expediente:any){
    const doc = new jsPDF({
      orientation:'portrait',
      unit:'px',
      format: 'a4', // a4
      precision:2,
      floatPrecision: 16,
      putOnlyUsedFonts:true
    });


    let _width = doc.internal.pageSize.width
    let _height = doc.internal.pageSize.height

    doc.setFont('normal');
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text("DOCUMENTO", 20, 30, {align:'left', baseline:'alphabetic'}, );
    doc.text(`Fecha:${this.getFecha(new Date())}`, (_width-20), 30, {align:'right', baseline:'alphabetic'}, );
    doc.line(20,35,(_width-20),35,'S');
    

    doc.setFontSize(16);
    doc.text("Municipalidad de Cieneguilla", (_width/2), (_height/2+80), {align:'center'}) 

    doc.setFontSize(12);
    doc.text("Secretaria General", (_width/2), (_height/2+100), {align:'center'}) 
    doc.text("Sub gerencia de gestión documentaria", (_width/2), (_height/2+110), {align:'center'}) 

    doc.setFontSize(12);
    doc.text("La recepción del presente Expediente NO indica", (_width/2), (_height/2+140), {align:'center'}) 
    doc.text("ACEPTACIÓN", (_width/2), (_height/2+155), {align:'center'}) 
    doc.text("del mismo debiendo cumplir con el T.U.P.A. Institucional", (_width/2), (_height/2+170), {align:'center'}) 
    doc.text("Según el Numeral 6 del Art. 113 de la Ley 27444", (_width/2), (_height/2+185), {align:'center'}) 

    var logo = new Image();
    logo.src = "../../../../../assets/img/logo-sin-letras.png";
    doc.addImage(logo, 'PNG', ((_width/2)-30), (_height/2), 50, 60);

    autoTable(doc, {
      theme:'grid',
      styles:{fillColor: [209,231,221 ], },
      headStyles:{ fontStyle:'bold', fillColor:[13, 98, 94], textColor:'white', halign:'center', fontSize:12, cellPadding:2, font:'normal'},
      bodyStyles:{ font:'normal', fontSize:12},
      columnStyles: { 0: { halign:'left', fillColor:[13, 98, 94], textColor:'white'}, 1: { halign:'center', fillColor:[255,255,255], textColor:'black'}},
      margin:{top:50},
      //tableLineColor:{Color:200},
      head:[['','Datos']],
      body:[
        ['Expediente:',`${this.resultDocumento.numeroexpediente}`],
        ['Clave Web:',`${this.resultDocumento.clave_web}`],
        ['Fecha Recepción:',`${this.getFecha(this.resultDocumento.fec_recepcion)}`],
        ['Asunto:',`${this.resultDocumento.asunto}`],
        ['Remitente:',`${this.resultDocumento.remitente}`],
        ['N° Folios:',`${this.resultDocumento.folios}`],
        ['Domicilio:',`${this.resultDocumento.domicilio}`],
        [`${this.resultDocumento.tipoDocumento}:`,`${this.resultDocumento.nroDoc}`],
      ]
    });

    const hoy = new Date();
    var pdfBlob = doc.output("blob");
    const fileName = hoy.getDate()+hoy.getMonth()+hoy.getFullYear()+hoy.getTime()+'.pdf';
    // doc.save(fileName);

    var formExp = new FormData();
    formExp.append("pdfexp", pdfBlob, fileName);
    formExp.append('nroDocumento', nroDoc);
    formExp.append('archivo', 'Expediente');
    formExp.append('orden', (1).toString());
    formExp.append('claveDoc', claveDoc);
    this.soapTramite.generateOnePdf(formExp).subscribe((resp:any)=>{
      if(resp.ok){
        const _data = {
          email:expediente.email,
          documento:expediente.documento,
          file:resp.data,
        }

            // console.log('OK EMAIL')

        this.soapTramite.enviarCorreo(_data).subscribe((resp:any)=>{ 
          // console.log('OK EMAIL 0000', resp)

          if(resp.ok){

            this.closeModalLoading()
            //const toastError = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasError'));
            const toastExito = new bootstrap.Toast(<HTMLInputElement>document.getElementById('toasExito'));
            toastExito.show();
            this.toastMsgOk='Expediente registrado con exito.'
            this.loading = false;
            this.openModal();
          }
        })

      }
    })

  }

  async downloadFileJspdf(expediente:any){
    const doc = new jsPDF({
      orientation:'portrait',
      unit:'px',
      format: 'a4', // a4
      precision:2,
      floatPrecision: 16,
      putOnlyUsedFonts:true
    });

    let _width = doc.internal.pageSize.width
    let _height = doc.internal.pageSize.height

    doc.setFont('normal');
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text("DOCUMENTO", 20, 30, {align:'left', baseline:'alphabetic'}, );
    doc.text(`Fecha:${this.getFecha(new Date())}`, (_width-20), 30, {align:'right', baseline:'alphabetic'}, );
    doc.line(20,35,(_width-20),35,'S');
    

    doc.setFontSize(16);
    doc.text("Municipalidad de Cieneguilla", (_width/2), (_height/2+80), {align:'center'}) 

    doc.setFontSize(12);
    doc.text("Secretaria General", (_width/2), (_height/2+100), {align:'center'}) 
    doc.text("Sub gerencia de gestión documentaria", (_width/2), (_height/2+110), {align:'center'}) 

    doc.setFontSize(12);
    doc.text("La recepción del presente Expediente NO indica", (_width/2), (_height/2+140), {align:'center'}) 
    doc.text("ACEPTACIÓN", (_width/2), (_height/2+155), {align:'center'}) 
    doc.text("del mismo debiendo cumplir con el T.U.P.A. Institucional", (_width/2), (_height/2+170), {align:'center'}) 
    doc.text("Según el Numeral 6 del Art. 113 de la Ley 27444", (_width/2), (_height/2+185), {align:'center'}) 

    var logo = new Image();
    logo.src = "../../../../../assets/img/logo-sin-letras.png";
    doc.addImage(logo, 'PNG', ((_width/2)-30), (_height/2), 50, 60);

    autoTable(doc, {
      theme:'grid',
      styles:{fillColor: [209,231,221 ], },
      headStyles:{ fontStyle:'bold', fillColor:[13, 98, 94], textColor:'white', halign:'center', fontSize:12, cellPadding:2, font:'normal'},
      bodyStyles:{ font:'normal', fontSize:12},
      columnStyles: { 0: { halign:'left', fillColor:[13, 98, 94], textColor:'white'}, 1: { halign:'center', fillColor:[255,255,255], textColor:'black'}},
      margin:{top:50},
      //tableLineColor:{Color:200},
      head:[['','Datos']],
      body:[
        ['Expediente:',`${this.resultDocumento.numeroexpediente}`],
        ['Clave Web:',`${this.resultDocumento.clave_web}`],
        ['Fecha Recepción:',`${this.getFecha(this.resultDocumento.fec_recepcion)}`],
        ['Asunto:',`${this.resultDocumento.asunto}`],
        ['Remitente:',`${this.resultDocumento.remitente}`],
        ['N° Folios:',`${this.resultDocumento.folios}`],
        ['Domicilio:',`${this.resultDocumento.domicilio}`],
        [`${this.resultDocumento.tipoDocumento}:`,`${this.resultDocumento.nroDoc}`],
      ]
    });

    const hoy = new Date();
    const fileName = this.resultDocumento.numeroexpediente+'.pdf';
    doc.save(fileName);
  }

  // TODO AQUI MODAL OPEN Y CLOSE
  openModal() {
    var _modal:HTMLInputElement = (<HTMLInputElement>document.getElementById('myModal'));
    if(_modal!=null){ _modal.style.display = 'block' }
  }

  limpiarTodo(){
   this.formGroupSearch.reset()
   this.formGroupPersona.reset()
   this.formGroupEmpresa.reset()
   this.formGroupDoc.reset()

   this.formGroupSearch.get('tipoPersonaSea')?.setValue('');
   this.formGroupSearch.get('tipoDocumentoP')?.setValue('');

   this.formGroupDoc.get('idTipoDocumento')?.setValue('');
   this.formGroupDoc.get('idDestino')?.setValue('');


   this.fileTmpAnexo= [];
   this.fileTmpDoc= [];
   this.fileTmpAnexoSeleccion=[]
   this.fileTmpDocSeleccion=[]
   this.uploadedAnexoFiles=''
   this.uploadedDocumentoFiles=''

   var tipo_pe:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoPersonaSea'));
   var tipo_do:HTMLInputElement = (<HTMLInputElement>document.getElementById('tipoDocumentoP'));
   var nro_doc:HTMLInputElement = (<HTMLInputElement>document.getElementById('nroDocumento'));
   this.btnBuscar = true;
   tipo_pe.disabled = false;
   tipo_do.disabled = false;
   nro_doc.disabled = false;

  }

  closeModal() {
    var _modal:HTMLInputElement = (<HTMLInputElement>document.getElementById('myModal'));
    if(_modal!=null){ _modal.style.display = 'none' }
    this.limpiarTodo()
  }
 // TODO AQUI MODAL LOADING 
 openModalLoading() {
    var _modal:HTMLInputElement = (<HTMLInputElement>document.getElementById('myModalLoading'));
    if(_modal!=null){ _modal.style.display = 'block' }
  }
  closeModalLoading() {
      var _modal:HTMLInputElement = (<HTMLInputElement>document.getElementById('myModalLoading'));
      if(_modal!=null){ _modal.style.display = 'none' }
  }

  salirExpediente(){
    // console.log('CERRADO')
    this.router.navigateByUrl('')
    //this.closeModal()
  }

  backBtn(){
    // console.log('DELETE')
    // this.router.navigate(['/'])
    this.router.navigateByUrl('')
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

    return `${_diaMesNum}-${_mesNum}-${_year}`
  }

  // TODO METODO QUE RETORNA LA HORA 24 EXAMPLE 17:35
  getHora():String{
    const _fecha = new Date();
    const _hour = _fecha.getHours() // Hora de 0 a 23
    const _minutes = _fecha.getMinutes() // Minutos de 0 a 59
    const _seconds = _fecha.getSeconds() // Segundos de 0 a 59
    const _milliseconds = _fecha.getMilliseconds() // Milisegundos de 0 a 999
    let _horaNum:String
    let _minutoNum:String
    let _segundoNum:String
    let _milisegundoNum:String
    switch(_hour.toString().length){
      case 1: _horaNum=`0${_hour}`; break;
      case 2: _horaNum=`${_hour}`; break;
      default: _horaNum=''
    }
    
    switch(_minutes.toString().length){
      case 1: _minutoNum=`0${_minutes}`; break;
      case 2: _minutoNum=`${_minutes}`; break;
      default: _minutoNum=''
    }

    switch(_seconds.toString().length){
      case 1: _segundoNum=`0${_seconds}`; break;
      case 2: _segundoNum=`${_seconds}`; break;
      default: _segundoNum=''
    }

    switch(_milliseconds.toString().length){
      case 1: _milisegundoNum=`00${_seconds}`; break;
      case 2: _milisegundoNum=`0${_seconds}`; break;
      case 3: _milisegundoNum=`${_seconds}`; break;
      default: _milisegundoNum=''
    }
    return `${_horaNum}:${_minutoNum}`
  }


  // TODO PARA EL WIDTH AND HEIGHT DEL LOADING 
  @HostListener('window:resize', ['$event'])
  onWindowsResize(){
    this.getWidth=window.innerWidth
    this.getHeight=window.innerHeight
  }


}
