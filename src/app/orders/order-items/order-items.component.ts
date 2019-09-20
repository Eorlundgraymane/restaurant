import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrderItem } from 'src/app/shared/order-item.model';
import { FoodItemService } from 'src/app/shared/food-item.service';
import { FoodItem } from 'src/app/shared/food-item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: []
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: FoodItem[];
  isvalid: boolean = true;

  constructor
    (@Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<OrderItemsComponent>,
      private itemService: FoodItemService,
      private orderService: OrderService) { }

  ngOnInit() {
    this.itemService.getItemList().then(res => this.itemList = res as FoodItem[]);

    if (this.data.orderIndex == null) {
      this.formData = {
        OrderItemID: null,
        OrderID: this.data.OrderID,
        Price: 0,
        Quantity: 0,
        Total: 0,
        ItemID: 0,
        ItemName: ''
      }
    }
    else {
      this.formData = Object.assign({}, this.orderService.orderItems[this.data.orderIndex]);
    }

  }

  // Triggered by the dropdown fooditems changed
  updatePrice(ddowncntl: any): void {
    if (ddowncntl.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
      this.formData.Quantity = 0;
      this.updateTotal()
    }
    else {
      this.formData.Price = this.itemList[ddowncntl.selectedIndex - 1].Price
      this.formData.ItemName = this.itemList[ddowncntl.selectedIndex - 1].Name;
    }
    this.updateTotal();
  }

  //triggered when quantity is changed
  updateTotal(): void {
    this.formData.Total = this.formData.Price * this.formData.Quantity
  }

  onSubmit(form: NgForm): void {
    if (this.validateForm(form.value)) {
      if (this.data.orderIndex == null)
        this.orderService.orderItems.push(form.value);
      else
        this.orderService.orderItems[this.data.orderIndex] = form.value;
      this.dialogRef.close();
    }

  }

  validateForm(formData: OrderItem): boolean {
    this.isvalid = true;
    if (formData.ItemID == 0) {
      this.isvalid = false;
    }
    else
      if (formData.Quantity == 0) {
        this.isvalid = false;
      }
    return this.isvalid;
  }

}
