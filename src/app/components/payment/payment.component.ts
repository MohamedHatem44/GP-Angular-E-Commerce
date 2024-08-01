import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Stripe, StripeCardElement, loadStripe } from '@stripe/stripe-js';
import { environment } from '../../env';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
/*--------------------------------------------------------------------*/
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  cardElement: StripeCardElement | null = null;
  clientSecret: string = '';
  cardName: string = '';
  email: string = '';
  phone: string = '';
  // city: string = '';
  // country: string = '';
  amount: number | null = null;
  errorMessage: string | null = null;
  cartError: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  createOrderLoading: boolean = false;
  orderLoading: boolean = false;
  noItems: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private _Router: Router,
    private _OrderService: OrderService,
    private _ToastrService: ToastrService
  ) {}
  /*-----------------------------------------------------------------*/
  async ngOnInit() {
    this.getTotalPrice();
    this.stripe = await loadStripe(environment.stripePublishableKey);
    this.setupStripeElements();
  }
  /*-----------------------------------------------------------------*/
  //get total price
  getTotalPrice() {
    this.noItems = false;
    this.cartError = null;
    this.isLoading = true;
    this.cartService.getShoppingCartByUserFromClaims().subscribe(
      (response) => {
        if (response.totalCartPrice === 0 && response.itemsCount === 0) {
          this.noItems = true;
          this._ToastrService.error('No items available to purchase, please add items to cart');
          return;
        }
        this.amount = response.totalCartPrice + 5;
        this.createPaymentIntent(this.amount);
        this.isLoading = false;
        this.cartError = null;
      },
      (error) => {
        this.cartError = 'Error Occured while loading Price, Please try again.';
        this.isLoading = false;
      }
    );
  }
  /*-----------------------------------------------------------------*/
  createPaymentIntent(price: number) {
    const amount = Math.ceil(price);
    this.errorMessage = null;
    const paymentRequest = { amount: amount };
    this.paymentService.createPaymentIntent(paymentRequest).subscribe(
      (response: any) => {
        this.clientSecret = response.clientSecret;
      },
      (error) => {
        this.errorMessage = 'Error Occurred While Payment Process, Please Try Again Later...';
      }
    );
  }
  /*-----------------------------------------------------------------*/
  setupStripeElements() {
    if (!this.stripe) return;
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }
  /*-----------------------------------------------------------------*/
  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    if (this.cardName == '') {
      this.errorMessage = 'Card Name Is Required';
      return;
    }
    if (!this.stripe || !this.clientSecret || !this.cardElement) {
      console.log('Stripe.js has not loaded or client secret is missing');
      this.errorMessage = 'Error Occurred While Payment Process, Please Try Again Later...';
      return;
    }
    // if (!this.validateForm()) {
    //   return;
    // }
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.cardElement,
        billing_details: {
          // address: {
          //   city: this.city,
          //   country: this.country,
          // },
          name: this.cardName,
          email: this.email,
          phone: this.phone,
        },
      },
    });

    if (error) {
      this.errorMessage = error.message;
      this.isLoading = false;
    } else {
      // Call order creation logic
      this.createOrder();
      this.isLoading = false;
    }
  }
  /*-----------------------------------------------------------------*/
  validateForm(): boolean {
    const phonePattern = /^(?:012|015|010|011)\d{8}$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!this.email) {
      this.errorMessage = 'Please fill data';
      return false;
    }
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Invalid Email';
      return false;
    }
    if (!this.phone) {
      this.errorMessage = 'Phone Number is required';
      return false;
    }
    if (!phonePattern.test(this.phone)) {
      this.errorMessage = 'Invalid Phone Number';
      return false;
    }
    this.errorMessage = null;
    return true;
  }
  /*-----------------------------------------------------------------*/
  resetForm() {
    if (this.cardElement) {
      this.cardElement.clear();
      this.cardName = '';
      this.email = '';
      this.phone = '';
      // this.city = '';
      // this.country = '';
    }
    this.errorMessage = null;
  }
  /*-----------------------------------------------------------------*/
  createOrder() {
    this.orderLoading = true;
    this._OrderService.createOrder().subscribe(
      (response) => {
        console.log('Order created successfully', response);
        this._ToastrService.success('Order created successfully');
        this.successMessage = 'Payment successful and you order placed successfully';
        this.resetForm();
        setTimeout(() => {
          this._Router.navigate(['/orders']);
        }, 2000);
        this.orderLoading = false;
      },
      (error) => {
        console.error('An error occurred while creating the order', error);
        this._ToastrService.error('Error occurred while creating the order');
        this.orderLoading = false;
      }
    );
  }
  /*-----------------------------------------------------------------*/
}
