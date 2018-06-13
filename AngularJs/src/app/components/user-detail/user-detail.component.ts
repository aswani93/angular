import { Component, OnInit,Inject } from '@angular/core';
import { Chart } from 'angular-highcharts';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})


export class UserDetailComponent implements OnInit {

  constructor(public dialog: MatDialog) {}
  
    openDialog() {
      this.dialog.open(DialogData, {
        data: {
          animal: 'panda'
        }
      });
    }
  chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['HTML', 'CSS', 'Javascript', 'Angular Js', 'Node Js', 'PHP', 'Python', 'Android', 'IOS', 'React Js', 'Perl', 'C++']
  },
  yAxis: {
      title: {
          text: 'Perfomance'
      }
  },
    series: [{
      name: 'Skils',
      data: [10, 10, 9, 10, 5, 9,0, 0]
  
    }]
  });
  ngOnInit() {
  }
  

}
@Component({
  selector: 'app-projectmodal',
  templateUrl: '../modals/projectmodal/projectmodal.component.html',
})
export class DialogData {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}