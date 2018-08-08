import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators, FormControl } from '@angular/forms';
import {UserserviceService } from '../userservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username : new FormControl(),
    password : new FormControl()
  })
  error = 0;
  user = {};
  constructor(private fb : FormBuilder,private service :UserserviceService,private router: Router) { 
    this.createloginForm();
  }

  ngOnInit() {
  }
  createloginForm(){
    this.loginForm = this.fb.group({
      username : ['', Validators.required],
      password: ['',[Validators.required,Validators.minLength(5)]]
    })
  }

  submitForm(){
    console.log(this.loginForm.value.username);
    this.user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
   // console.log(this.user);
  var response =  this.service.checkLogin(this.user);
  response.then(res =>{
    if(res.login.status == 1){
     
      this.error = 0;
      localStorage.setItem('currentuser', JSON.stringify({userid : res.login.user_id}));
      this.router.navigate(['/list']); 
    }else{
      this.error = 1;
    }
  })
  }
}
