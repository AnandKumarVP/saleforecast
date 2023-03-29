import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UploadpageComponent } from './uploadpage/uploadpage.component';
import { OutputpageComponent } from './outputpage/outputpage.component';


import { FormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule} from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';

import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
 

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'uploadpage' , component: UploadpageComponent},
  { path: 'outputpage' , component: OutputpageComponent},
  { path: '**', component:HomeComponent}]
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    UploadpageComponent,
    OutputpageComponent,
    CanvasJSChart
  ],
  imports: [
    BrowserModule,FormsModule,
    AppRoutingModule,HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
