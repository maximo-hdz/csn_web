import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service'
import { ThirdAccountService } from '../../services/third.account.service';
import { TransferService } from '../../services/transfer.service';
import { TransferRequest } from '../../models/transfer-request';
import { Accounts } from '../../models/accounts';
import { ThirdAccount } from '../../models/third-account';
import { Error } from '../../models/error';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.sass']
})
export class TransferComponent implements OnInit {

    thirdAccounts: Array<ThirdAccount>;
    ownAccounts: Array<Accounts>;
    sourceAccountId: string;
    account_id_destination: string;
    amount: string;
    concept: string;
    password: string;
    ownDescription: string;
    thirdDescription: string;
    authnum;
    opt;
    step;
    error: Error;

    constructor(
	    private router: Router,
        private thirdAccountService: ThirdAccountService,
        private accountService: AccountService,
        private transferService: TransferService
    ) {
        this.error = new Error(false, '');
    }

    ngOnInit() {
        this.sourceAccountId = "";
        this.account_id_destination = "";
        this.amount = "";
        this.concept  = "";
        this.password = "";
        this.step = 1;
        this.opt = "own";
        this.ownDescription = "Cuenta retiro";
        this.thirdDescription = "Cuenta de depósito";
        this.accountService.getAccounts().subscribe(
            response => {
                this.ownAccounts = response;
            },
            error => {
                this.error.message = error;
                this.error.show = true;
            }
        );
        this.thirdAccountService.getThirdAccounts().subscribe(
            response => {
                this.thirdAccounts = response;
            },
            error => {
                this.error.message += error;
                this.error.show = true;
            }
        );
    }

    cancelar(){
        this.step = 1;
        this.sourceAccountId = "";
        this.account_id_destination = "";
        this.amount = "";
        this.concept  = "";
        this.password = "";
        this.ownDescription = "Cuenta retiro";
        this.thirdDescription = "Cuenta de depósito";
        this.error.show = false;
    }

    validate(){
        this.step = 2;
    }

    goToAccounts(){
        this.router.navigate(['/home']);
    }

    transfer(view: String): void{
        let transferRequest = new TransferRequest(this.account_id_destination, this.amount, this.concept, this.password);
        this.transferService.transfer(this.sourceAccountId, transferRequest).subscribe(
            res => {
                console.log('Todo bien');
                this.step = 3;
                this.authnum = res.authorization_number;
                this.error.show = false;
            },
            error => {
                this.error.message = error;
                this.error.show = true;
            }
        );
    }

    selectOwn(account: Accounts){
        this.sourceAccountId = account._account_id;
        this.ownDescription = account.description +' '+ this.shortAccount(account._account_id)+' $'+account.available_balance;
    }

    selectThirdOwn(account: Accounts){
        this.account_id_destination = account._account_id;
        this.thirdDescription = account.description+' '+this.shortAccount(account._account_id)+' $'+account.available_balance;
    }

    selectThird(account: ThirdAccount){
        this.account_id_destination = account._account_id;
        this.thirdDescription = account.alias+' ***'+ account._account_id;
    }

    shortAccount(account: string): string {
        let short = account.split('-')[0]
        return "***"+short.substr(short.length - 3);
    }

    numbers(event) {
        var numbers = "0123456789";
        var event = event || window.event;
        var codigoCaracter = event.charCode || event.keyCode;
        var caracter = String.fromCharCode(codigoCaracter);

        return numbers.indexOf(caracter) != -1;
    }

}
