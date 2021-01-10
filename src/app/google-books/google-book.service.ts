import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()

export class GoogleBookService {

  private apiUrl = "https://www.googleapis.com/books/v1/volumes/?q="

  constructor(private http: HttpClient) { }

  getBooks(bookTitle: string) {
    return fetch(this.apiUrl + bookTitle)
      .then(res => res.json())
      .catch(err => {
        console.log(err);
    });
  }
}
