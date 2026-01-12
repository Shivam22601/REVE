import { useState } from "react";
import {
  Search,
  Mail,
  MessageCircle,
  Book,
  HelpCircle,
  Phone,
  Clock,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Support() {
  const Motion = motion;
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        'Go to the login page and click "Forgot Password". Follow the instructions sent to your email.',
      keywords: ["password", "reset", "login"],
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, UPI, and PayPal for smooth checkout.",
      keywords: ["payment", "upi", "pay"],
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes! We offer a 30-day money-back guarantee on all REVE CULT products.",
      keywords: ["refund", "return"],
    },
    {
      question: "How can I cancel my subscription?",
      answer:
        'Go to Account Settings → Subscription → Click "Cancel Subscription".',
      keywords: ["cancel", "subscription"],
    },
  ];

  const supportOptions = [
    {
      icon: <Mail className="w-6 h-6 text-purple-500" />,
      title: "Email Support",
      description: "Replies within 12–24 hours",
      action: "support@revecult.com",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-pink-500" />,
      title: "Live Chat",
      description: "Instant support (9 AM – 6 PM)",
      action: "Start Chat",
    },
    {
      icon: <Phone className="w-6 h-6 text-purple-400" />,
      title: "Call Us",
      description: "For urgent issues",
      action: "+91 90826 72164",
    },
    {
      icon: <Book className="w-6 h-6 text-rose-400" />,
      title: "Guides & Docs",
      description: "Learn everything quickly",
      action: "View Docs",
    },
  ];

  const searchResults = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some((k) => k.includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* HERO SECTION */}
      <section className="py-24 px-6 text-center border-b bg-gradient-to-br from-[#EDE7FF] via-[#FBE8F4] to-white">
        <Motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Support Center
        </Motion.h1>

        <Motion.p
          className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          We’re here for you — calm, clear, pastel-soft support for every REVE CULT user.
        </Motion.p>

        {/* Search Bar */}
        <Motion.div
          className="relative max-w-xl mx-auto mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search support articles..."
            className="w-full border rounded-full py-4 pl-12 pr-12 text-gray-900 bg-[#F6F4FF] focus:ring-2 focus:ring-purple-300 outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.trim().length > 0);
            }}
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
          )}

          {/* Search Results */}
          <AnimatePresence>
            {showSearchResults && (
              <Motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bg-white w-full mt-3 shadow-xl rounded-2xl max-h-80 overflow-y-auto border border-gray-200 z-20"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((faq, i) => (
                    <div
                      key={i}
                      className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="font-medium text-gray-800">{faq.question}</p>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-sm text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      </section>

      {/* SUPPORT OPTIONS */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {supportOptions.map((opt, i) => (
          <Motion.div
            key={i}
            className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:shadow-purple-100 transition cursor-pointer"
            whileHover={{ scale: 1.03 }}
          >
            <div className="mb-4">{opt.icon}</div>
            <h3 className="font-semibold text-lg text-gray-900">{opt.title}</h3>
            <p className="text-gray-500 text-sm mt-2">{opt.description}</p>
            <button className="mt-4 text-purple-600 font-medium">
              {opt.action} →
            </button>
          </Motion.div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-900">
          <HelpCircle className="text-purple-500" /> FAQs
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="bg-[#FAF7FF] border border-purple-100 rounded-2xl p-5 cursor-pointer shadow-sm"
            >
              <summary className="font-semibold text-lg text-gray-800">
                {faq.question}
              </summary>
              <p className="text-gray-600 mt-3 ml-1">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Still need help?</h2>
        <p className="text-gray-600 mb-8">
          Fill out the form and our team will contact you soon.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Name"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
          />
          <InputField
            label="Email"
            value={formData.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
          />
        </div>

        <InputField
          label="Subject"
          value={formData.subject}
          onChange={(v) => setFormData({ ...formData, subject: v })}
        />

        <label className="text-sm font-medium text-gray-600 mt-4">
          Message
        </label>
        <textarea
          rows="6"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full border rounded-2xl p-4 mt-2 bg-[#F6F4FF] outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
        />

        <Motion.button
          whileHover={{ scale: 1.02 }}
          className="mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-full font-semibold shadow-md hover:shadow-lg"
        >
          <Send className="inline w-5 h-5 mr-2" />
          Send Message
        </Motion.button>

        <div className="mt-10 flex items-center gap-3 text-gray-600">
          <Clock className="w-5 h-5 text-purple-500" />
          Support Hours: Mon–Fri, 9 AM – 6 PM IST
        </div>
      </section>
    </div>
  );
}

/* INPUT FIELD COMPONENT */
function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className="w-full border rounded-2xl p-4 mt-2 bg-[#F6F4FF] outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
