import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UploadpageComponent } from './uploadpage/uploadpage.component';
import { OutputpageComponent } from './outputpage/outputpage.component';
//import { MultiseriesChartComponent } from './chart/multiseries.chart.component';
//import { MultiseriesChartComponent } from './chart/multiseries.chart.component';
//declare module 'file-saver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'uploadpage' , component: UploadpageComponent},
  { path: 'outputpage' , component: OutputpageComponent},
  //{ path: 'multiseries-chart', component: MultiseriesChartComponent, title: "Angular Multi Series Chart" },
  { path: '**', component:HomeComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule 
{ }