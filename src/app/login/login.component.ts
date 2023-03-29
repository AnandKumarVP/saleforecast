import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// Working method 0
// import { SharedService } from '../shared.service';

// Working method 0
// @Injectable({
//   providedIn: 'root'
// })
//   MatSnackBar
// } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent /*implements OnInit*/
{
  formdata = {email:"",password:""};
  submit=false;
  loading=false;
  errorMessage="";
  response!: string;
  //res2:any;
  
  constructor(private http: HttpClient,/* Working method 0 private sharedService: SharedService,*/private router: Router,private auth:AuthService) { }

  email = new FormControl('', [Validators.required, Validators.email]);
  
  log!:string;
  
  user = {
    email: '',
    password: ''
  };
  
  ngOnInit(): void {
    this.auth.canAuthenticate();
  }

  /*try
  
  USERINFO: {[key: string]: string} = {
    "John": '12345a',
    "Jane": '12345b',
    "Bob": '12345c'
  };*/
  
  /*try
  check()
  { 
    const username=this.user.email;
    const password=this.user.password;

    if(username in this.USERINFO)
    {
      if(password == this.USERINFO[username])
      {
        return true;
        
      }
    } 
    return false;
  }
  public LoggedIn: boolean = false;*/
 

  onloginsuccess() {
      const data = {username: this.user.email, password: this.user.password};
      this.http.post('http://127.0.0.1:5000/api/login', data).subscribe(
        (response: any) => {
          this.response=response.message;
          if(response.message=='Logged in successfully')
          {
            // Working method 0
            // this.sharedService.setIsLoggedIn(true);
            this.auth.storeToken(response.username);
            console.log('logged user token is '+this.user.email);
            this.auth.canAuthenticate();
            this.router.navigate(['/home']);
            this.response=response.message;
          }
          else{
            this.response=response.message;

          }
      
          
        },
        (error: any) => {
          
          this.response = error.message;
  
        }
        
      );
        
     /*try
      console.log(this.user);  
       if(this.check()==true)
       {
        alert('APPROVE');
        //this.router.navigate{["uploadpage"]};
        //this.router.navigate{[/uploadpage.html]};
        this.auth.canAuthenticate();
        
       }
       else{
        alert('NOT VALID0');
        this.errorMessage = "Invalid Credentials!";
       }*/
  }

}

