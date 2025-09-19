"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play,
  Calendar,
  Users,
  BarChart3,
  Video,
  MessageCircle,
  Settings,
  Crown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  skippable: boolean;
}

interface OnboardingStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  isFirst: boolean;
  isLast: boolean;
  stepNumber: number;
  totalSteps: number;
}

interface OnboardingData {
  role: 'host' | 'attendee' | '';
  company: string;
  useCase: string;
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'expert';
  notifications: boolean;
}

// Welcome Step
const WelcomeStep: React.FC<OnboardingStepProps> = ({ onNext, stepNumber, totalSteps }) => {
  const { user } = useAuth();

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
      >
        <Sparkles className="h-10 w-10 text-white" />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Welcome to ConvertCast, {user?.firstName}! 👋
        </h1>
        <p className="text-xl text-white/80 max-w-lg mx-auto">
          Let's get you set up in just a few minutes. We'll personalize your experience based on how you plan to use ConvertCast.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">What you'll get:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white/80">Personalized dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white/80">Quick start templates</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-white/80">Best practice tips</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        Let's Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

// Role Selection Step
const RoleSelectionStep: React.FC<OnboardingStepProps & { data: OnboardingData; setData: (data: OnboardingData) => void }> = ({
  onNext,
  onPrevious,
  data,
  setData,
  stepNumber,
  totalSteps
}) => {
  const roles = [
    {
      id: 'host',
      title: 'Event Host',
      description: 'I want to create and host webinars, meetings, and live events',
      icon: Video,
      features: ['Create events', 'Go live', 'Manage attendees', 'Analytics']
    },
    {
      id: 'attendee',
      title: 'Event Attendee',
      description: 'I mainly attend events and occasionally want to host',
      icon: Users,
      features: ['Join events', 'Interactive chat', 'Networking', 'Basic hosting']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">What's your primary role?</h2>
        <p className="text-white/70">This helps us customize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              data.role === role.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-600 bg-slate-800/50 hover:border-purple-400'
            }`}
            onClick={() => setData({ ...data, role: role.id as 'host' | 'attendee' })}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                data.role === role.id ? 'bg-purple-500' : 'bg-slate-700'
              }`}>
                <role.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{role.title}</h3>
                <p className="text-sm text-white/70 mt-1">{role.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {role.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              {data.role === role.id && (
                <CheckCircle className="h-5 w-5 text-purple-400" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!data.role}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Company & Use Case Step
const CompanyStep: React.FC<OnboardingStepProps & { data: OnboardingData; setData: (data: OnboardingData) => void }> = ({
  onNext,
  onPrevious,
  data,
  setData
}) => {
  const useCases = [
    { id: 'sales', label: 'Sales & Marketing', icon: BarChart3 },
    { id: 'education', label: 'Education & Training', icon: Calendar },
    { id: 'community', label: 'Community Building', icon: Users },
    { id: 'support', label: 'Customer Support', icon: MessageCircle },
    { id: 'internal', label: 'Internal Meetings', icon: Settings },
    { id: 'other', label: 'Other', icon: Play }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Tell us about your setup</h2>
        <p className="text-white/70">Help us personalize your dashboard</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-white">Company or Organization</Label>
          <Input
            id="company"
            placeholder="Enter your company name (optional)"
            value={data.company}
            onChange={(e) => setData({ ...data, company: e.target.value })}
            className="bg-slate-800/50 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-white">Primary use case</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {useCases.map((useCase) => (
              <motion.div
                key={useCase.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
                  data.useCase === useCase.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-600 bg-slate-800/50 hover:border-purple-400'
                }`}
                onClick={() => setData({ ...data, useCase: useCase.id })}
              >
                <useCase.icon className="h-6 w-6 text-white mx-auto mb-2" />
                <span className="text-sm text-white">{useCase.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Goals & Experience Step
const GoalsStep: React.FC<OnboardingStepProps & { data: OnboardingData; setData: (data: OnboardingData) => void }> = ({
  onNext,
  onPrevious,
  data,
  setData
}) => {
  const goals = [
    'Increase lead generation',
    'Improve customer engagement',
    'Host educational content',
    'Build community',
    'Reduce support tickets',
    'Scale team communication'
  ];

  const toggleGoal = (goal: string) => {
    const newGoals = data.goals.includes(goal)
      ? data.goals.filter(g => g !== goal)
      : [...data.goals, goal];
    setData({ ...data, goals: newGoals });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">What are your goals?</h2>
        <p className="text-white/70">Select all that apply</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goals.map((goal) => (
            <motion.div
              key={goal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                data.goals.includes(goal)
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-purple-400'
              }`}
              onClick={() => toggleGoal(goal)}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">{goal}</span>
                {data.goals.includes(goal) && (
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          <Label className="text-white">Experience level</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'beginner', label: 'Beginner', desc: 'New to webinars' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
              { id: 'expert', label: 'Expert', desc: 'Very experienced' }
            ].map((level) => (
              <motion.div
                key={level.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${
                  data.experience === level.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-600 bg-slate-800/50 hover:border-purple-400'
                }`}
                onClick={() => setData({ ...data, experience: level.id as any })}
              >
                <div className="text-white font-medium">{level.label}</div>
                <div className="text-xs text-white/60 mt-1">{level.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Completion Step
const CompletionStep: React.FC<OnboardingStepProps & { data: OnboardingData }> = ({
  onNext,
  onPrevious,
  data
}) => {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="h-10 w-10 text-white" />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">You're all set! 🎉</h2>
        <p className="text-xl text-white/80 max-w-lg mx-auto">
          Your dashboard has been personalized based on your preferences. Ready to create your first event?
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">What's next:</h3>
        <div className="space-y-2 text-left">
          {(() => {
            const steps = data.role === 'host'
              ? [
                  'Create your first event',
                  'Set up your streaming preferences',
                  'Invite your first attendees',
                  'Explore analytics and insights'
                ]
              : [
                  'Browse upcoming events',
                  'Set up your profile',
                  'Join your first event',
                  'Explore community features'
                ];

            return steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-purple-400 font-medium">{index + 1}.</span>
                <span className="text-white/80">{step}</span>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Enter Dashboard
          <Crown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: '',
    company: '',
    useCase: '',
    goals: [],
    experience: 'beginner',
    notifications: true
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Welcome to ConvertCast',
      component: WelcomeStep,
      skippable: false
    },
    {
      id: 'role',
      title: 'Role',
      description: 'Select your primary role',
      component: (props) => <RoleSelectionStep {...props} data={data} setData={setData} />,
      skippable: false
    },
    {
      id: 'company',
      title: 'Setup',
      description: 'Company and use case',
      component: (props) => <CompanyStep {...props} data={data} setData={setData} />,
      skippable: true
    },
    {
      id: 'goals',
      title: 'Goals',
      description: 'Goals and experience',
      component: (props) => <GoalsStep {...props} data={data} setData={setData} />,
      skippable: true
    },
    {
      id: 'completion',
      title: 'Complete',
      description: 'Setup complete',
      component: (props) => <CompletionStep {...props} data={data} />,
      skippable: false
    }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete(data);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (steps[currentStep].skippable) {
      handleNext();
    } else {
      onSkip();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ConvertCast</span>
            </div>
            {steps[currentStep].skippable && (
              <Button variant="ghost" onClick={onSkip} className="text-white/60">
                Skip Setup
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="text-sm text-white/60 mb-2">
            Step {currentStep + 1} of {steps.length}
          </div>
          <CardTitle className="text-white">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-white/70">
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                stepNumber={currentStep + 1}
                totalSteps={steps.length}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};