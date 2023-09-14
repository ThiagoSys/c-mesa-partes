import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public getWidth:any;
  public getHeight:any;

  constructor(){}

  ngOnInit() {
    this.getWidth = window.innerWidth
    this.getHeight = window.innerHeight

    if(this.getWidth<768){
      var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
      var _subMenuFoo:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenuFooter'));
      var _subContend:HTMLInputElement = (<HTMLInputElement>document.getElementById('subContend'));

      _subMenu.classList.add('d-none');
      _subMenu.classList.remove('d-flex');
      _subMenu.classList.remove('justify-content-center');
      _subMenu.classList.remove('align-items-center');
      _subMenuFoo.classList.remove('d-none');

      _subContend.classList.remove('h-100');
      _subContend.classList.add('h-75');
    } else{
      var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
      var _subMenuFoo:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenuFooter'));
      var _subContend:HTMLInputElement = (<HTMLInputElement>document.getElementById('subContend'));

      _subMenu.classList.remove('d-none');
      _subMenuFoo.classList.add('d-none');

      _subContend.classList.add('h-100');
      _subContend.classList.remove('h-75');

      this.scrollcenter(this.getHeight)
    }

  }

  scrollcenter(valHeight:number){
    var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
    if(valHeight<610){
      _subMenu.classList.remove('d-flex');
      _subMenu.classList.remove('justify-content-center');
      _subMenu.classList.remove('align-items-center');
    } else{
      _subMenu.classList.add('d-flex');
      _subMenu.classList.add('justify-content-center');
      _subMenu.classList.add('align-items-center');
    }
  }


  
  @HostListener('window:resize', ['$event'])
  onWindowsResize(){
    this.getWidth=window.innerWidth
    this.getHeight=window.innerHeight
    if(this.getWidth<768){
      var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
      var _subMenuFoo:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenuFooter'));
      var _subContend:HTMLInputElement = (<HTMLInputElement>document.getElementById('subContend'));
      _subMenu.classList.add('d-none');
      _subMenu.classList.remove('d-flex');
      _subMenu.classList.remove('justify-content-center');
      _subMenu.classList.remove('align-items-center');
      _subMenuFoo.classList.remove('d-none');

      _subContend.classList.remove('h-100');
      _subContend.classList.add('h-75');
    } else{
      var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
      var _subMenuFoo:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenuFooter'));
      var _subContend:HTMLInputElement = (<HTMLInputElement>document.getElementById('subContend'));

      _subMenu.classList.remove('d-none');
      _subMenuFoo.classList.add('d-none');

      _subContend.classList.add('h-100');
      _subContend.classList.remove('h-75');
      this.scrollcenter(this.getHeight)
    }

  }

}
