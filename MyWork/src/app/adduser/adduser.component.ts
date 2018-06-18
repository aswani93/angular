import { Component, OnInit } from '@angular/core';
import{ FormBuilder , FormGroup, Validators} from '@angular/forms';
import { UsersService } from '../serverdet/users.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  regform : FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  mobilepattern = /^\d*$/;
  error = false;
  errormsg = '';
  constructor(private fb: FormBuilder,private _service: UsersService,private _router : Router) { }

  ngOnInit() {
    this.createregform();
  }
  createregform(){
    this.regform = this.fb.group({
      name : ['',Validators.required],
      email: ['',[Validators.required,Validators.pattern(this.emailPattern)]],
      age:['',[Validators.required,Validators.pattern(this.mobilepattern)]],
      place:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(5)]],
      password_confirm:['',[Validators.required,Validators.minLength(5)]]
    });
  }
  submitRegform(){
    if(this._service.postuser(this.regform.value) === 1){
      this._router.navigate(['./users']);
      this.error = false;
      this.errormsg = '';
    }else{
      this.errormsg = 'Email Id already exist. please try again with another mailid';
      this.error = true;
    }
    
   
  }
}
