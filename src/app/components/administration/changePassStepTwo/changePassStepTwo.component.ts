import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { UpdatePasswordRequest } from '../../../models/update-password-request';

@Component({
  selector: 'app-changePassStepTwo',
  templateUrl: './changePassStepTwo.component.html',
  styleUrls: ['./changePassStepTwo.component.sass']
})
export class ChangePassStepTwoComponent implements OnInit {

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
  }

  old_password = "";
  new_password = "";
  verify_password = "";

  /**
   * This event element will help to change the current view in the parent element <auth.component>.
   */
  @Output() routeView: EventEmitter<String> = new EventEmitter();

  /**
   * This event is emitted to the parent element <auth.component>.
   */
  changeView(view: String): void {
      this.routeView.emit(view);
  }

  changePassword(){

    if(this.new_password !== this.verify_password){
      console.log("Decir que las contraseñas no coinciden"+this.new_password +" / "+this.verify_password);
      return;
    } 

    //TODO: validar el password antiguo

    let updatePasswordRequest = new UpdatePasswordRequest(this.new_password);

    this.loginService.updatePassword(updatePasswordRequest).subscribe(
      response => {
        console.log("Avisar que sí se pudo hacer el cambio: "+response);
        alert('cambio exitoso');
      },
      error => {
        console.log("Mandar mensaje de error: "+error);
      }
    );
  }

}
