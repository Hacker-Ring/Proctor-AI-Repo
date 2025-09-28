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
            Automate service calls with AI voice agents
          </h1>
          <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
            We create custom tailored voice agents for companies to automate inbound and outbound calls using advanced AI technology.
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
        {/* Wavy bottom border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
          <svg
            className="relative block w-full h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-white"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-white"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Dashboard screenshot*/}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <img 
              src="/Screenshot 2025-09-28 082618.png" 
              alt="Dashboard Screenshot" 
              className="w-full h-auto rounded-xl border-2 border-gray-300 shadow-lg"
            />
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
                { 
                  name: "Call Volume", 
                  value: "2.5M", 
                  data: [120, 135, 148, 162, 175, 190, 210, 225, 240, 255, 270, 285],
                  gradient: "from-blue-500 to-purple-600",
                  bgGradient: "from-blue-50 to-purple-50"
                },
                { 
                  name: "Response Time", 
                  value: "0.3s", 
                  data: [0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.32, 0.31, 0.3, 0.29, 0.28, 0.3],
                  gradient: "from-green-500 to-emerald-600",
                  bgGradient: "from-green-50 to-emerald-50"
                },
                { 
                  name: "Satisfaction", 
                  value: "98%", 
                  data: [85, 87, 89, 91, 93, 94, 95, 96, 97, 97.5, 98, 98],
                  gradient: "from-pink-500 to-rose-600",
                  bgGradient: "from-pink-50 to-rose-50"
                },
                { 
                  name: "Cost Savings", 
                  value: "75%", 
                  data: [45, 50, 55, 60, 65, 68, 70, 72, 73, 74, 74.5, 75],
                  gradient: "from-orange-500 to-red-600",
                  bgGradient: "from-orange-50 to-red-50"
                },
                { 
                  name: "Uptime", 
                  value: "99.9%", 
                  data: [98.5, 98.7, 98.9, 99.1, 99.3, 99.5, 99.6, 99.7, 99.8, 99.85, 99.9, 99.9],
                  gradient: "from-indigo-500 to-blue-600",
                  bgGradient: "from-indigo-50 to-blue-50"
                },
                { 
                  name: "Languages", 
                  value: "50+", 
                  data: [25, 28, 32, 35, 38, 40, 42, 44, 46, 47, 48, 50],
                  gradient: "from-teal-500 to-cyan-600",
                  bgGradient: "from-teal-50 to-cyan-50"
                }
              ].map((metric, index) => {
                const maxValue = Math.max(...metric.data);
                const minValue = Math.min(...metric.data);
                const normalizedData = metric.data.map(val => 
                  ((val - minValue) / (maxValue - minValue)) * 100
                );
                
                const pathData = normalizedData.map((val, i) => 
                  `${i * (100 / (normalizedData.length - 1))},${100 - val}`
                ).join(' L ');
                
                const areaData = `M 0,100 L ${pathData} L 100,100 Z`;
                
                return (
                  <div key={index} className={`bg-gradient-to-br ${metric.bgGradient} p-6 rounded-xl border border-gray-100`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{metric.name}</h3>
                      <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    </div>
                    <div className="relative h-24">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05"/>
                          </linearGradient>
                          <linearGradient id={`line-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.6"/>
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
                          </linearGradient>
                        </defs>
                        {/* Gradient area fill */}
                        <path
                          d={areaData}
                          fill={`url(#gradient-${index})`}
                          className={`text-${metric.gradient.split('-')[1]}-500`}
                        />
                        {/* Line graph */}
                        <path
                          d={`M ${pathData}`}
                          fill="none"
                          stroke={`url(#line-${index})`}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`text-${metric.gradient.split('-')[1]}-500`}
                        />
                        {/* Data points */}
                        {normalizedData.map((val, i) => (
                          <circle
                            key={i}
                            cx={i * (100 / (normalizedData.length - 1))}
                            cy={100 - val}
                            r="1.5"
                            fill="currentColor"
                            className={`text-${metric.gradient.split('-')[1]}-600`}
                          />
                        ))}
                      </svg>
                  </div>
                  </div>
                );
              })}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI Voice Recognition",
                value: "99.2%",
                data: [95, 96, 97, 97.5, 98, 98.2, 98.4, 98.6, 98.8, 99, 99.1, 99.2],
                gradient: "from-emerald-500 to-green-600",
                bgGradient: "from-emerald-50 to-green-50",
                features: ["Real-time speech processing", "Multi-language support", "Emotion detection"],
                type: "radial"
              },
              {
                title: "Call Processing Speed",
                value: "0.8s",
                data: [2.5, 2.2, 1.9, 1.6, 1.4, 1.2, 1.1, 1.0, 0.9, 0.85, 0.82, 0.8],
                gradient: "from-blue-500 to-cyan-600",
                bgGradient: "from-blue-50 to-cyan-50",
                features: ["Instant response", "Low latency", "High throughput"],
                type: "bar"
              },
              {
                title: "Queue Management",
                value: "247",
                data: [180, 190, 200, 210, 220, 225, 230, 235, 240, 242, 245, 247],
                gradient: "from-purple-500 to-violet-600",
                bgGradient: "from-purple-50 to-violet-50",
                features: ["Priority routing", "Load balancing", "Auto-scaling"],
                type: "pulse"
              },
              {
                title: "Response Accuracy",
                value: "98.7%",
                data: [92, 93, 94, 95, 96, 96.5, 97, 97.3, 97.7, 98, 98.4, 98.7],
                gradient: "from-rose-500 to-pink-600",
                bgGradient: "from-rose-50 to-pink-50",
                features: ["Context understanding", "Intent recognition", "Smart routing"],
                type: "wave"
              }
            ].map((feature, index) => {
              const maxValue = Math.max(...feature.data);
              const minValue = Math.min(...feature.data);
              const normalizedData = feature.data.map(val => 
                ((val - minValue) / (maxValue - minValue)) * 100
              );
              
              const renderVisualization = () => {
                switch (feature.type) {
                  case "radial":
                    const percentage = (feature.data[feature.data.length - 1] / 100) * 100;
                    return (
                      <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                            strokeLinecap="round"
                            className={`text-${feature.gradient.split('-')[1]}-500`}
                          />
                          <text
                            x="50"
                            y="50"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-lg font-bold fill-gray-800"
                          >
                            {feature.data[feature.data.length - 1]}%
                          </text>
                        </svg>
                  </div>
                    );
                  
                  case "bar":
                    return (
                      <div className="flex items-end justify-center space-x-1 h-20">
                        {normalizedData.slice(-8).map((val, i) => (
                          <div
                            key={i}
                            className={`bg-gradient-to-t ${feature.gradient} rounded-t-sm`}
                            style={{ 
                              height: `${val}%`,
                              width: '8px'
                            }}
                          ></div>
                        ))}
                  </div>
                    );
                  
                  case "pulse":
                    return (
                      <div className="relative w-24 h-24 mx-auto">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${feature.gradient} animate-pulse`}></div>
                        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-800">{feature.data[feature.data.length - 1]}</span>
                  </div>
                </div>
                    );
                  
                  case "wave":
                    const waveData = normalizedData.map((val, i) => 
                      `${i * (100 / (normalizedData.length - 1))},${50 - (val - 50) * 0.3}`
                    ).join(' L ');
                    
                    return (
                      <div className="relative h-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={`wave-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                              <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
                              <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
                            </linearGradient>
                          </defs>
                          <path
                            d={`M 0,50 Q ${waveData} L 100,50`}
                            fill={`url(#wave-gradient-${index})`}
                            className={`text-${feature.gradient.split('-')[1]}-500`}
                          />
                          <path
                            d={`M 0,50 Q ${waveData} L 100,50`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`text-${feature.gradient.split('-')[1]}-600`}
                          />
                        </svg>
                </div>
                    );
                  
                  default:
                    return null;
                }
              };
              
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.bgGradient} p-6 rounded-xl border border-gray-100`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                    <span className="text-2xl font-bold text-gray-900">{feature.value}</span>
                  </div>
                  
                  <div className="mb-4">
                    {renderVisualization()}
                  </div>
                  
                  <div className="space-y-2">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${feature.gradient.split('-')[1]}-500`}></div>
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
                value: "94%",
                data: [78, 82, 85, 87, 89, 90, 91, 92, 93, 93.5, 94, 94],
                gradient: "from-indigo-500 to-purple-600",
                bgGradient: "from-indigo-50 to-purple-50",
                type: "heatmap"
              },
              {
                title: "Conversations that feel human",
                description: "Natural language processing creates authentic, empathetic interactions that customers trust and prefer.",
                value: "97%",
                data: [85, 87, 89, 91, 93, 94, 95, 95.5, 96, 96.5, 96.8, 97],
                gradient: "from-emerald-500 to-teal-600",
                bgGradient: "from-emerald-50 to-teal-50",
                type: "donut"
              },
              {
                title: "Set it and forget it",
                description: "Fully automated call handling with minimal human intervention required. Your AI agents work 24/7.",
                value: "99.9%",
                data: [95, 96, 97, 98, 98.5, 99, 99.2, 99.4, 99.6, 99.7, 99.8, 99.9],
                gradient: "from-amber-500 to-orange-600",
                bgGradient: "from-amber-50 to-orange-50",
                type: "clock"
              },
              {
                title: "Reach your exact audience",
                description: "Target specific demographics, industries, and customer segments with precision-crafted voice campaigns.",
                value: "89%",
                data: [70, 73, 76, 79, 81, 83, 84, 85, 86, 87, 88, 89],
                gradient: "from-rose-500 to-pink-600",
                bgGradient: "from-rose-50 to-pink-50",
                type: "radar"
              },
              {
                title: "Global customer support",
                description: "Provide seamless support across multiple time zones and languages with our worldwide AI voice network.",
                value: "156",
                data: [120, 125, 130, 135, 140, 142, 145, 147, 150, 152, 154, 156],
                gradient: "from-cyan-500 to-blue-600",
                bgGradient: "from-cyan-50 to-blue-50",
                type: "globe"
              },
              {
                title: "Scalable call volume",
                description: "Handle from 10 to 100,000+ calls simultaneously without compromising quality or response times.",
                value: "100K+",
                data: [10, 50, 100, 500, 1000, 2000, 5000, 10000, 25000, 50000, 75000, 100000],
                gradient: "from-violet-500 to-purple-600",
                bgGradient: "from-violet-50 to-purple-50",
                type: "pyramid"
              }
            ].map((feature, index) => {
              const renderVisualization = () => {
                switch (feature.type) {
                  case "heatmap":
                    return (
                      <div className="grid grid-cols-4 gap-1 h-16">
                        {Array.from({ length: 16 }, (_, i) => {
                          const intensity = Math.random() * 0.8 + 0.2;
                          return (
                            <div
                              key={i}
                              className={`bg-gradient-to-br ${feature.gradient} rounded-sm`}
                              style={{ opacity: intensity }}
                            ></div>
                          );
                        })}
                      </div>
                    );
                  
                  case "donut":
                    const percentage = feature.data[feature.data.length - 1];
                    return (
                      <div className="relative w-16 h-16 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 35}`}
                            strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
                            strokeLinecap="round"
                            className={`text-${feature.gradient.split('-')[1]}-500`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-800">{percentage}%</span>
                        </div>
                      </div>
                    );
                  
                  case "clock":
                    return (
                      <div className="relative w-16 h-16 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200"
                          />
                          {Array.from({ length: 12 }, (_, i) => {
                            const angle = (i * 30) - 90;
                            const x1 = 50 + 35 * Math.cos(angle * Math.PI / 180);
                            const y1 = 50 + 35 * Math.sin(angle * Math.PI / 180);
                            const x2 = 50 + 40 * Math.cos(angle * Math.PI / 180);
                            const y2 = 50 + 40 * Math.sin(angle * Math.PI / 180);
                            return (
                              <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`text-${feature.gradient.split('-')[1]}-500`}
                              />
                            );
                          })}
                          <circle
                            cx="50"
                            cy="50"
                            r="3"
                            fill="currentColor"
                            className={`text-${feature.gradient.split('-')[1]}-600`}
                          />
                        </svg>
                      </div>
                    );
                  
                  case "radar":
                    const points = feature.data.slice(-6).map((val, i) => {
                      const angle = (i * 60) - 90;
                      const radius = (val / 100) * 30;
                      const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                      const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                      return `${x},${y}`;
                    }).join(' L ');
                    
                    return (
                      <div className="relative w-16 h-16 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <polygon
                            points={points}
                            fill={`url(#radar-gradient-${index})`}
                            className={`text-${feature.gradient.split('-')[1]}-500`}
                            opacity="0.3"
                          />
                          <polygon
                            points={points}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`text-${feature.gradient.split('-')[1]}-600`}
                          />
                        </svg>
                      </div>
                    );
                  
                  case "globe":
                    return (
                      <div className="relative w-16 h-16 mx-auto">
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                          <div className="text-white text-xs font-bold">156</div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    );
                  
                  case "pyramid":
                    return (
                      <div className="flex flex-col items-center space-y-1 h-16">
                        {[1, 2, 3, 4].map((level, i) => (
                          <div
                            key={i}
                            className={`bg-gradient-to-r ${feature.gradient} rounded-sm`}
                            style={{ 
                              width: `${(4 - i) * 20}px`,
                              height: '12px',
                              opacity: 0.3 + (i * 0.2)
                            }}
                          ></div>
                        ))}
                      </div>
                    );
                  
                  default:
                    return null;
                }
              };
              
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.bgGradient} p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                    <span className="text-2xl font-bold text-gray-900">{feature.value}</span>
                  </div>
                  
                  <div className="mb-4 flex justify-center">
                    {renderVisualization()}
                  </div>
                  
                <p className="text-gray-600">{feature.description}</p>
              </div>
              );
            })}
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
              { 
                name: "Support Calls", 
                value: "1.2M",
                data: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1180, 1190, 1195, 1200],
                gradient: "from-blue-500 to-cyan-500",
                type: "bubble"
              },
              { 
                name: "Sales Calls", 
                value: "850K",
                data: [600, 650, 700, 720, 750, 780, 800, 820, 830, 835, 840, 850],
                gradient: "from-green-500 to-emerald-500",
                type: "spiral"
              },
              { 
                name: "Follow-ups", 
                value: "2.1M",
                data: [1500, 1600, 1700, 1800, 1850, 1900, 1950, 2000, 2050, 2080, 2095, 2100],
                gradient: "from-purple-500 to-violet-500",
                type: "network"
              },
              { 
                name: "Satisfaction", 
                value: "98%",
                data: [92, 93, 94, 95, 96, 96.5, 97, 97.3, 97.7, 98, 98, 98],
                gradient: "from-rose-500 to-pink-500",
                type: "gauge"
              }
            ].map((metric, index) => {
              const renderVisualization = () => {
                switch (metric.type) {
                  case "bubble":
                    return (
                      <div className="relative h-16 flex items-center justify-center">
                        {[0.3, 0.5, 0.7, 0.9, 1.0].map((size, i) => (
                          <div
                            key={i}
                            className={`absolute rounded-full bg-gradient-to-r ${metric.gradient} opacity-${20 + i * 20}`}
                            style={{
                              width: `${size * 40}px`,
                              height: `${size * 40}px`,
                              left: `${50 - (size * 20)}%`,
                              top: `${50 - (size * 20)}%`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    );
                  
                  case "spiral":
                    return (
                      <div className="relative h-16 w-16 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <path
                            d="M 50,50 Q 60,40 70,50 Q 60,60 50,50 Q 40,60 30,50 Q 40,40 50,50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className={`text-${metric.gradient.split('-')[1]}-500`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="2"
                            fill="currentColor"
                            className={`text-${metric.gradient.split('-')[1]}-600`}
                          />
                        </svg>
                      </div>
                    );
                  
                  case "network":
                    return (
                      <div className="relative h-16 w-16 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {Array.from({ length: 6 }, (_, i) => {
                            const angle = (i * 60) - 90;
                            const x = 50 + 30 * Math.cos(angle * Math.PI / 180);
                            const y = 50 + 30 * Math.sin(angle * Math.PI / 180);
                            return (
                              <g key={i}>
                                <line
                                  x1="50"
                                  y1="50"
                                  x2={x}
                                  y2={y}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className={`text-${metric.gradient.split('-')[1]}-500`}
                                  opacity="0.6"
                                />
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="3"
                                  fill="currentColor"
                                  className={`text-${metric.gradient.split('-')[1]}-600`}
                                />
                              </g>
                            );
                          })}
                          <circle
                            cx="50"
                            cy="50"
                            r="4"
                            fill="currentColor"
                            className={`text-${metric.gradient.split('-')[1]}-700`}
                          />
                        </svg>
                      </div>
                    );
                  
                  case "gauge":
                    const percentage = metric.data[metric.data.length - 1];
                    const angle = (percentage / 100) * 180;
                    return (
                      <div className="relative h-16 w-16 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <path
                            d="M 20,80 A 30,30 0 0,1 80,80"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-gray-600"
                          />
                          <path
                            d="M 20,80 A 30,30 0 0,1 80,80"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${Math.PI * 30}`}
                            strokeDashoffset={`${Math.PI * 30 * (1 - percentage / 100)}`}
                            strokeLinecap="round"
                            className={`text-${metric.gradient.split('-')[1]}-500`}
                          />
                          <text
                            x="50"
                            y="75"
                            textAnchor="middle"
                            className="text-xs font-bold fill-white"
                          >
                            {percentage}%
                          </text>
                        </svg>
                      </div>
                    );
                  
                  default:
                    return null;
                }
              };
              
              return (
              <div key={index} className="bg-gray-800 p-6 rounded-xl">
                <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-gray-300 mb-4">{metric.name}</div>
                  <div className="flex justify-center">
                    {renderVisualization()}
                  </div>
              </div>
              );
            })}
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