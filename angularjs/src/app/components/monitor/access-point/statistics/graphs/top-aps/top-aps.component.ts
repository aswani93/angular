import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { WebserviceService } from '../../../../../../services/commonServices/webservice.service';

@Component({
  selector: 'app-top-aps',
  templateUrl: './top-aps.component.html',
  styleUrls: ['./top-aps.component.css']
})
export class TopApsComponent implements OnInit {

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
        title: {
            text: '(Mb/s)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 200
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
          marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        }
    },

    series: [{
        name: 'AP 1',
        data: [100, 235, 102, 336, 425, 300, 256, 400],
        color: '#00c5dc'
    }, {
        name: 'AP 2',
        data: [253, 125, 100, 125, 365, 400, 523, 600],
        color: '#ffb822'
    }, {
        name: 'AP 3',
        data: [321, 125, 215, 356, 256, 156, 348, 400],
        color: '#f4516c'
    }, {
        name: 'AP 4',
        data: [512, 425, 326, 456, 236, 154, 235, 356],
        color: '#716aca'
    }, {
        name: 'AP 5',
        data: [356, 256, 365, 526, 458, 256, 365, 564],
        color: '#34bfa3'
    }]
  });
  }

}
