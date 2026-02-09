import { useState } from "react";
import { feedbackAPI } from "../../config/api";
import toast from "react-hot-toast";

export default function Feedback() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: prev[name]
          ? checked
            ? [...prev[name], value]
            : prev[name].filter((v) => v !== value)
          : [value],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackAPI.submit(formData);
      toast.success("Thank you for sharing your thoughts 🤍");
      setFormData({});
    } catch (err) {
      toast.error(err?.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff6fa] to-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

        {/* HEADER */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-4">
          REVE CULT — Experience & Growth Feedback
        </h1>

        <p className="text-gray-500 text-center max-w-xl mx-auto mb-14 leading-relaxed">
          Thank you for being part of REVE CULT 🤍  
          <br />
          Your voice helps us shape a more thoughtful, women-first brand.
        </p>

        <form onSubmit={handleSubmit} className="space-y-14">

          {/* ================= SECTION CARD ================= */}
          <Section title="Basic Details" emoji="🌷">
            <Input
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email ID"
              onChange={handleChange}
            />

            <RadioGroup
              title="Age Group"
              name="ageGroup"
              options={["Under 18", "18–22", "23–28", "29–35", "35+"]}
              onChange={handleChange}
            />

            <RadioGroup
              title="Occupation"
              name="occupation"
              options={[
                "Student",
                "Working Professional",
                "Creator / Influencer",
                "Business Owner",
                "Other",
              ]}
              onChange={handleChange}
            />
          </Section>

          <Section title="Product Experience & Development" emoji="🎧">
            <CheckboxGroup
              title="What attracted you most towards REVE CULT?"
              name="attraction"
              options={[
                "Artwork & aesthetic design",
                "Women-first concept",
                "Premium packaging",
                "Unique gifting idea",
                "Brand story",
              ]}
              onChange={handleChange}
            />

            <CheckboxGroup
              title="Where do you see yourself using REVE CULT products most?"
              name="usage"
              options={[
                "Daily lifestyle",
                "Travel",
                "Work / Study",
                "Gifting",
              ]}
              onChange={handleChange}
            />

            <Textarea
              name="premiumValue"
              placeholder="What would make REVE CULT feel even more premium or valuable to you?"
              onChange={handleChange}
            />

            <Textarea
              name="futureImprovements"
              placeholder="What new features, designs, or improvements would you love to see?"
              onChange={handleChange}
            />
          </Section>

          <Section title="Marketing & Social Media" emoji="✨">
            <CheckboxGroup
              title="Where do you usually discover new brands?"
              name="discovery"
              options={[
                "Instagram",
                "YouTube",
                "Pinterest",
                "Influencers",
                "Friends / Recommendations",
              ]}
              onChange={handleChange}
            />

            <CheckboxGroup
              title="What kind of marketing attracts you most?"
              name="marketing"
              options={[
                "Founder stories",
                "Couple / lifestyle reels",
                "Women empowerment content",
                "Influencer collaborations",
                "Real customer experiences",
                "Offers & gifting campaigns",
                "Aesthetic product shoots",
                "Behind-the-scenes / startup journey",
              ]}
              onChange={handleChange}
            />

            <Textarea
              name="shareCampaign"
              placeholder="What kind of campaign would make you share REVE CULT with friends?"
              onChange={handleChange}
            />

            <Textarea
              name="genZGrowth"
              placeholder="How can REVE CULT grow stronger among Gen Z & women audiences?"
              onChange={handleChange}
            />
          </Section>

          <Section title="Brand Connection" emoji="🤍">
            <CheckboxGroup
              title="How does REVE CULT make you feel?"
              name="emotion"
              options={[
                "Confident",
                "Stylish",
                "Empowered",
                "Unique",
                "Connected to the brand",
              ]}
              onChange={handleChange}
            />

            <RadioGroup
              title="Would you like to be part of the REVE CULT Creator or Early Community?"
              name="community"
              options={["Yes", "Maybe later"]}
              onChange={handleChange}
            />
          </Section>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:shadow-xl transition"
          >
            Submit Feedback 🤍
          </button>

          <p className="text-center text-sm text-gray-400">
            Thank you for being part of REVE CULT 🤍 <br />
            Join the CULT for early updates & launches <br />
            👉 <a href="https://www.revecult.com" className="text-pink-600">www.revecult.com</a>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE UI COMPONENTS ================= */

function Section({ title, emoji, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
      {...props}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      rows="3"
      className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
      {...props}
    />
  );
}

function RadioGroup({ title, name, options, onChange }) {
  return (
    <div>
      <p className="font-medium mb-2">{title}</p>
      <div className="space-y-1">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2">
            <input type="radio" name={name} value={o} onChange={onChange} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({ title, name, options, onChange }) {
  return (
    <div>
      <p className="font-medium mb-2">{title}</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2">
            <input type="checkbox" name={name} value={o} onChange={onChange} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}
