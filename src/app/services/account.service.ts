import { Injectable } from '@angular/core';
import { HttpClient } from './http.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Utils } from '../utils/utils';

import { Accounts } from '../models/accounts';
import { Movements } from '../models/movements';

@Injectable()
export class AccountService {

	constructor(
		private http: HttpClient,
		private utils: Utils
	) {	}

	getAccounts(): Observable<Array<Accounts>>{
		return this.http.get(environment.baseURL + 'accounts', true)
			.map(res => res.json().accounts)
			.catch(this.utils.handleError);
	}

	getTransactions(id: string): Observable<Array<Movements>>{
		return this.http.get(environment.baseURL + 'accounts/'+ id +'/transactions', true)
			.map(res => res.json().movements)
			.catch(this.utils.handleError);
	}

}