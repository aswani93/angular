import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../serverdet/data-model';
import { UsersService } from '../serverdet/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private fb : FormBuilder ,private usersService: UsersService)  { 
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
   this.usersService.getuser(this.loginForm.value.email,this.loginForm.value.password);
    console.log(this.loginForm.value.email,this.loginForm.value.password);
  }
}
