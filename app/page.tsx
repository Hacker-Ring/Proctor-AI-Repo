import Link from "next/link";
import { createServerSupabaseClient } from "../lib/supabase-server";

export default async function Home() {
  const supabase = createServerSupabaseClient();
  
  // Check for session to determine navigation buttons
  let isAuthenticated = false;
  let user = null;
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Home page auth check:', { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      userId: session?.user?.id,
      sessionError: sessionError?.message 
    });
    
    if (session && session.user && !sessionError) {
      isAuthenticated = true;
      user = session.user;
    }
  } catch (error) {
    console.error('Error checking user authentication:', error);
    // Continue with unauthenticated state
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">ProctorAI.</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#product" className="text-gray-700 hover:text-black">Product</a>
              <a href="#company" className="text-gray-700 hover:text-black">Company</a>
              <a href="#support" className="text-gray-700 hover:text-black">Support</a>
              <a href="#legal" className="text-gray-700 hover:text-black">Legal</a>
            </nav>
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/signin" className="text-gray-700 hover:text-black">Login</Link>
                      <Link href="/auth/signup" className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Try it free
                      </Link>
                    </>
                  )}
                </div>
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Automate 10,000+ calls with AI voice agents
          </h1>
          <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
            ProctorAI creates custom tailored voice agents for companies to automate inbound and outbound calls using advanced AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard" className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/signup" className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Start your free trial
                </Link>
                <Link href="#contact" className="bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Talk to sales
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-600">TechCorp</div>
            <div className="text-2xl font-bold text-gray-600">GlobalCall</div>
            <div className="text-2xl font-bold text-gray-600">VoiceFlow</div>
            <div className="text-2xl font-bold text-gray-600">CallCenter Pro</div>
            <div className="text-2xl font-bold text-gray-600">AI Solutions</div>
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            What would happen if AI voice agents handled all your customer calls?
          </h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "Call Volume", value: "2.5M", trend: "↗" },
                { name: "Response Time", value: "0.3s", trend: "↗" },
                { name: "Satisfaction", value: "98%", trend: "↗" },
                { name: "Cost Savings", value: "75%", trend: "↗" },
                { name: "Uptime", value: "99.9%", trend: "↗" },
                { name: "Languages", value: "50+", trend: "↗" }
              ].map((metric, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{metric.name}</h3>
                    <span className="text-2xl font-bold text-blue-600">{metric.value}</span>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-end">
                    <div className="w-full h-16 bg-blue-500 rounded-t-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            Advanced AI voice processing and call management engine.
          </h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Voice Recognition</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Real-time speech processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Multi-language support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Emotion detection</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Live Call Status</div>
                  <div className="text-lg font-semibold text-green-600">Active: 247 calls</div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Call Management</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Queue Management</div>
                    <div className="text-lg font-semibold">Priority routing enabled</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Response Templates</div>
                    <div className="text-lg font-semibold">Custom AI responses</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Analytics</div>
                    <div className="text-lg font-semibold">Real-time insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI agents predict customer needs",
                description: "Advanced machine learning algorithms analyze call patterns to anticipate customer requirements and provide proactive solutions.",
                icon: "🧠"
              },
              {
                title: "Conversations that feel human",
                description: "Natural language processing creates authentic, empathetic interactions that customers trust and prefer.",
                icon: "💬"
              },
              {
                title: "Set it and forget it",
                description: "Fully automated call handling with minimal human intervention required. Your AI agents work 24/7.",
                icon: "⚡"
              },
              {
                title: "Reach your exact audience",
                description: "Target specific demographics, industries, and customer segments with precision-crafted voice campaigns.",
                icon: "🎯"
              },
              {
                title: "Global customer support",
                description: "Provide seamless support across multiple time zones and languages with our worldwide AI voice network.",
                icon: "🌍"
              },
              {
                title: "Scalable call volume",
                description: "Handle from 10 to 100,000+ calls simultaneously without compromising quality or response times.",
                icon: "📈"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark AI Agents Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Our pool of AI voice agents keep your customers satisfied.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: "Support Calls", value: "1.2M", trend: "↗" },
              { name: "Sales Calls", value: "850K", trend: "↗" },
              { name: "Follow-ups", value: "2.1M", trend: "↗" },
              { name: "Satisfaction", value: "98%", trend: "↗" }
            ].map((metric, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl">
                <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-gray-300">{metric.name}</div>
                <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mt-4"></div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Real-time call monitoring</h3>
              <p className="text-gray-300">Live analytics and performance metrics for every AI agent interaction.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Never miss a call</h3>
              <p className="text-gray-300">24/7 availability ensures every customer gets immediate attention.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Always in the top tier</h3>
              <p className="text-gray-300">Consistently high-quality interactions that exceed customer expectations.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Measurable results</h3>
              <p className="text-gray-300">Comprehensive reporting and analytics to track ROI and performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            Calculate your potential savings in under 30 seconds:
          </h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily call volume</label>
                  <input type="range" min="10" max="10000" defaultValue="1000" className="w-full" />
                  <div className="text-right text-lg font-semibold">1,000 calls</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average call duration (minutes)</label>
                  <input type="range" min="1" max="60" defaultValue="5" className="w-full" />
                  <div className="text-right text-lg font-semibold">5 minutes</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current cost per call ($)</label>
                  <input type="range" min="0.5" max="10" defaultValue="3" step="0.5" className="w-full" />
                  <div className="text-right text-lg font-semibold">$3.00</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI agent cost per call ($)</label>
                  <input type="range" min="0.1" max="2" defaultValue="0.5" step="0.1" className="w-full" />
                  <div className="text-right text-lg font-semibold">$0.50</div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Your Savings</h3>
              <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily calls:</span>
                      <span className="font-semibold">1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current cost:</span>
                      <span className="font-semibold">$3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI cost:</span>
                      <span className="font-semibold">$500</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Daily savings:</span>
                        <span className="text-green-600">$2,500</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Monthly savings:</span>
                        <span className="text-green-600">$75,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/auth/signup" className="block w-full bg-black text-white text-center py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Get started with the Pro Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
            Trusted by leaders who understand the AI advantage.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "ProctorAI reduced our call center costs by 80% while improving customer satisfaction. The AI agents are incredibly natural.",
                author: "Sarah Johnson",
                title: "VP of Operations, TechCorp"
              },
              {
                quote: "We've scaled from 100 to 10,000 daily calls without hiring additional staff. The ROI is phenomenal.",
                author: "Michael Chen",
                title: "CEO, GlobalCall Solutions"
              },
              {
                quote: "The voice quality and natural conversation flow exceeded our expectations. Customers can't tell it's AI.",
                author: "Emily Rodriguez",
                title: "Customer Experience Director"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 text-white p-8 rounded-xl">
                <p className="text-lg mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold text-lg">{testimonial.author}</div>
                  <div className="text-gray-300">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to transform your customer support?
          </h2>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
            Try it risk-free for 7 days. No credit card required.
          </p>
          <Link href="/auth/signup" className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Try it risk-free for 7 days
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">ProctorAI.</h3>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">Pricing</a></li>
                <li><a href="#" className="hover:text-black">Features</a></li>
                <li><a href="#" className="hover:text-black">API</a></li>
                <li><a href="#" className="hover:text-black">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">About</a></li>
                <li><a href="#" className="hover:text-black">Careers</a></li>
                <li><a href="#" className="hover:text-black">Blog</a></li>
                <li><a href="#" className="hover:text-black">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">Help Center</a></li>
                <li><a href="#" className="hover:text-black">Contact</a></li>
                <li><a href="#" className="hover:text-black">Status</a></li>
                <li><a href="#" className="hover:text-black">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">Privacy policy</a></li>
                <li><a href="#" className="hover:text-black">Terms of service</a></li>
                <li><a href="#" className="hover:text-black">Cookie policy</a></li>
                <li><a href="#" className="hover:text-black">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© 2024 ProctorAI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-black">Twitter</a>
              <a href="#" className="text-gray-600 hover:text-black">LinkedIn</a>
              <a href="#" className="text-gray-600 hover:text-black">Facebook</a>
          </div>
        </div>
      </div>
      </footer>
    </div>
  );
}