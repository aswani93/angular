import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { WebserviceService } from '../../../../../../services/commonServices/webservice.service';

@Component({
  selector: 'app-ap-model',
  templateUrl: './ap-model.component.html',
  styleUrls: ['./ap-model.component.css']
})
export class ApModelComponent implements OnInit {

  public chart: Chart;
  constructor() { }

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Total APs<br>2000',
        align: 'center',
        verticalAlign: 'middle',
        y: 0,
        style: {
            color: '#7f79cf',
            fontWeight: 'bold'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50
            },
            center: ['50%', '50%'],
            shadow: false,
            borderWidth: 0
        }
    },
    series: [{
        type: 'pie',
        name: 'Total Clients',
        innerSize: '70%',
        data: [
            {
                name: 'Model A (500)',
                y: 40.33,
                color: '#44b2d7',
                dataLabels: {
                    distance: 30,
                    color: '#44b2d7'
                }
            }, {
                name: 'Model B (400)',
                y: 30.03,
                color: '#ffb822',
                dataLabels: {
                    distance: 30,
                    color: '#ffb822'
                }
            }, {
                name: 'Model C (350)',
                y: 4.77,
                color: '#34bfa3',
                dataLabels: {
                    distance: 30,
                    color: '#34bfa3'
                }
            }, {
                name: 'Model D (350)',
                y: 6.91,
                color: '#f4516c',
                dataLabels: {
                    distance: 30,
                    color: '#f4516c'
                }
            }, {
                name: 'Model E (250)',
                y: 5.91,
                color: '#fa8c53',
                dataLabels: {
                    distance: 30,
                    color: '#fa8c53'
                }
            }, {
                name: 'Model F (150)',
                y: 10.38,
                color: '#bcbfc7',
                dataLabels: {
                    distance: 30,
                    color: '#bcbfc7'
                }
            }
        ]
    }]
  });
  }

}
