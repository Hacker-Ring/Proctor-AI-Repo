'use client';

import { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: 'per month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 100 calls per month',
      'Basic analytics dashboard',
      'Email support',
      'Standard call duration (up to 30 min)',
      'Basic reporting'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'secondary'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: 'per month',
    description: 'Ideal for growing admissions offices',
    features: [
      'Up to 500 calls per month',
      'Advanced analytics & insights',
      'Priority email support',
      'Extended call duration (up to 60 min)',
      'Advanced reporting & exports',
      'Custom branding',
      'API access'
    ],
    popular: true,
    buttonText: 'Most Popular',
    buttonVariant: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'per month',
    description: 'For large institutions with high volume',
    features: [
      'Unlimited calls',
      'Real-time analytics dashboard',
      '24/7 phone & email support',
      'Unlimited call duration',
      'Custom reporting & analytics',
      'White-label solution',
      'Full API access',
      'Dedicated account manager',
      'Custom integrations'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'secondary'
  }
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getAdjustedPrice = (price: number) => {
    return billingPeriod === 'yearly' ? Math.round(price * 10) : price;
  };

  const getAdjustedPeriod = (period: string) => {
    return billingPeriod === 'yearly' ? 'per year' : period;
  };

  const getSavings = (price: number) => {
    if (billingPeriod === 'yearly') {
      const monthlyTotal = price * 12;
      const yearlyPrice = price * 10;
      return monthlyTotal - yearlyPrice;
    }
    return 0;
  };

  return (
    <div className="p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-black mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 mb-8">Choose the perfect plan for your admissions office</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-black' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              billingPeriod === 'yearly' ? 'bg-black' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-black' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingPeriod === 'yearly' && (
            <span className="text-sm text-green-600 font-medium">Save up to 17%</span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`card p-8 relative ${
              plan.popular ? 'ring-2 ring-black scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-black text-white px-4 py-1 rounded-[6px] text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-black">${getAdjustedPrice(plan.price)}</span>
                <span className="text-gray-600 ml-2">{getAdjustedPeriod(plan.period)}</span>
              </div>
              
              {billingPeriod === 'yearly' && getSavings(plan.price) > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  Save ${getSavings(plan.price)}/year
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-3 mt-0.5">✓</span>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-[6px] font-medium transition-all duration-200 ${
                plan.buttonVariant === 'primary'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-black text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-black mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="font-semibold text-black mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 text-sm">
              We offer a 14-day free trial for all plans. No credit card required to get started.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="font-semibold text-black mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="font-semibold text-black mb-2">Do you offer custom pricing?</h3>
            <p className="text-gray-600 text-sm">
              Yes, we offer custom pricing for large institutions with specific requirements.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of admissions offices already using ProctorAI to streamline their processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Start Free Trial
            </button>
            <button className="btn-secondary">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
