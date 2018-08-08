import { Component, OnInit, ElementRef, Input , OnChanges, SimpleChange,Output,EventEmitter} from '@angular/core';
import { Chart } from 'angular-highcharts';
import { WebserviceService } from '../../../../../../services/commonServices/webservice.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-ap-client-distribution',
  templateUrl: './ap-client-distribution.component.html',
  styleUrls: ['./ap-client-distribution.component.css']
})
export class ApClientDistributionComponent implements OnInit {
  public chart: Chart;
  constructor() { }

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        type: 'column'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 1
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
             marker : {symbol : 'square'},
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        },
        line: {
            marker: {
                enabled: false
            }
        }
    },

    series: [{
        name: 'Windows',
        data: [1, 2, 1, 3, 4, 3, 2, 4],
       
        color: '#44b2d7'
    }, {
        name: 'Mac',
        data: [2, 1, 3, 1, 3, 4, 5, 6],
       
        color: '#ffb822'
    }, {
        name: 'iOS',
        data: [3, 1, 2, 3, 2, 1, 3, 4],
       
        color: '#f4516c'
    }, {
        name: 'Android',
        data: [5, 4, 3, 4, 2, 1, 2, 3],
       
        color: '#34bfa3'
    }, {
        name: 'Linux',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
       
        color: '#fa8c53'
    }, {
        name: 'Others',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
       
        color: '#bcc0c7'
    }, {
        name: 'Total Clients',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        color: '#716aca'
    }]

   

    });
  }
  
}
