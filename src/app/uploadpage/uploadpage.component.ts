import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uploadpage',
  templateUrl: './uploadpage.component.html',
  styleUrls: ['./uploadpage.component.css']
})
export class UploadpageComponent 
{
  selectedItem!: string;
  dropdownItems: string[] = ['Daily', 'Weekly', 'Monthly'];

  response:any;
  response1:any;
  selectedFile!: File | null;
  constructor(private auth:AuthService,private http: HttpClient) { }

  ngOnInit(): void {
    this.auth.canAccess();
    if (this.auth.isAuthenticated()) 
    {
      this.response=this.auth.detail();
    }
  }
  
  user = {
    file: '',
    selectedItem: '',
    count:''
  };

  onFileSelected(event:Event){
    this.selectedFile=(event.target as HTMLInputElement).files?.[0]??null;
  }

  
  onSubmit() {

    if(!this.selectedFile){
      return;
      }
    const formData = new FormData();
    formData.append('file', this.selectedFile,this.selectedFile.name);
    formData.append('periodicity', this.user.selectedItem);
    formData.append('duration', this.user.count.toString());
    
    console.log(this.selectedFile.name)
    console.log(this.user.selectedItem)
    console.log(this.user.count)

    this.http.post('http://127.0.0.1:5000/api/upload',formData).subscribe(
      (response:any) =>
       {
        this.response1=response.message;
        alert('Upload successful!');
      },
      (error) => {
        console.log(error);
        alert('Upload failed!');
      }
    );
  }
}


