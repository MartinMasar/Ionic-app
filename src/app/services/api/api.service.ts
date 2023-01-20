import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpHeaders} from '@angular/common/http';

  export interface Res {
    id: string;
    joke: string;
  }

  export interface RootObject {
    current_page: number;
    limit: number;
    next_page: number;
    previous_page: number;
    results: Res[];
    search_term: string;
    status: number;
    total_jokes: number;
    total_pages: number;
  }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getRandomJoke(): Observable<Res>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }

  return this.http.get<Res>(`${environment.baseUrl}`, httpOptions);
  }

  getJokeByWord(input: string): Observable<RootObject>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }
    return this.http.get<RootObject>(`${environment.baseUrl}search?term=${input}`, httpOptions);
  }
}
