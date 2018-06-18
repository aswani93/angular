import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../serverdet/data-model';
import { UsersService } from '../serverdet/users.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../serverdet/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  tokenKey:number = 0;
  error = '';
  statuserror = true;
  checkuser = [];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private fb : FormBuilder ,private usersService : UsersService, private _router: Router , private auth : AuthenticationService)  { 
    this.createLoginForm();
  }

  ngOnInit() {
  
  }
  createLoginForm(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required , Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required ,Validators.minLength(5)]],
      rememberme: ''
    });
  } 
  SignIn(){
    this.checkuser =this.usersService.getuser(this.loginForm.value.email,this.loginForm.value.password);
  if(this.checkuser[0].status == 'exist'){
      this.statuserror = true;
      this.auth.login(this.checkuser);
      console.log(localStorage)
      this._router.navigate(['/users']);
    }else{
      this.error = 'EmailId or Password is incorrect';
      this.statuserror = false;
    }
  }
}
