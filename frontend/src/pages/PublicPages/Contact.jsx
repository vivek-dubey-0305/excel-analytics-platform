import React, { useState } from 'react';
import { useTheme } from "../../context/ThemeContext";

const Contact = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create mailto URL with form data
      const subject = encodeURIComponent(`[ExcelAnalytics] ${formData.subject || 'Contact Form Submission'}`);
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Type: ${formData.type}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent from ExcelAnalytics Contact Form
      `);
      
      const mailtoUrl = `mailto:vivek.dubey0305@gmail.com?subject=${subject}&body=${body}`;
      
      // Open user's default email client
      window.location.href = mailtoUrl;
      
      setSubmitStatus('success');
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'general'
        });
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-gray-50" : "bg-gray-900"
    }`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 right-10 w-72 h-72 rounded-full opacity-10 ${
            theme === "light" ? "bg-gradient-to-br from-green-400 to-blue-500" : "bg-gradient-to-br from-green-600 to-emerald-800"
          }`}></div>
          <div className={`absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-10 ${
            theme === "light" ? "bg-gradient-to-tr from-emerald-400 to-green-600" : "bg-gradient-to-tr from-green-500 to-teal-700"
          }`}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium mb-8 ${
              theme === "light" 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-green-900/30 text-green-300 border border-green-700/50"
            }`}>
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Get In Touch
            </div>
            
            <h1 className={`text-5xl lg:text-7xl font-black leading-tight mb-8 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Contact 
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Us
              </span>
            </h1>

            <p className={`text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}>
              Have questions, feedback, or need support? We'd love to hear from you. 
              Our team is here to help you succeed with ExcelAnalytics.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "📧",
                title: "Email Support",
                description: "Get help with technical issues, billing questions, or general inquiries.",
                contact: "vivek.dubey0305@gmail.com",
                action: "Send Email",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "💬",
                title: "Live Chat",
                description: "Chat with our support team in real-time during business hours.",
                contact: "Available 9 AM - 6 PM IST",
                action: "Start Chat",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "📞",
                title: "Phone Support",
                description: "Speak directly with our team for urgent matters or complex issues.",
                contact: "+91-XXX-XXXX-XXX",
                action: "Call Now",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((method, index) => (
              <div 
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "light" 
                    ? "bg-gray-50 hover:bg-white hover:shadow-xl" 
                    : "bg-gray-700 hover:bg-gray-600 hover:shadow-2xl"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                  {method.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  {method.title}
                </h3>
                <p className={`text-lg leading-relaxed mb-4 ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  {method.description}
                </p>
                <div className={`font-semibold mb-4 ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}>
                  {method.contact}
                </div>
                <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  theme === "light"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-green-900/50 text-green-300 hover:bg-green-800/70"
                }`}>
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={`py-20 ${
        theme === "light" ? "bg-gradient-to-br from-green-50 to-blue-50" : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Send Us a <span className="text-green-600">Message</span>
              </h2>
              <p className={`text-xl ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div className={`p-8 rounded-2xl ${
                theme === "light" 
                  ? "bg-white/80 backdrop-blur-sm shadow-xl" 
                  : "bg-gray-800/80 backdrop-blur-sm shadow-2xl"
              }`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-gray-700 border-gray-600 text-white"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-gray-700 border-gray-600 text-white"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Inquiry Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-gray-700 border-gray-600 text-white"
                      }`}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-gray-700 border-gray-600 text-white"
                      }`}
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-gray-700 border-gray-600 text-white"
                      }`}
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${
                      isSubmitting
                        ? "bg-gray-400 text-gray-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Opening Email Client...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        📧 Send Message
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className={`p-4 rounded-lg ${
                      theme === "light" 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-green-900/50 text-green-300 border border-green-700"
                    }`}>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">✅</span>
                        <div>
                          <strong>Email client opened successfully!</strong>
                          <p className="text-sm mt-1">Please send the email from your email application.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className={`p-4 rounded-lg ${
                      theme === "light" 
                        ? "bg-red-100 text-red-800 border border-red-200" 
                        : "bg-red-900/50 text-red-300 border border-red-700"
                    }`}>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">❌</span>
                        <div>
                          <strong>Error opening email client</strong>
                          <p className="text-sm mt-1">Please try again or email us directly at vivek.dubey0305@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className={`p-8 rounded-2xl ${
                  theme === "light" 
                    ? "bg-white/80 backdrop-blur-sm shadow-lg" 
                    : "bg-gray-800/80 backdrop-blur-sm shadow-2xl"
                }`}>
                  <h3 className={`text-2xl font-bold mb-6 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    Other Ways to Reach Us
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl">
                        📧
                      </div>
                      <div>
                        <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          Email
                        </div>
                        <div className="text-green-600">vivek.dubey0305@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-xl">
                        🌐
                      </div>
                      <div>
                        <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          Website
                        </div>
                        <div className="text-blue-600">excelanalytics.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-xl">
                        🕒
                      </div>
                      <div>
                        <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          Response Time
                        </div>
                        <div className={`${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                          Usually within 24 hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-8 rounded-2xl ${
                  theme === "light" 
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200" 
                    : "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50"
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    💡 Quick Tips
                  </h3>
                  <ul className={`space-y-2 text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}>
                    <li>• Include specific details about your issue</li>
                    <li>• Attach screenshots if reporting a bug</li>
                    <li>• Mention your browser and operating system</li>
                    <li>• Check our FAQ section for quick answers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Frequently Asked <span className="text-green-600">Questions</span>
            </h2>
            <p className={`text-xl ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How quickly will I receive a response?",
                answer: "We typically respond to all inquiries within 24 hours during business days. For urgent technical issues, we aim to respond within 4-6 hours."
              },
              {
                question: "What information should I include in my support request?",
                answer: "Please include your email, a clear description of the issue, steps to reproduce the problem, browser/device information, and any relevant screenshots."
              },
              {
                question: "Do you offer phone support?",
                answer: "Currently, we provide support primarily through email and live chat. Phone support is available for enterprise customers or critical issues."
              },
              {
                question: "Can I request new features?",
                answer: "Absolutely! We love hearing feature requests from our users. Use the 'Feature Request' option in the contact form to share your ideas."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                  theme === "light" ? "bg-gray-50 hover:shadow-lg" : "bg-gray-700 hover:shadow-2xl"
                }`}
              >
                <h3 className={`text-lg font-bold mb-3 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  {faq.question}
                </h3>
                <p className={`leading-relaxed ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;