import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  message = new Subject()

  constructor() { }

  // sendMessage(product: Plan):void{
  //   this.message.next(product);
  // }

  getMessage(): Observable<any>{
    return this.message.asObservable();
  }
}
