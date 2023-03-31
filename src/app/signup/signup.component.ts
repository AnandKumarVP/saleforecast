import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { SharedService } from '../shared.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signup=new FormGroup({
    userid:new FormControl('',Validators.required) && 
           new FormControl('',Validators.minLength(5)) && 
           new FormControl('',Validators.maxLength(15)),

    useremail:new FormControl('',Validators.required) && 
              new FormControl('bad@', Validators.email),

    userpassword:new FormControl('',Validators.required) && 
                 new FormControl('',Validators.minLength(8)) && 
                 new FormControl('',Validators.maxLength(20))
  })

  get userid()
  {
    return this.signup.get('userid')
  }
  
  get useremail()
  {
    return this.signup.get('useremail')
  }

  get userpassword()
  {
    return this.signup.get('userpassword')
  }

  

  user = {
    name:'',
    email: '',
    password: ''
  };
 
  constructor(private http: HttpClient,/*private sharedService: SharedService,*/private router: Router,private auth:AuthService) { }
  
  response:any;

  ngOnInit(): void {
    this.auth.canAuthenticate();
  }

  onSubmit()
  {
    console.warn(this.signup.value)
    console.log(this.user);
    const data = {username: this.user.name, email: this.user.email, password: this.user.password};
      this.http.post('http://127.0.0.1:5000/api/register', data).subscribe(
        (response: any) => 
        {
              this.response=response.message;
            if(response.message=='User Name already exists' || response.message=='User Email already exists')
            {
              this.response=response.message;
            }
            else
            {
              alert("' "+this.user.name +"' Sign form submitted successfully sign after a minute");
              this.router.navigate(['/login']);
            }
        },
        (error: any) => {
          
          this.response = error.message;
          //return  this.log=false;
        }
        
      );
  }

  
}
