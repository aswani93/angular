import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AuthenticationService } from '../../services/authentication.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model : any={};
  title = 'app';
  isError: boolean = false;
  errMsg : string;
  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }
  loginResource() {
 
 
    // this.authenticationService.login(this.model.username, this.model.password)
    // .subscribe((data: any) => {
    //   if(data.token)
    //   {
    //     this.router.navigate(['user']);
    //   }
    //   else
    //   {

    //   }
    //         console.log('Successfully signed up', data.token);
    // });
    this.authenticationService.login(this.model.username, this.model.password).then((sucess)=>{
      localStorage.setItem('token',sucess.token);
      console.log(sucess.token);
      this.router.navigate(['user']);
      console.log('Successfully signed up',this.authenticationService.getToken);
     },(error)=>{
       this.isError = true;
       this.errMsg = 'Something went wrong, please try again.'
     });
     

}

  matcher = new MyErrorStateMatcher();
  ngOnInit() {
  }
  

}
