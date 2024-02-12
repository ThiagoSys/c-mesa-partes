import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.css']
})
export class VideoplayerComponent  {


  @ViewChild('videoElement') videoElement!: ElementRef;

  play:string = "Play";


  @Input() funcionExterna!: Function;
  @Input() valorDesdePadre!: string;

  cerrarModal() {
      this.funcionExterna();
      this.play = "Play"
      this.restartVideo();
  }


  changeImg(){
    if(this.play == "Play"){
      this.play = "Pause",
      this.playVideo()
    } else {
      this.play = "Play",
      this.pauseVideo()
    }
  }

  async playVideo() {
    this.videoElement.nativeElement.play();
  }

  async pauseVideo() {
    this.videoElement.nativeElement.pause();
  }

  async restartVideo() {
    if (this.videoElement) {
      const video = this.videoElement.nativeElement;
      video.pause();
      video.currentTime = 0; // Establece el tiempo actual en 0 (reinicia el video)
      // video.load(); // Vuelve a cargar el video desde el principio
      // video.play(); // Comienza a reproducir el video
    }
  }

  increaseVolume() {
    if (this.videoElement) {
      if (this.videoElement.nativeElement.volume < 1) {
        this.videoElement.nativeElement.volume += 0.1; // Aumenta el volumen en 0.1 (10%)
        // console.log(this.videoElement.nativeElement.volume)
      }
    }
  }

  decreaseVolume() {
    if (this.videoElement) {
      if (this.videoElement.nativeElement.volume > 0) {
        this.videoElement.nativeElement.volume -= 0.1; // Disminuye el volumen en 0.1 (10%)
        // console.log(this.videoElement.nativeElement.volume)
      }
    }
  }
}
