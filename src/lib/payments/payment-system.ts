// Comprehensive payment processing system with invoicing for live stream conversions
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { notificationCampaignSystem } from '@/lib/notifications/campaign-system';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface PaymentIntent {
  id?: string;
  amount_cents: number;
  currency: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  customer_details: CustomerDetails;
  stream_id?: string;
  viewer_id?: string;
  registration_id?: string;
  conversion_trigger: string;
  ai_suggestion_id?: string;
  metadata?: Record<string, string>;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  tax_id?: string;
  company?: string;
}

export interface InvoiceData {
  customer_details: CustomerDetails;
  line_items: InvoiceLineItem[];
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  due_date?: string;
  notes?: string;
  payment_terms?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  sku?: string;
}

export interface ConversionEvent {
  id?: string;
  stream_id: string;
  viewer_id?: string;
  registration_id?: string;
  conversion_type: 'purchase' | 'signup' | 'demo_request' | 'consultation_booking';
  product_name: string;
  product_sku?: string;
  amount_cents: number;
  currency: string;
  quantity: number;
  stripe_payment_intent_id?: string;
  stripe_customer_id?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  invoice_number?: string;
  invoice_url?: string;
  conversion_trigger: string;
  ai_suggestion_id?: string;
  ai_contribution_score?: number;
  customer_details: CustomerDetails;
  fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  fulfillment_details?: Record<string, any>;
}

export class PaymentSystem {
  async createPaymentIntent(paymentData: PaymentIntent): Promise<{
    client_secret: string;
    payment_intent_id: string;
    conversion_id: string;
  }> {
    try {
      // Create or get Stripe customer
      const customer = await this.createOrGetCustomer(paymentData.customer_details);

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentData.amount_cents,
        currency: paymentData.currency,
        customer: customer.id,
        description: `Purchase: ${paymentData.product_name}`,
        metadata: {
          product_name: paymentData.product_name,
          product_sku: paymentData.product_sku || '',
          stream_id: paymentData.stream_id || '',
          viewer_id: paymentData.viewer_id || '',
          conversion_trigger: paymentData.conversion_trigger,
          ...paymentData.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create conversion event record
      const conversionEvent: Partial<ConversionEvent> = {
        stream_id: paymentData.stream_id!,
        viewer_id: paymentData.viewer_id,
        registration_id: paymentData.registration_id,
        conversion_type: 'purchase',
        product_name: paymentData.product_name,
        product_sku: paymentData.product_sku,
        amount_cents: paymentData.amount_cents,
        currency: paymentData.currency,
        quantity: paymentData.quantity,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: customer.id,
        payment_status: 'pending',
        conversion_trigger: paymentData.conversion_trigger,
        ai_suggestion_id: paymentData.ai_suggestion_id,
        ai_contribution_score: paymentData.ai_suggestion_id ? 0.8 : 0.0,
        customer_details: paymentData.customer_details,
        fulfillment_status: 'pending',
      };

      const { data: conversion, error } = await supabase
        .from('stream_conversions')
        .insert(conversionEvent)
        .select()
        .single();

      if (error) throw error;

      return {
        client_secret: paymentIntent.client_secret!,
        payment_intent_id: paymentIntent.id,
        conversion_id: conversion.id,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<ConversionEvent> {
    try {
      // Get payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Update conversion event
      const { data: conversion, error } = await supabase
        .from('stream_conversions')
        .update({
          payment_status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
          payment_method: paymentIntent.payment_method_types[0],
          completed_at: paymentIntent.status === 'succeeded' ? new Date().toISOString() : null,
        })
        .eq('stripe_payment_intent_id', paymentIntentId)
        .select()
        .single();

      if (error) throw error;

      // If payment succeeded, process fulfillment and generate invoice
      if (paymentIntent.status === 'succeeded') {
        await this.processSuccessfulPayment(conversion);
      }

      return conversion;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  private async processSuccessfulPayment(conversion: ConversionEvent): Promise<void> {
    try {
      // Generate invoice
      const invoice = await this.generateInvoice(conversion);

      // Update conversion with invoice details
      await supabase
        .from('stream_conversions')
        .update({
          invoice_number: invoice.invoice_number,
          invoice_url: invoice.invoice_url,
          invoice_sent_at: new Date().toISOString(),
        })
        .eq('id', conversion.id);

      // Send invoice email
      await this.sendInvoiceEmail(conversion, invoice);

      // Update stream analytics
      await this.updateStreamAnalytics(conversion);

      // Mark AI suggestion as successful if applicable
      if (conversion.ai_suggestion_id) {
        await supabase
          .from('ai_chat_suggestions')
          .update({
            led_to_conversion: true,
            conversion_value_cents: conversion.amount_cents,
          })
          .eq('id', conversion.ai_suggestion_id);
      }

      // Trigger post-purchase automation
      await this.triggerPostPurchaseAutomation(conversion);
    } catch (error) {
      console.error('Error processing successful payment:', error);
    }
  }

  private async createOrGetCustomer(customerDetails: CustomerDetails): Promise<Stripe.Customer> {
    try {
      // Search for existing customer
      const existingCustomers = await stripe.customers.list({
        email: customerDetails.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await stripe.customers.create({
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        metadata: {
          company: customerDetails.company || '',
          tax_id: customerDetails.tax_id || '',
        },
      });

      return customer;
    } catch (error) {
      console.error('Error creating/getting customer:', error);
      throw error;
    }
  }

  private async generateInvoice(conversion: ConversionEvent): Promise<{
    invoice_number: string;
    invoice_url: string;
    invoice_pdf_url: string;
  }> {
    try {
      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now()}-${conversion.id?.slice(-6)}`;

      // Calculate tax (simplified - would use real tax calculation service)
      const taxRate = 0.08; // 8% example rate
      const subtotal = conversion.amount_cents;
      const tax = Math.round(subtotal * taxRate);
      const total = subtotal + tax;

      const invoiceData: InvoiceData = {
        customer_details: conversion.customer_details,
        line_items: [
          {
            description: conversion.product_name,
            quantity: conversion.quantity,
            unit_price_cents: conversion.amount_cents / conversion.quantity,
            total_cents: conversion.amount_cents,
            sku: conversion.product_sku,
          },
        ],
        subtotal_cents: subtotal,
        tax_cents: tax,
        total_cents: total,
        currency: conversion.currency,
        due_date: new Date().toISOString(),
        payment_terms: 'Paid in full',
        notes: 'Thank you for your purchase during our live stream!',
      };

      // Generate PDF invoice (would use a PDF generation service)
      const invoiceHtml = this.generateInvoiceHTML(invoiceNumber, invoiceData);
      const pdfUrl = await this.generatePDF(invoiceHtml, invoiceNumber);

      // Store invoice in database
      await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          conversion_id: conversion.id,
          customer_email: conversion.customer_details.email,
          invoice_data: invoiceData,
          pdf_url: pdfUrl,
          status: 'paid',
        });

      return {
        invoice_number: invoiceNumber,
        invoice_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceNumber}`,
        invoice_pdf_url: pdfUrl,
      };
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  private generateInvoiceHTML(invoiceNumber: string, invoice: InvoiceData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
          .company-info { float: left; }
          .invoice-info { float: right; text-align: right; }
          .clear { clear: both; }
          .customer-info { margin: 30px 0; }
          .line-items { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .line-items th, .line-items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .line-items th { background-color: #f8f9fa; }
          .totals { float: right; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 5px; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1 style="color: #6366f1; margin: 0;">ConvertCast</h1>
            <p>Enterprise Webinar Platform<br>
            support@convertcast.ai</p>
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoiceNumber}<br>
            <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>Due Date:</strong> ${new Date(invoice.due_date || Date.now()).toLocaleDateString()}</p>
          </div>
          <div class="clear"></div>
        </div>

        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${invoice.customer_details.name}</strong><br>
          ${invoice.customer_details.company ? invoice.customer_details.company + '<br>' : ''}
          ${invoice.customer_details.email}<br>
          ${invoice.customer_details.phone || ''}<br>
          ${invoice.customer_details.address ? `
            ${invoice.customer_details.address.line1}<br>
            ${invoice.customer_details.address.line2 ? invoice.customer_details.address.line2 + '<br>' : ''}
            ${invoice.customer_details.address.city}, ${invoice.customer_details.address.state} ${invoice.customer_details.address.postal_code}<br>
            ${invoice.customer_details.address.country}
          ` : ''}</p>
        </div>

        <table class="line-items">
          <thead>
            <tr>
              <th>Description</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.line_items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.sku || '-'}</td>
                <td>${item.quantity}</td>
                <td>$${(item.unit_price_cents / 100).toFixed(2)}</td>
                <td>$${(item.total_cents / 100).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${(invoice.subtotal_cents / 100).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${(invoice.tax_cents / 100).toFixed(2)}</span>
          </div>
          <div class="total-row total-final">
            <span>Total:</span>
            <span>$${(invoice.total_cents / 100).toFixed(2)}</span>
          </div>
        </div>

        <div class="clear"></div>

        ${invoice.notes ? `
          <div style="margin-top: 30px;">
            <h4>Notes:</h4>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!<br>
          Payment Terms: ${invoice.payment_terms || 'Net 30'}</p>
        </div>
      </body>
      </html>
    `;
  }

  private async generatePDF(html: string, invoiceNumber: string): Promise<string> {
    // In production, you would use a service like Puppeteer, jsPDF, or a PDF API
    // For now, we'll return a placeholder URL
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/invoices/${invoiceNumber}/pdf`;
  }

  private async sendInvoiceEmail(conversion: ConversionEvent, invoice: any): Promise<void> {
    try {
      // Use the notification system to send invoice email
      const emailContent = {
        subject: `Invoice ${invoice.invoice_number} - Thank you for your purchase!`,
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Thank you for your purchase!</h2>
            <p>Hi ${conversion.customer_details.name},</p>
            <p>Thank you for your purchase of <strong>${conversion.product_name}</strong> during our live stream.</p>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Purchase Details:</h3>
              <p><strong>Product:</strong> ${conversion.product_name}</p>
              <p><strong>Amount:</strong> $${(conversion.amount_cents / 100).toFixed(2)}</p>
              <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${invoice.invoice_url}" style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Invoice
              </a>
            </div>

            <p>Your invoice has been attached to this email for your records.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The ConvertCast Team</p>
          </div>
        `,
        text_content: `Thank you for your purchase of ${conversion.product_name}!\n\nInvoice #: ${invoice.invoice_number}\nAmount: $${(conversion.amount_cents / 100).toFixed(2)}\n\nView your invoice: ${invoice.invoice_url}\n\nThank you!\nThe ConvertCast Team`,
      };

      // Send via Mailgun or your email service
      // This would integrate with the notification system
    } catch (error) {
      console.error('Error sending invoice email:', error);
    }
  }

  private async updateStreamAnalytics(conversion: ConversionEvent): Promise<void> {
    try {
      // Update live stream analytics
      await supabase
        .from('live_streams')
        .update({
          conversion_events: supabase.raw('conversion_events + 1'),
          total_revenue_cents: supabase.raw(`total_revenue_cents + ${conversion.amount_cents}`),
        })
        .eq('id', conversion.stream_id);

      // Update viewer conversion status
      if (conversion.viewer_id) {
        await supabase
          .from('stream_viewers')
          .update({
            converted: true,
            conversion_value_cents: conversion.amount_cents,
          })
          .eq('id', conversion.viewer_id);
      }

      // Update registration conversion status
      if (conversion.registration_id) {
        await supabase
          .from('stream_registrations')
          .update({
            converted: true,
            conversion_value_cents: conversion.amount_cents,
            conversion_details: {
              product: conversion.product_name,
              amount: conversion.amount_cents,
              date: new Date().toISOString(),
            },
          })
          .eq('id', conversion.registration_id);
      }
    } catch (error) {
      console.error('Error updating stream analytics:', error);
    }
  }

  private async triggerPostPurchaseAutomation(conversion: ConversionEvent): Promise<void> {
    try {
      // Create a post-purchase notification campaign
      // This would trigger welcome emails, onboarding sequences, etc.

      // Example: Send welcome email with product access details
      // This would be customized based on the product purchased
    } catch (error) {
      console.error('Error triggering post-purchase automation:', error);
    }
  }

  async refundPayment(conversionId: string, reason?: string): Promise<void> {
    try {
      const { data: conversion } = await supabase
        .from('stream_conversions')
        .select('*')
        .eq('id', conversionId)
        .single();

      if (!conversion || !conversion.stripe_payment_intent_id) {
        throw new Error('Conversion or payment intent not found');
      }

      // Create Stripe refund
      const refund = await stripe.refunds.create({
        payment_intent: conversion.stripe_payment_intent_id,
        reason: reason || 'requested_by_customer',
      });

      // Update conversion status
      await supabase
        .from('stream_conversions')
        .update({
          payment_status: 'refunded',
          refunded_at: new Date().toISOString(),
          fulfillment_status: 'cancelled',
        })
        .eq('id', conversionId);

      // Update analytics
      await supabase
        .from('live_streams')
        .update({
          conversion_events: supabase.raw('conversion_events - 1'),
          total_revenue_cents: supabase.raw(`total_revenue_cents - ${conversion.amount_cents}`),
        })
        .eq('id', conversion.stream_id);
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getConversionMetrics(streamId: string): Promise<{
    total_conversions: number;
    total_revenue_cents: number;
    average_order_value_cents: number;
    conversion_rate: number;
    ai_attributed_conversions: number;
    ai_revenue_contribution_cents: number;
  }> {
    try {
      const { data: conversions } = await supabase
        .from('stream_conversions')
        .select('amount_cents, ai_contribution_score')
        .eq('stream_id', streamId)
        .eq('payment_status', 'completed');

      const { data: streamData } = await supabase
        .from('live_streams')
        .select('total_viewers')
        .eq('id', streamId)
        .single();

      if (!conversions) return {
        total_conversions: 0, total_revenue_cents: 0, average_order_value_cents: 0,
        conversion_rate: 0, ai_attributed_conversions: 0, ai_revenue_contribution_cents: 0
      };

      const total_conversions = conversions.length;
      const total_revenue_cents = conversions.reduce((sum, c) => sum + c.amount_cents, 0);
      const average_order_value_cents = total_conversions > 0 ? total_revenue_cents / total_conversions : 0;
      const conversion_rate = streamData?.total_viewers > 0 ? (total_conversions / streamData.total_viewers) * 100 : 0;

      const ai_attributed_conversions = conversions.filter(c => c.ai_contribution_score && c.ai_contribution_score > 0.5).length;
      const ai_revenue_contribution_cents = conversions
        .filter(c => c.ai_contribution_score && c.ai_contribution_score > 0.5)
        .reduce((sum, c) => sum + c.amount_cents, 0);

      return {
        total_conversions,
        total_revenue_cents,
        average_order_value_cents,
        conversion_rate,
        ai_attributed_conversions,
        ai_revenue_contribution_cents,
      };
    } catch (error) {
      console.error('Error getting conversion metrics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentSystem = new PaymentSystem();