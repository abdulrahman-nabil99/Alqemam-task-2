import { Component} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone :true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  lang:string = "en"
  constructor(private translateService:TranslateService){
    this.lang = localStorage.getItem("lang") ?? "en"
    translateService.use(this.lang)
    translateService.onLangChange.subscribe(res=>{
      this.lang = res.lang
    })
  }

  changeLang(langCode:string){
    this.translateService.use(langCode)
    localStorage.setItem('lang',langCode)
  }

}