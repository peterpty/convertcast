// Automated notification campaign system with email/SMS scheduling
import { supabase } from '@/lib/supabase';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import twilio from 'twilio';

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface NotificationTemplate {
  id?: string;
  name: string;
  description?: string;
  campaign_type: 'event_reminder' | 'post_event_followup' | 'conversion_sequence' | 'welcome_series';
  email_template?: {
    subject: string;
    html_content: string;
    text_content: string;
  };
  sms_template?: {
    content: string;
    character_count: number;
  };
  notification_schedule: NotificationScheduleItem[];
  timezone: string;
  personalization_fields: string[];
  audience_segments: AudienceSegment[];
  ab_test_enabled: boolean;
  ab_test_variants?: any[];
}

export interface NotificationScheduleItem {
  offset_hours: number; // Hours before/after event (negative = before, positive = after)
  channels: ('email' | 'sms')[];
  template_variant?: string;
  condition?: string; // Optional condition for sending
}

export interface AudienceSegment {
  name: string;
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
    value: any;
  }[];
}

export interface CampaignInstance {
  id?: string;
  event_id: string;
  stream_id?: string;
  template_id: string;
  streamer_id: string;
  name: string;
  target_audience_count: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  custom_schedule?: NotificationScheduleItem[];
  timezone?: string;
}

export interface NotificationSend {
  id?: string;
  campaign_id: string;
  registration_id: string;
  send_type: 'email' | 'sms';
  recipient_email?: string;
  recipient_phone?: string;
  subject?: string;
  content_text: string;
  content_html?: string;
  scheduled_for: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'spam' | 'unsubscribed';
  provider: 'mailgun' | 'twilio';
  provider_message_id?: string;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  ab_variant?: string;
}

export class NotificationCampaignSystem {
  // Predefined campaign templates that streamers can choose from
  static readonly PREDEFINED_TEMPLATES: Partial<NotificationTemplate>[] = [
    {
      name: '6-Stage Event Reminder Campaign',
      description: 'Comprehensive reminder sequence with 6 touchpoints leading up to your event',
      campaign_type: 'event_reminder',
      notification_schedule: [
        { offset_hours: -336, channels: ['email'] }, // 2 weeks before
        { offset_hours: -168, channels: ['email'] }, // 1 week before
        { offset_hours: -72, channels: ['email', 'sms'] }, // 3 days before
        { offset_hours: -24, channels: ['email', 'sms'] }, // 1 day before
        { offset_hours: -2, channels: ['email', 'sms'] }, // 2 hours before
        { offset_hours: -0.25, channels: ['sms'] }, // 15 minutes before
      ],
      email_template: {
        subject: 'Reminder: {{event_title}} is coming up!',
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Hi {{first_name}},</h2>
            <p>This is a friendly reminder that you're registered for "<strong>{{event_title}}</strong>".</p>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Event Details:</h3>
              <p><strong>Date:</strong> {{event_date}}</p>
              <p><strong>Time:</strong> {{event_time}} {{timezone}}</p>
              <p><strong>Duration:</strong> {{duration}} minutes</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{join_url}}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Join Event Now
              </a>
            </div>

            <p>Can't wait to see you there!</p>
            <p>Best regards,<br>{{streamer_name}}</p>
          </div>
        `,
        text_content: `Hi {{first_name}},\n\nThis is a reminder that you're registered for "{{event_title}}" on {{event_date}} at {{event_time}} {{timezone}}.\n\nJoin here: {{join_url}}\n\nSee you there!\n{{streamer_name}}`,
      },
      sms_template: {
        content: 'Hi {{first_name}}! Reminder: "{{event_title}}" starts {{time_until_event}}. Join: {{short_join_url}}',
        character_count: 100,
      },
      personalization_fields: [
        'first_name', 'last_name', 'email', 'company',
        'event_title', 'event_date', 'event_time', 'timezone', 'duration',
        'streamer_name', 'join_url', 'short_join_url', 'time_until_event'
      ],
      audience_segments: [],
      ab_test_enabled: false,
    },
    {
      name: 'Post-Event Conversion Sequence',
      description: 'Follow up with attendees after the event to drive conversions',
      campaign_type: 'post_event_followup',
      notification_schedule: [
        { offset_hours: 1, channels: ['email'] }, // 1 hour after
        { offset_hours: 24, channels: ['email'] }, // 1 day after
        { offset_hours: 72, channels: ['email'] }, // 3 days after
        { offset_hours: 168, channels: ['email'] }, // 1 week after
      ],
      email_template: {
        subject: 'Thanks for attending {{event_title}} - Special Offer Inside!',
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Thank you, {{first_name}}!</h2>
            <p>Thanks for attending "<strong>{{event_title}}</strong>" today. I hope you found it valuable!</p>

            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin-top: 0; color: white;">Exclusive Attendee Offer</h3>
              <p style="font-size: 18px; margin-bottom: 0;">Get {{discount_percentage}}% off - Limited Time!</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{offer_url}}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Claim Your Discount
              </a>
            </div>

            <p>This offer expires in {{offer_expires_hours}} hours, so don't wait!</p>
            <p>Questions? Just reply to this email.</p>
            <p>Best regards,<br>{{streamer_name}}</p>
          </div>
        `,
        text_content: `Thanks for attending {{event_title}}, {{first_name}}!\n\nExclusive offer: {{discount_percentage}}% off - expires in {{offer_expires_hours}} hours.\n\nClaim here: {{offer_url}}\n\n{{streamer_name}}`,
      },
      personalization_fields: [
        'first_name', 'event_title', 'streamer_name', 'discount_percentage',
        'offer_url', 'offer_expires_hours'
      ],
      audience_segments: [],
      ab_test_enabled: true,
    },
    {
      name: 'High-Intent Viewer Nurture',
      description: 'Targeted sequence for viewers showing high purchase intent during streams',
      campaign_type: 'conversion_sequence',
      notification_schedule: [
        { offset_hours: 0.5, channels: ['email'] }, // 30 minutes after
        { offset_hours: 24, channels: ['email', 'sms'] }, // 1 day after
        { offset_hours: 72, channels: ['email'] }, // 3 days after
      ],
      audience_segments: [
        {
          name: 'High Intent Viewers',
          conditions: [
            { field: 'conversion_score', operator: 'greater_than', value: 0.7 },
            { field: 'chat_participation', operator: 'equals', value: true },
          ],
        },
      ],
      ab_test_enabled: true,
    },
  ];

  async createTemplate(template: NotificationTemplate, streamerId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('notification_campaign_templates')
        .insert({
          streamer_id: streamerId,
          name: template.name,
          description: template.description,
          campaign_type: template.campaign_type,
          email_template: template.email_template,
          sms_template: template.sms_template,
          notification_schedule: template.notification_schedule,
          timezone: template.timezone,
          personalization_fields: template.personalization_fields,
          audience_segments: template.audience_segments,
          ab_test_enabled: template.ab_test_enabled,
          ab_test_variants: template.ab_test_variants,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async createCampaign(campaign: CampaignInstance): Promise<string> {
    try {
      // Get template details
      const { data: template } = await supabase
        .from('notification_campaign_templates')
        .select('*')
        .eq('id', campaign.template_id)
        .single();

      if (!template) throw new Error('Template not found');

      // Get event details
      const { data: event } = await supabase
        .from('events')
        .select('starts_at, title')
        .eq('id', campaign.event_id)
        .single();

      if (!event) throw new Error('Event not found');

      // Get target audience
      const audienceCount = await this.calculateAudienceSize(
        campaign.event_id,
        template.audience_segments
      );

      // Create campaign
      const { data, error } = await supabase
        .from('notification_campaigns')
        .insert({
          event_id: campaign.event_id,
          stream_id: campaign.stream_id,
          template_id: campaign.template_id,
          streamer_id: campaign.streamer_id,
          name: campaign.name,
          target_audience_count: audienceCount,
          custom_schedule: campaign.custom_schedule,
          timezone: campaign.timezone || template.timezone,
          status: 'active',
        })
        .select('id')
        .single();

      if (error) throw error;

      // Schedule notifications
      await this.scheduleNotifications(data.id, event.starts_at, template);

      return data.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  private async calculateAudienceSize(eventId: string, segments: AudienceSegment[]): Promise<number> {
    try {
      let query = supabase
        .from('stream_registrations')
        .select('id', { count: 'exact' })
        .eq('event_id', eventId);

      // Apply audience segments if any
      if (segments.length > 0) {
        // This would be more complex in practice, applying segment conditions
        // For now, we'll return the total count
      }

      const { count } = await query;
      return count || 0;
    } catch (error) {
      console.error('Error calculating audience size:', error);
      return 0;
    }
  }

  private async scheduleNotifications(
    campaignId: string,
    eventStartTime: string,
    template: any
  ): Promise<void> {
    try {
      const eventDate = new Date(eventStartTime);
      const schedule = template.custom_schedule || template.notification_schedule;

      // Get all registrations for this campaign
      const { data: campaign } = await supabase
        .from('notification_campaigns')
        .select('event_id, stream_id')
        .eq('id', campaignId)
        .single();

      if (!campaign) return;

      const { data: registrations } = await supabase
        .from('stream_registrations')
        .select('*')
        .eq('stream_id', campaign.stream_id);

      if (!registrations) return;

      // Create notification sends for each registration and schedule item
      const notificationSends: Partial<NotificationSend>[] = [];

      for (const registration of registrations) {
        for (const scheduleItem of schedule) {
          const scheduledTime = new Date(eventDate.getTime() + (scheduleItem.offset_hours * 60 * 60 * 1000));

          // Skip if scheduled time is in the past
          if (scheduledTime < new Date()) continue;

          for (const channel of scheduleItem.channels) {
            const recipient = channel === 'email' ? registration.email : registration.phone;
            if (!recipient) continue;

            const content = await this.personalizeContent(
              template,
              channel,
              registration,
              eventDate
            );

            notificationSends.push({
              campaign_id: campaignId,
              registration_id: registration.id,
              send_type: channel,
              recipient_email: channel === 'email' ? registration.email : undefined,
              recipient_phone: channel === 'sms' ? registration.phone : undefined,
              subject: channel === 'email' ? content.subject : undefined,
              content_text: content.text,
              content_html: channel === 'email' ? content.html : undefined,
              scheduled_for: scheduledTime.toISOString(),
              status: 'pending',
              provider: channel === 'email' ? 'mailgun' : 'twilio',
              attempts: 0,
              max_attempts: 3,
            });
          }
        }
      }

      // Batch insert notification sends
      if (notificationSends.length > 0) {
        await supabase
          .from('notification_sends')
          .insert(notificationSends);
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  private async personalizeContent(
    template: any,
    channel: 'email' | 'sms',
    registration: any,
    eventDate: Date
  ): Promise<{ subject?: string; text: string; html?: string }> {
    const templateContent = channel === 'email' ? template.email_template : template.sms_template;
    if (!templateContent) return { text: '' };

    // Get event details for personalization
    const { data: event } = await supabase
      .from('events')
      .select('title, starts_at, ends_at')
      .eq('id', registration.event_id)
      .single();

    const { data: streamer } = await supabase
      .from('users')
      .select('first_name, last_name')
      .eq('id', registration.streamer_id)
      .single();

    // Personalization variables
    const variables = {
      first_name: registration.first_name || 'Friend',
      last_name: registration.last_name || '',
      email: registration.email,
      company: registration.company || '',
      event_title: event?.title || 'Upcoming Event',
      event_date: eventDate.toLocaleDateString(),
      event_time: eventDate.toLocaleTimeString(),
      timezone: 'UTC', // Would get from user settings
      duration: event ? Math.round((new Date(event.ends_at).getTime() - new Date(event.starts_at).getTime()) / 60000) : 60,
      streamer_name: `${streamer?.first_name} ${streamer?.last_name}` || 'Your Host',
      join_url: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${registration.stream_id}?ref=${registration.id}`,
      short_join_url: `${process.env.NEXT_PUBLIC_APP_URL}/w/${registration.stream_id}`,
      time_until_event: this.formatTimeUntil(eventDate),
      discount_percentage: '20', // Would be dynamic
      offer_url: `${process.env.NEXT_PUBLIC_APP_URL}/offer/${registration.id}`,
      offer_expires_hours: '24',
    };

    // Replace variables in content
    const replaceVariables = (content: string): string => {
      return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key as keyof typeof variables] || match;
      });
    };

    const result: { subject?: string; text: string; html?: string } = {
      text: replaceVariables(templateContent.content || templateContent.text_content),
    };

    if (channel === 'email') {
      result.subject = replaceVariables(templateContent.subject);
      result.html = replaceVariables(templateContent.html_content);
    }

    return result;
  }

  private formatTimeUntil(eventDate: Date): string {
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    } else {
      return `in ${minutes} minutes`;
    }
  }

  async processPendingNotifications(): Promise<void> {
    try {
      // Get pending notifications that are due
      const { data: pendingNotifications } = await supabase
        .from('notification_sends')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(100);

      if (!pendingNotifications || pendingNotifications.length === 0) return;

      for (const notification of pendingNotifications) {
        try {
          if (notification.send_type === 'email') {
            await this.sendEmail(notification);
          } else if (notification.send_type === 'sms') {
            await this.sendSMS(notification);
          }
        } catch (error) {
          console.error(`Error sending notification ${notification.id}:`, error);
          await this.handleNotificationError(notification, error);
        }
      }
    } catch (error) {
      console.error('Error processing pending notifications:', error);
    }
  }

  private async sendEmail(notification: NotificationSend): Promise<void> {
    try {
      const response = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
        from: `ConvertCast <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: notification.recipient_email!,
        subject: notification.subject!,
        text: notification.content_text,
        html: notification.content_html,
        'o:tracking': 'yes',
        'o:tracking-clicks': 'yes',
        'o:tracking-opens': 'yes',
      });

      await supabase
        .from('notification_sends')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_message_id: response.id,
          attempts: (notification.attempts || 0) + 1,
        })
        .eq('id', notification.id);
    } catch (error) {
      throw error;
    }
  }

  private async sendSMS(notification: NotificationSend): Promise<void> {
    try {
      const message = await twilioClient.messages.create({
        body: notification.content_text,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: notification.recipient_phone!,
      });

      await supabase
        .from('notification_sends')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_message_id: message.sid,
          attempts: (notification.attempts || 0) + 1,
        })
        .eq('id', notification.id);
    } catch (error) {
      throw error;
    }
  }

  private async handleNotificationError(notification: NotificationSend, error: any): Promise<void> {
    const attempts = (notification.attempts || 0) + 1;
    const maxAttempts = notification.max_attempts || 3;

    if (attempts >= maxAttempts) {
      // Mark as failed
      await supabase
        .from('notification_sends')
        .update({
          status: 'failed',
          attempts,
          error_message: error.message,
        })
        .eq('id', notification.id);
    } else {
      // Schedule retry (exponential backoff)
      const retryDelay = Math.pow(2, attempts) * 60 * 1000; // 2^attempts minutes
      const nextRetry = new Date(Date.now() + retryDelay);

      await supabase
        .from('notification_sends')
        .update({
          attempts,
          error_message: error.message,
          next_retry_at: nextRetry.toISOString(),
        })
        .eq('id', notification.id);
    }
  }

  async getCampaignMetrics(campaignId: string): Promise<{
    total_scheduled: number;
    total_sent: number;
    total_delivered: number;
    total_opened: number;
    total_clicked: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
  }> {
    try {
      const { data } = await supabase
        .from('notification_sends')
        .select('status, opened_at, clicked_at')
        .eq('campaign_id', campaignId);

      if (!data) return {
        total_scheduled: 0, total_sent: 0, total_delivered: 0,
        total_opened: 0, total_clicked: 0, delivery_rate: 0,
        open_rate: 0, click_rate: 0
      };

      const total_scheduled = data.length;
      const total_sent = data.filter(n => ['sent', 'delivered'].includes(n.status)).length;
      const total_delivered = data.filter(n => n.status === 'delivered').length;
      const total_opened = data.filter(n => n.opened_at).length;
      const total_clicked = data.filter(n => n.clicked_at).length;

      return {
        total_scheduled,
        total_sent,
        total_delivered,
        total_opened,
        total_clicked,
        delivery_rate: total_scheduled > 0 ? (total_delivered / total_scheduled) * 100 : 0,
        open_rate: total_delivered > 0 ? (total_opened / total_delivered) * 100 : 0,
        click_rate: total_opened > 0 ? (total_clicked / total_opened) * 100 : 0,
      };
    } catch (error) {
      console.error('Error getting campaign metrics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationCampaignSystem = new NotificationCampaignSystem();