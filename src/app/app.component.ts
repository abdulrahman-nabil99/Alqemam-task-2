import { Component, OnDestroy, OnInit} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './_services/loader.service';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone :true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title ="alqemam-task-2"
  lang:string = "en"
  isLoading:boolean = false;
  private subs = new Subscription();

  constructor(
    private translateService:TranslateService,
    private loaderService: LoaderService){
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem("lang") ?? "en"
    this.translateService.use(this.lang)
    this.subs.add(
      this.translateService.onLangChange.subscribe(res=>{
        this.lang = res.lang
      })
    )
    this.subs.add(
      this.loaderService.isLoading$.subscribe(res=>{
        this.isLoading=res
      })
    )
  }

  
  changeLang(langCode:string){
    this.translateService.use(langCode)
    localStorage.setItem('lang',langCode)
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

}