import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Customer } from 'src/app/shared/customer.model';
import { Order } from 'src/app/shared/order.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})

export class OrderComponent implements OnInit {

  customers: Customer[];
  isvalid: boolean = true;
  constructor(private service: OrderService, private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.resetForm();
    this.customerService.getCustomers().then(res => this.customers = res as Customer[])
  }

  resetForm(form?: NgForm): void {
    if (form = null)
      form.resetForm();
    this.service.formData = {
      OrderID: null,
      OrderNum: "DD-" + Math.floor(10000 + Math.random() * 90000).toString(),
      CustomerID: 0,
      PaymentMethod: '',
      GrandTotal: 0
    }
    this.service.orderItems = [];
  }
  AddOrEditOrderItem(orderIndex: number, OrderID: number): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderIndex, OrderID }
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    })
  }

  DeleteOrderItem(orderItemID: number, orderIndex: number): void {
    this.service.orderItems.splice(orderIndex, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal(): void {
    this.service.formData.GrandTotal = this.service.orderItems.reduce((previous, current) => {
      return previous + current.Total
    }, 0
    )
  }

  onSubmitOrder(form: NgForm): void {
    if (this.validateOrderForm()) {
      this.service.saveOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success("Order submitted successfully ", "Mavalli Tiffen Room");
        this.router.navigate(['/orders']);

      }
      )
    }
  }
  validateOrderForm(): boolean {
    this.isvalid = true;
    if (this.service.formData.CustomerID == 0)
      this.isvalid = false;
    else
      if (this.service.orderItems.length == 0)
        this.isvalid = false;
      else
        if (this.service.formData.PaymentMethod == "")
          this.isvalid = false;
    return this.isvalid;
  }
}
