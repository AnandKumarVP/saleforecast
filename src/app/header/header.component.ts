import { ImplicitReceiver } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
// Working method 0
//import { SharedService } from '../shared.service';

// Working method 0
// @Injectable({
//   providedIn: 'root'
// })

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public auth:AuthService) {}
  logout(){
    //remove token
    this.auth.removeToken();
    this.auth.canAccess();
  // Working method 0
  // isLoggedIn = false;
  // constructor(public auth:AuthService,private sharedService: SharedService) {}
  // ngOnInit() 
  // {
  //   this.sharedService.getIsLoggedIn().subscribe(value => {
  //     this.isLoggedIn = value;
  //   });
    
    // logout()
    // {
    //   this.isLoggedIn = false;
    // }
  //}
  
}
  
}

function logout() {
  throw new Error('Function not implemented.');
}
/*{ tired file
  LoggedIn=false;
  Loggedout=true;
  receivedData: string | undefined;

  constructor(private data: LoginComponent) { }

  ngOnInit() {
    this.receivedData = this.data.log;
    console.log(this.receivedData);
    if( this.receivedData=='ak')
      {
        this.LoggedIn=false;
        this.Loggedout=true;
      }
    else
    {
        this.LoggedIn=true;
        this.Loggedout=false;

    }
      
  }
}*/
  

