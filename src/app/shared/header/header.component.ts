import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/models/profile';
import { User } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';
import { MessageService } from 'src/app/services/message.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  private linktTheme = document.querySelector('.dark');// se comunica el id pulsado


  userprofile!: any;
  user: any;
  error: string;
  userid:any;
  profile: Profile;

  constructor(
    private usuarioService: UserService,
    private router: Router,
    private authServce: AuthService,
    private profileService: ProfileService,
    ) {
      this.user = authServce.getLocalStorage();
    }



  ngOnInit() {
    // this.getUserServer();
    if (localStorage.getItem('dark')) {
      this.darkmode('dark');
    }

    if(!this.user || !this.user.uid || this.user.uid == null || this.user.uid == undefined){
      this.router.navigateByUrl('/login');
    }else{
      this.userid = this.user.uid;
      this.getProfileUser()
    }

  }


  getProfileUser(){
    this.profileService.listarUsuario(this.userid).subscribe(
      (resp:any) =>{
        this.profile = resp;
      }
    );
    
  }

  openModal(){

    var modalcart = document.getElementsByClassName("dropdown-menu");
      for (var i = 0; i<modalcart.length; i++) {
         modalcart[i].classList.toggle("show");
      }
  }


  openMenu(){
    var menuLateral = document.getElementsByClassName("mini-sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.toggle("show-sidebar");
      }
  }

  logout(){
    this.authServce.logout();
  }

  darkmode(dark:string){
    let body = document.querySelector('body');
    let header = document.querySelector('header');
    let aside = document.querySelector('aside');

    const classExists = document.getElementsByClassName(
      'dark'
     ).length > 0;

    var dayNight = document.getElementsByClassName("dayNight");
      for (var i = 0; i<dayNight.length; i++) {
        dayNight[i].classList.toggle("active");
        body.classList.toggle('dark');
        header.classList.toggle('dark');
        aside.classList.toggle('dark');

      }
      // localStorage.setItem('dark', dark);

      if (classExists) {
        localStorage.removeItem('dark');
        // console.log('✅ class exists on page, removido');
      } else {
        localStorage.setItem('dark', dark);
        // console.log('⛔️ class does NOT exist on page, agregado');
      }
      // console.log('Pulsado');
  }


}
