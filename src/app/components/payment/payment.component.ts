import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Stripe, StripeCardElement, loadStripe } from '@stripe/stripe-js';
import { environment } from '../../env';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  cardElement: StripeCardElement | null = null;
  clientSecret: string = '';
  cardName: string = '';
  email: string = '';
  phone: string = '';
  // city: string = '';
  // country: string = '';
  amount: number = 1500;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
    this.createPaymentIntent();
    this.setupStripeElements();
  }

  createPaymentIntent() {
    const paymentRequest = { amount: this.amount };
    this.paymentService.createPaymentIntent(paymentRequest).subscribe(
      (response) => {
        this.clientSecret = response.clientSecret;
      },
      (error) => {
        console.log('Error creating payment intent');
        this.errorMessage = 'Error Occurred While Payment Process, Please Try Again Later...';
      }
    );
  }

  setupStripeElements() {
    if (!this.stripe) return;

    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }

  async onSubmit() {
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

    if (!this.validateForm()) {
      return;
    }
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
    } else {
      this.successMessage = 'Payment successful!';
      this.resetForm();
    }
  }

  validateForm(): boolean {
    const phonePattern = /^\[012|015|010|011]\d{8}$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!this.email) {
      this.errorMessage = 'Email is required';
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
}
