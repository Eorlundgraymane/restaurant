import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Order } from '../shared/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  ordersList:Object;
  constructor(private orders:OrderService) { }

  ngOnInit() {
    this.orders.getOrders().then(res=> this.ordersList = res);
  }

}
