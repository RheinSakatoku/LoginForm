import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { ContactsModel } from './login-page.model';
import { MessagesModel } from './login-page.model';
import { MessagesThemesModel } from './login-page.model';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  private contactsUrl: string = environment.apiBaseURL + '/Contacts';
  private messagesUrl: string = environment.apiBaseURL + '/Messages';
  private messageThemesUrl: string = environment.apiBaseURL + '/MessageThemes';

  list:ContactsModel[] = [];
  list1:MessagesModel[] = [];
  list2:MessagesThemesModel[] = [];
  formData: ContactsModel = new ContactsModel();
  formData1: MessagesModel = new MessagesModel();
  formData2: MessagesThemesModel = new MessagesThemesModel();
  cptch!:string;
  formSubmitted: boolean = false;

  contactInfo: {
    email: string;
    phoneNumber: string;
  } = { email: '', phoneNumber: '' };

  constructor(private http: HttpClient) { }

  refreshList()
  {
    this.refreshContacts();
    this.refreshMessages();
    this.refreshMessagesThemes();
  }

  refreshContacts()
  {
    this.http.get(this.contactsUrl)
    .subscribe({
      next:res=>{
        this.list = res as ContactsModel[];
      },
      error: err => {console.log(err)}
    })
  }

  refreshMessages()
  {
    this.http.get(this.messagesUrl)
    .subscribe({
      next:res=>{
        this.list1 = res as MessagesModel[];
      },
      error: err => {console.log(err)}
    })
  }

  refreshMessagesThemes()
  {
    this.http.get(this.messageThemesUrl)
    .subscribe({
      next:res=>{
        this.list2 = res as MessagesThemesModel[];
      },
      error: err => {console.log(err)}
    })
  }

  captUpdator()
  {
    this.cptch ='';
    var abc = "abcdefghijklmnopqrstuvwxyz0123456789";
    while (this.cptch.length < 5) {
        this.cptch += abc[Math.floor(Math.random() * abc.length)];
    }
  }

  existanceChecker(phoneNumber: string, email: string): Observable<ContactsModel | null> {
    const params = new HttpParams()
      .set('phoneNumber', phoneNumber)
      .set('email', email);

    return this.http.get(this.contactsUrl, { params })
      .pipe(
        map(response => {
          const contacts = response as ContactsModel[];
          return contacts.find(contact => contact.phoneNumber === phoneNumber || contact.email === email) || null;
        }),
        catchError(err => of(null))
      );
  }

  mtChecker(messagesTheme: string): Observable<MessagesThemesModel | null> {
    const params = new HttpParams()
      .set('messagesTheme', messagesTheme);

    return this.http.get(this.messageThemesUrl, { params })
      .pipe(
        map(response => {
          const messageThemes = response as MessagesThemesModel[];
          return messageThemes.find(messageTheme => messageTheme.messageTheme === messagesTheme) || null;
        }),
        catchError(err => of(null))
      );
  }

  postContact(contact: ContactsModel) {
    return this.http.post(this.contactsUrl, contact);
  }

  postMessage(message: MessagesModel) {
    return this.http.post(this.messagesUrl, message);
  }

  postMessageTheme(messageTheme: MessagesThemesModel) {
    return this.http.post(this.messageThemesUrl, messageTheme);
  }

  resetForm(form: NgForm)
  {
    form.form.reset()
    this.formData = new ContactsModel()
    this.formData1 = new MessagesModel()
    this.formData2 = new MessagesThemesModel()
    this.formSubmitted = false;
  }

  getMessage(client_Id: number): Observable<MessagesModel[]> {
    return this.http.get(this.messagesUrl)
      .pipe(
        map(response => {
          const messages = response as MessagesModel[];
          return messages.filter(message => message.client_Id === client_Id.toString());
        }),
        catchError(err => of([])) // возвращаем пустой массив в случае ошибки
      );
  }

  getMessageThemes(): Observable<MessagesThemesModel[]> {
    return this.http.get(this.messageThemesUrl)
    .pipe(
      map(response => response as MessagesThemesModel[]),
      catchError(err => of([])) // возвращаем пустой массив в случае ошибки
    );
  }
}
