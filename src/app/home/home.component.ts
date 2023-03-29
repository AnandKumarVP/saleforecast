import { Component, OnInit} from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  response:any;
  constructor(private auth:AuthService) { }
  user = {localId:"someid",displayName:"somename"};
  ngOnInit(): void {
    this.auth.canAccess();
    if (this.auth.isAuthenticated()) 
    {
      this.response=this.auth.detail();
    }
  }
}
