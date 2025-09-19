'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Clock, Users, Settings } from 'lucide-react';
import Link from 'next/link';

interface EventForm {
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  duration: number;
  maxAttendees: string;
  registrationRequired: boolean;
  status: 'draft' | 'scheduled';
}

export default function NewEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    timezone: 'UTC',
    duration: 60,
    maxAttendees: '',
    registrationRequired: true,
    status: 'draft'
  });

  const totalSteps = 3;

  const updateForm = (updates: Partial<EventForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(form.title && form.description);
      case 2:
        return !!(form.scheduledDate && form.scheduledTime);
      case 3:
        return true; // Settings are optional
      default:
        return false;
    }
  };

  const createEvent = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const scheduledAt = new Date(`${form.scheduledDate}T${form.scheduledTime}`).toISOString();

      const eventData = {
        title: form.title,
        description: form.description,
        streamer_id: user.id,
        scheduled_at: scheduledAt,
        duration: form.duration,
        timezone: form.timezone,
        status: form.status,
        max_attendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        registration_required: form.registrationRequired,
        landing_page_config: {},
        stream_config: {}
      };

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/events/${data.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-600 mt-1">Set up your live streaming event</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2 max-w-sm">
          <span>Basic Info</span>
          <span>Schedule</span>
          <span>Settings</span>
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Event Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Master Digital Marketing in 2024"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Event Description *</Label>
                <textarea
                  id="description"
                  placeholder="Describe what attendees will learn and why they should join..."
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Schedule Your Event</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => updateForm({ scheduledDate: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="time">Start Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.scheduledTime}
                  onChange={(e) => updateForm({ scheduledTime: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={form.timezone}
                  onChange={(e) => updateForm({ timezone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  value={form.duration}
                  onChange={(e) => updateForm({ duration: parseInt(e.target.value) || 60 })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Event Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  placeholder="Leave empty for unlimited"
                  value={form.maxAttendees}
                  onChange={(e) => updateForm({ maxAttendees: e.target.value })}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty for unlimited attendees
                </p>
              </div>

              <div>
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => updateForm({ status: e.target.value as 'draft' | 'scheduled' })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="scheduled">Schedule Event</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="registration"
                  checked={form.registrationRequired}
                  onChange={(e) => updateForm({ registrationRequired: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="registration" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Require Registration
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-7">
                Attendees will need to register before joining the event
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {step === totalSteps ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => updateForm({ status: 'draft' })}
                  disabled={loading}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={createEvent}
                  disabled={loading || !validateStep(step)}
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!validateStep(step)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}