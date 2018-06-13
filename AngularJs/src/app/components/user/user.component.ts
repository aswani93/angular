import { Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AuthenticationService } from '../../services/authentication.service';
import {UserService } from '../../services/user.service';
import {MediaChange, ObservableMedia} from "@angular/flex-layout";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  watcher: Subscription;
  activeMediaQuery = "";
  mode : any;
  displayedColumns : any;
  mobileMode :boolean;
  isError: boolean = false;
  errMsg : string;
  dataSource ;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private UserService: UserService,
    private media: ObservableMedia) {

      this.watcher = media.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
        this.mode = change.mqAlias;
        if(this.mode == 'xs'){
          this.displayedColumns = ['name', 'mob'];
          this.mobileMode =true;
        }else{
          this.displayedColumns = ['name', 'designation','techgroup','department', 'location', 'mob', 'emp_id'];
          this.mobileMode =false;
        }
      });
     }
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  panelOpenState: boolean = false;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    
  
  
  }

  
    userDetail()
    {
      this.router.navigate(['userDetail']);
    }
    ngOnInit(): void {
      this.loadData();
      }
      loadData(){
      let details;
      this.UserService.users().then(_data =>{
      if(_data){
        this.dataSource = new MatTableDataSource(_data['data']);
        this.dataSource.sort = this.sort;
      }
  
      });
    
      }
  
}

export interface Element {
  name: string;
  designation: string;
  department: string;
  techgroup: string;
  location: string;
  phone: number;
  _id: string;
}
// const ELEMENT_DATA: Element[] = [ {name: 'Vishnu R', designation: 'Sr Engineer (SW)', techgroup: 'Cloud - Frontend', department: 'Engineering - Software', location: 'Kochi',mob: 9544624762,emp_id:'VVDN/1963'} ,

// {name: 'Aadi Varyani', designation: 'Engineer (TA)  ', techgroup: ' Manual  ', department: 'Engineering - QA ', location: 'Gurgaon  ',mob:  9953357484 ,emp_id:' VVDN/762  '},


// {name: 'Aamish Ahmed', designation: 'Engineer (Mech)   ', techgroup: ' Mechanical Design', department: 'Engineering - Mechanical ', location: 'Gurgaon  ',mob:  8171283993,emp_id:' VVDN/734    '},

// {name: 'Aatish Mittal ', designation: 'Sr Engineer (TA) ', techgroup: 'Manual ', department: 'Engineering - QA ', location: 'Kochi',mob: 8447340284  ,emp_id:'VVDN/426'} ,

// {name: 'Abhishek Kumar Singh A', designation: 'Engineer (SW)   ', techgroup: 'Mobility - Android ', department: 'Engineering - Software  ', location: 'Gurgaon  ',mob:  8795298337,emp_id:' VVDN/1584'},


// {name: 'Aman Gupta', designation: 'Sr Engineer (SW)   ', techgroup: 'Mobility - iOS ', department: 'Engineering - Software  ', location: 'Noida ',mob:  8171283993,emp_id:' VVDN/1379'},

// {name: 'Amit Singh Chauhan ', designation: 'Web Designer', techgroup: 'web designer ', department: 'Engineering - Software', location: 'Noida ',mob: 9454805103,emp_id:'VVDN/1267'} ,

// {name: 'Arun P M ', designation: 'Sr Engineer (SW)  ', techgroup: 'Embedded SW ', department: 'Engineering - Software  ', location: 'Kochi',mob:  9447718260,emp_id:' VVDN/585'},


// {name: 'Astha Pandey', designation: 'Engineer (HW)   ', techgroup: 'Hardware Design', department: 'Engineering - Hardware ', location: 'Gurgaon  ',mob:  9643199265,emp_id:' VVDN/993'},

// {name: 'Behin A ', designation: ' Engineer (VLSI)', techgroup: 'Design ', department: 'Engineering - FPGA ', location: 'Kochi',mob: 8447340284  ,emp_id:'VVDN/1725'} ,

// {name: 'Beuny C Mathews ', designation: 'Engineer (SW)   ', techgroup: 'Embedded SW ', department: 'Engineering - Software  ', location: 'Kochi',mob:  8795298337,emp_id:' VVDN/1189'},


// {name: 'Bibin Balachandran', designation: 'Sr Engineer (SW)   ', techgroup: 'Embedded SW ', department: 'Engineering - Software  ', location: 'Noida ',mob:  8171283993,emp_id:' VVDN/316'}
// ];