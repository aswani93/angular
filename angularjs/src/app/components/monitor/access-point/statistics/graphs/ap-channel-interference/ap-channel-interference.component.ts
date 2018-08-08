import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { WebserviceService } from '../../../../../../services/commonServices/webservice.service';

@Component({
  selector: 'app-ap-channel-interference',
  templateUrl: './ap-channel-interference.component.html',
  styleUrls: ['./ap-channel-interference.component.css']
})
export class ApChannelInterferenceComponent implements OnInit {
  public chart: Chart;
  constructor() { }

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        type: 'line'
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
    min: 0, 
    showLastLabel:false,
        title: {
            text: 'Amplitude (dBm)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 1
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        symbolWidth: 5,
        enabled: false
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
        name: 'SSID 1',
        data: [1, 2, 1, 3, 4, 3, 2, 4],
        color: '#44b2d7'
    }, {
        name: 'SSID 2',
        data: [2, 1, 3, 1, 3, 4, 5, 6],
        color: '#ffb822'
    }, {
        name: 'SSID 5',
        data: [3, 1, 2, 3, 2, 1, 3, 4],
        color: '#f4516c'
    }, {
        name: 'SSID 3',
        data: [5, 4, 3, 4, 2, 1, 2, 3],
        color: '#34bfa3'
    }, {
        name: 'SSID 4',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        color: '#fa8c53'
    }, {
        name: 'SSID 6',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        color: '#716aca'
    }]
    });
  }

}
