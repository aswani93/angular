import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-projectmodal',
  templateUrl: './projectmodal.component.html',
  styleUrls: ['./projectmodal.component.css']
})
export class ProjectmodalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProjectmodalComponent>) {
    
        }

  ngOnInit() {
  }

}
