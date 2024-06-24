import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../env';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private stripe: Stripe | null = null;
  private paymentApiUrl = environment.paymentApiUrl;

  constructor(private http: HttpClient) {
    this.loadStripe();
  }

  async loadStripe() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  createPaymentIntent(paymentRequest: { amount: number }) {
    return this.http.post<{ clientSecret: string }>(this.paymentApiUrl, paymentRequest);
  }

  getStripeInstance() {
    return this.stripe;
  }
}
