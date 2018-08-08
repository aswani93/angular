// upToolTip components for serving the tooltip on click.


import {Component, Input, OnInit} from '@angular/core';
import {TooltipService} from '../services/tooltip/tooltip.service';

@Component({
  selector: 'app-right-tooltip',
  templateUrl: './righttooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class RightTooltipComponent implements OnInit {

  // this variable will serve as input parameter from other components, hence we can bind it form other components.
  @Input() toolTipText: string;

  constructor(private toolTip: TooltipService) { }

  ngOnInit() { }

  getData() {
    return this.toolTipText;
  }

}

