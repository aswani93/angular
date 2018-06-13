import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../serverdet/data-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  constructor(private fb : FormBuilder) { 
    this.createLoginForm();
  }

  ngOnInit() {
  }
  createLoginForm(){
    this.loginForm = this.fb.group({
      email:['', Validators.required],
      password: ['', Validators.required],
      rememberme: ['', Validators.required]
    });
  } 
}
