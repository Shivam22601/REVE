import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const policies = [
  {
    title: "Replacement Policy",
    content: `
We want you to truly love what you receive.
If your product arrives damaged, defective, or not working as expected,
you may request a replacement within 7 days of delivery.

Please ensure the product is unused, in its original packaging,
and includes all accessories.
    `,
  },
  {
    title: "Cancellation Policy",
    content: `
Orders can be cancelled before they are shipped.
Once the order is dispatched, cancellations cannot be processed.

For prepaid orders, refunds are initiated within 5–7 working days
after successful cancellation.
    `,
  },
  {
    title: "Product Pricing",
    content: `
All prices displayed on our website are inclusive of applicable taxes.
Prices and offers may change without prior notice.

Promotional offers are valid for a limited period only.
    `,
  },
  {
    title: "Security & Privacy",
    content: `
Your safety matters to us.
We use trusted and secure payment gateways with advanced encryption.

Your personal and payment details are protected,
and we never store card information on our servers.
    `,
  },
  {
    title: "Out of Stock Situations",
    content: `
In rare cases, a product may go out of stock after your order is placed.
We will notify you at the earliest.

You may choose a full refund or an alternative product of similar value.
    `,
  },
  {
    title: "Delivery of Products",
    content: `
Orders are usually delivered within 3–7 business days.
Delivery timelines may vary depending on your location.

Thank you for your patience while we bring something special to you.
    `,
  },
];

export default function ReturnPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50">

      {/* ================= HERO ================= */}
      <div className="relative py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
            Return & Exchange Policy
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Because your comfort, trust, and happiness matter to us.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-6 pb-28">
        <div className="space-y-6">

          {policies.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur rounded-[2rem] shadow-xl border border-white overflow-hidden"
            >
              {/* ================= HEADER BUTTON ================= */}
              <button
                onClick={() => toggle(index)}
                className={`
                  w-full flex justify-between items-center
                  px-8 py-6 text-left
                  rounded-[2rem]
                  transition-all duration-300
                  ${
                    openIndex === index
                      ? "bg-gradient-to-r from-pink-100 to-purple-100 shadow-inner"
                      : "bg-white/70 hover:bg-pink-50/60"
                  }
                `}
              >
                <span className="text-gray-800 text-lg font-medium">
                  {item.title}
                </span>

                {/* ICON */}
                <span
                  className={`
                    flex items-center justify-center
                    w-11 h-11 rounded-full
                    transition-all duration-300
                    ${
                      openIndex === index
                        ? "bg-pink-500 text-white shadow-lg"
                        : "bg-pink-100 text-pink-500"
                    }
                  `}
                >
                  {openIndex === index ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </span>
              </button>

              {/* ================= BODY ================= */}
              {openIndex === index && (
                <div className="px-8 pb-8 pt-2 text-gray-600 leading-relaxed whitespace-pre-line text-[15.5px]">
                  {item.content}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
