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

    // var _content:HTMLInputElement = (<HTMLInputElement>document.getElementById('transitionContent'));
    // _content.style.top = 'auto';
    // _content.classList.remove('fr-content-transition');
    // _content.classList.add('.fr-content-transition-v');

    if(this.getWidth<768){
      var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
      var _subMenuFoo:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenuFooter'));
      var _subContend:HTMLInputElement = (<HTMLInputElement>document.getElementById('subContend'));

      _subMenu.classList.add('d-none');
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



    }
  }


  
  @HostListener('window:resize', ['$event'])
  onWindowsResize(){
    this.getWidth=window.innerWidth
    this.getHeight=window.innerHeight
    // console.log(this.getWidth,this.getHeight)
    if(this.getWidth<768){
      var _subMenu:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenu'));
      var _subMenuFoo:HTMLInputElement = (<HTMLInputElement>document.getElementById('subMenuFooter'));
      var _subContend:HTMLInputElement = (<HTMLInputElement>document.getElementById('subContend'));
      _subMenu.classList.add('d-none');
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

    }
  }

}
