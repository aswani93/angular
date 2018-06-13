import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import {MatIconModule} from '@angular/material/icon';

import { MatMenuModule } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';





@NgModule({
  imports: [MatInputModule,MatCheckboxModule,MatButtonModule,MatToolbarModule,MatIconModule,MatMenuModule,MatListModule,MatTableModule,MatSortModule,MatCardModule,MatExpansionModule,MatChipsModule,MatDialogModule],
  exports: [MatInputModule,MatCheckboxModule,MatButtonModule,MatToolbarModule,MatIconModule,MatMenuModule,MatListModule,MatTableModule,MatSortModule,MatCardModule,MatExpansionModule,MatChipsModule,MatDialogModule],
})
export class MaterialModule { }