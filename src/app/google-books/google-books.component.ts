import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoogleBookService } from './google-book.service';
import { NgxSpinnerService } from "ngx-spinner";
import { from, fromEvent, of } from 'rxjs';
import { tap, map, switchMap, debounceTime, filter, catchError } from 'rxjs/operators';

interface BookThumbnails {
  smallThumbnail: string;
  thumbnail: string;
}

interface VolumeInfo {
  authors: [];
  description: string;
  imageLinks: BookThumbnails;
  infoLink: string;
  language: string;
  previewLink: string;
  subtitle: string;
  title: string;
  categories: [];
}

interface Book {
  authors: [];
  description: string;
  title: string;
  categories: [];
  thumbnail: string;
}

interface BookItem {
  volumeInfo: VolumeInfo
  id: string;
}

interface GoogleBook {
  items: [];
  king: string;
  totalItems: number;
}

@Component({
  selector: 'app-google-books',
  templateUrl: './google-books.component.html',
  styleUrls: ['./google-books.component.css']
})
export class GoogleBooksComponent implements OnInit {

  @ViewChild('bookSearchInput', { static: true }) bookSearchInput!: ElementRef;

  private searchElem = $('#id_search_book');

  constructor(private service: GoogleBookService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.searchBookOnKeyUp();
    $('#bookSearchInput').on('search', this.onClickCleanInput.bind(this))
  }

  searchBookOnKeyUp() {
    fromEvent(this.bookSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 2),
      debounceTime(1000),
      tap(() => this.cleanBooks()),
    ).subscribe((ele: string) => this.getBooks(ele));
  }

  getBooks(title: string) {
    this.spinner.show()
    const p = this.service.getBooks(title)
    from(p).pipe(
      switchMap((data: GoogleBook) => from(data.items) || []),
      map((map: BookItem) => {
        const book: Book = {
          title: map.volumeInfo.title,
          categories: map.volumeInfo.categories,
          thumbnail: map.volumeInfo.imageLinks.thumbnail || '',
          authors: map.volumeInfo.authors,
          description: map.volumeInfo.description
        }
        return book;
      })
    ).subscribe((book: Book) => {this.displayBook(book); this.spinner.hide()}, err => {console.log(err); this.spinner.hide()});
  }

  displayBook(book: Book) {
    const bookTpl = `<div class="row">
                        <div class="col-md-12">
                          <h5>${book.title}</h5>
                        </div>
                        <div class="col-md-6 px-4">
                          <!--div class="float-right">2020-04-20 11:54pm</div-->
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-4"><img width="200" height="160" alt="${book.title}" title="${book.title}" src="${book.thumbnail || ''}"</img></div>
                        <div class="col-md-8"><p class="mb-0">${book.description || ''}</p></div>
                      </div><hr>`;
    $("#listItem").append(bookTpl);
  }

  cleanBooks() {
    $("#listItem").empty();
  }

  onClickCleanInput(e: any) {
    this.cleanBooks();
  }

  onClickRefresh(e: any) {
    let search = String($('#bookSearchInput').val());
    this.cleanBooks();
    this.getBooks(search);
  }
}
