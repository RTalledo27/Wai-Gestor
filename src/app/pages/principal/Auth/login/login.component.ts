import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../mat-angular/alert/alert.component';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  durationInSeconds: number = 5;
  formGroup: FormGroup;
  errorMessage= signal('  ');
  error = null;
  constructor(private fb: FormBuilder, private loginService: LoginService,  private router: Router, private tokenService: TokenService,private authService: AuthService, private _snackBar: MatSnackBar) {
  
      this.formGroup = this.fb.group({
      correo_empleado: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }



  onSubmit() {
   if (this.formGroup.valid) {
    const correo_empleado = this.formGroup.get('correo_empleado')?.value;
    const password = this.formGroup.get('password')?.value;
      this.loginService.login(correo_empleado,password)
      .subscribe(
        (data) => {
          if(data){
            this.openSnackBar("Bienvenido a tu sistema de gestión de proyectos🚀");
            this.handleResponse(data);
          
          }
          //this.router.navigate(['/principal']);
        },
        (error) => {
          this.errorMessage.set(error.message);
          this.openSnackBar(error.message);
       
        }
       
      );
       
    
   }

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authStatus(  );
  }

  handleError(error: any) {
    this.error = error;
  }
  handleResponse(data: any) {
  console.log(data.access_token);
  this.tokenService.handle(data.access_token);
  this.authService.changeAuthStatus(true);
  this.router.navigateByUrl('/');
  }

  openSnackBar(message: string) {
   this._snackBar.openFromComponent(AlertComponent, {
      data: {message: message},
      duration: this.durationInSeconds * 1000,
    });
  }


  authStatus(){
    this.authService.authStatus.subscribe(isLoggedIn => {
      if(isLoggedIn){
        this.router.navigate(['/']);
      }
    });
  }

}


