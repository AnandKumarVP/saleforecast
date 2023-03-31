import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { saveAs } from 'file-saver';
import * as prediction from '../../assets/new.json';
import * as actual from '../../assets/old.json';

@Component({
  selector: 'app-outputpage',
  templateUrl: './outputpage.component.html',
  styleUrls: ['./outputpage.component.css']
})

export class OutputpageComponent implements OnInit{
  

  dps: any[] = [];
  dps1: any[] = [];

  response!: string | null;


  constructor(private http: HttpClient,private auth:AuthService) {}

  ngOnInit() {

	this.auth.canAccess();
    if (this.auth.isAuthenticated()) 
    {
      this.response=this.auth.detail();
    }

    let data1 = prediction;
    for(let i = 0; i < data1.length; i++){
      this.dps.push({x: new Date(data1[i].date), y: Number(data1[i].prediction)});
    }
	let data2 = actual;
    for(let j = 0; j < data2.length; j++){
      this.dps1.push({x: new Date(data2[j].date), y: Number(data2[j].sales)});
    }
  }

  
 
  


  

        downloadFile()
		{
			{
				const headers = new HttpHeaders().set('Accept', 'application/pdf'); // Set the MIME type of the file you want to download
				this.http.get('http://127.0.0.1:5000/api/download1', { headers, responseType: 'blob' }).subscribe(blob => {
					saveAs(blob, 'Predicted.csv'); // Replace with the name you want to give the downloaded file
				});
			}
			
			{
				const headers = new HttpHeaders().set('Accept', 'application/pdf'); // Set the MIME type of the file you want to download
				this.http.get('http://127.0.0.1:5000/api/download2', { headers, responseType: 'blob' }).subscribe(blob => {
					saveAs(blob, 'Actual.csv'); // Replace with the name you want to give the downloaded file
				});
			}
		}
  chart: any;
	chartOptions = {
	  animationEnabled: true,
	  theme: "light2",
	  title:{
		text: "Actual vs Projected Sales"
	  },
	  axisX:{
		valueFormatString: "DD MMM YYYY"
	  },
	  axisY: {
		title: "Number of Sales"
	  },
	  toolTip: {
		shared: true
	  },
	  legend: {
		cursor: "pointer",
		itemclick: function (e: any) {
			if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
				e.dataSeries.visible = false;
			} else {
				e.dataSeries.visible = true;
			} 
			e.chart.render();
		}
	  },
	  data: [{
		type: "line",
		showInLegend: true,
		name: "Projected Sales",
		xValueFormatString: "MMM DD, YYYY",
		dataPoints: this.dps
	  }, {
		type: "line",
		showInLegend: true,
		xValueFormatString: "MMM DD, YYYY",
		name: "Actual Sales",
		dataPoints: this.dps1
	  }]
	}	
                       




}