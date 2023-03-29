import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { saveAs } from 'file-saver';
// import { CsvRow } from './csv-row';

// @ts-ignore
interface CsvData {
  date: string;
  output: string;
}


@Component({
  selector: 'app-outputpage',
  templateUrl: './outputpage.component.html',
  styleUrls: ['./outputpage.component.css']
})

export class OutputpageComponent{
  
  constructor(private http: HttpClient,private authservice:AuthService) {}

    downloadFile() {
      const headers = new HttpHeaders().set('Accept', 'application/pdf'); // Set the MIME type of the file you want to download
      this.http.get('http://127.0.0.1:5000/api/download', { headers, responseType: 'blob' }).subscribe(blob => {
        saveAs(blob, 'file.csv'); // Replace with the name you want to give the downloaded file
      });
    }
    
    

   

  
}

