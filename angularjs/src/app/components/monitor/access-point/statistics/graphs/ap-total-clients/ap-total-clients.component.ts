import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { WebserviceService } from '../../../../../../services/commonServices/webservice.service';

@Component({
  selector: 'app-ap-total-clients',
  templateUrl: './ap-total-clients.component.html',
  styleUrls: ['./ap-total-clients.component.css']
})
export class ApTotalClientsComponent implements OnInit {

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
        text: 'Total Clients<br>2000',
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
                name: 'Windows',
                y: 40.33,
                color: '#44b2d7',
                dataLabels: {
                    distance: 30,
                    color: '#44b2d7'
                }
            }, {
                name: 'Mac',
                y: 30.03,
                color: '#ffb822',
                dataLabels: {
                    distance: 30,
                    color: '#ffb822'
                }
            }, {
                name: 'Others',
                y: 10.38,
                color: '#bcbfc7',
                dataLabels: {
                    distance: 30,
                    color: '#bcbfc7'
                }
            }, {
                name: 'Android',
                y: 4.77,
                color: '#34bfa3',
                dataLabels: {
                    distance: 30,
                    color: '#34bfa3'
                }
            }, {
                name: 'iOS',
                y: 6.91,
                color: '#f4516c',
                dataLabels: {
                    distance: 30,
                    color: '#f4516c'
                }
            }, {
                name: 'Linux',
                y: 5.91,
                color: '#fa8c53',
                dataLabels: {
                    distance: 30,
                    color: '#fa8c53'
                }
            }
        ]
    }]
    });
  }

}
