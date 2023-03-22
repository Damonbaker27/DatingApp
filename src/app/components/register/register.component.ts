import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private fb: FormBuilder, private router: Router, private memberService: MembersService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    //checks if the password field has been updated and validates confirm password again.
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  register(){
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value)
    //using spread operator to update date of birth value.
    const values = {...this.registerForm.value, dateOfBirth: dob}

    this.accountService.register(values).subscribe({
      next: () =>{
        this.router.navigateByUrl('/members');
      },
      error: (error)=> {
        this.validationErrors = error;
      }

    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

  //turn datetime into dateonly
  private getDateOnly(dob: string | undefined){
    if(!dob) return;
    //create a new date object
    let theDob = new Date(dob);

    //this is wild but it removes the timezone offset then slices off the first 10 characters.
    return new Date(theDob.setMinutes(theDob.getMinutes()- theDob.getTimezoneOffset()))
    .toISOString().slice(0,10);

  }
}
