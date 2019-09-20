import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodItemService {

  constructor(private http:HttpClient) { }

  //To get the Food Items we are writing a new method
  getItemList(){
    return this.http.get(environment.apiURL+'/FoodItem').toPromise();
  }
}
