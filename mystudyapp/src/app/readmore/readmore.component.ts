import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserserviceService } from '../userservice.service';


@Component({
  selector: 'app-readmore',
  templateUrl: './readmore.component.html',
  styleUrls: ['./readmore.component.css']
})
export class ReadmoreComponent implements OnInit {

 
  
  constructor(private route: ActivatedRoute,private userservice : UserserviceService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.GetDetails(id);
   }
  Detail : any;
  ngOnInit() {
   
  }
  GetDetails(id){
    
    var res = this.userservice.getQuestiondetails(id);
    res.then(data => {
      console.log(data);
      this.Detail = data;
      this.Detail.flaggedmessages.question = atob(this.Detail.flaggedmessages.question);

    })
  }
}
