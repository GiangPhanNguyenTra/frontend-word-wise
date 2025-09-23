import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { FeatureSection } from "@/components/landing/FeatureSection";

// Dữ liệu cho các feature sections để dễ quản lý
const features = [
  {
    title: (
      <>
        <span className="text-primary">You can learn anywhere</span> – online or
        on the go
      </>
    ),
    description:
      "Capture new words directly while browsing the web. Each word is saved with context and AI-powered examples, so you can review anytime, anywhere.",
    imageUrl: "/images/landing/feature-1.png", // Thay bằng tên file của bạn
  },
  {
    title: "Learn smarter, remember longer",
    description:
      "Each word you collect is linked with real-world examples, collocations, and grammar hints. Our system ensures you review words just before you're about to forget them, making memorization more natural and long-lasting. Instead of rote learning, you build active vocabulary that you can confidently use in real communication.",
    imageUrl: "/images/landing/feature-2.png", // Thay bằng tên file của bạn
    reverse: true,
  },
  {
    title: "Practice through interactive challenges",
    description:
      "Learning is more effective when it's fun. That's why Word Wise integrates mini-games, quizzes, and pronunciation practice. You can compete with friends in real-time challenge rooms, test your knowledge with flashcards, or let AI score your pronunciation to track your improvement.",
    imageUrl: "/images/landing/feature-3.png", // Thay bằng tên file của bạn
  },
  {
    title: "Learn together, grow together",
    description:
      "Word Wise is not just a personal learning tool, but also a community-driven platform. Share your vocabulary collections with friends, explore trending words from global news sources, or join group discussions about your favorite topics. With Word Wise, you're never learning alone—you're part of a global network of language learners.",
    imageUrl: "/images/landing/feature-3.png", // Thay bằng tên file của bạn
    reverse: true,
  },
];

// Dữ liệu cho testimonials
const testimonials = [
  {
    quote:
      "New words I was reading online. The AI examples helped me actually use them in real conversations.",
    author: "Jack Watson",
    time: "14 days",
  },
  {
    quote:
      "The spaced repetition system keeps reminding me at the right time. I've finally stopped forgetting words after a week!",
    author: "Jack Watson",
    time: "14 days",
  },
  {
    quote:
      "I love the challenge rooms! Competing with friends makes vocabulary practice so much more fun and motivating.",
    author: "Jack Watson",
    time: "14 days",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-baseBackground px-20">
      <Header />

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="relative bg-gradient-to-r from-blue-500 to-primary pt-32 pb-20 -mx-20 px-20"
        >
          <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                Studying English Vocabulary is now smarter and easier
              </h1>
              <p className="text-lg text-tint2 mb-8">
                Word Wise is an intelligent platform that helps you learn and
                master English vocabulary seamlessly, anytime, anywhere.
              </p>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondaryShape4 text-white font-bold px-8 py-6 text-lg"
              >
                Let&#39;s start
              </Button>
            </div>
            <div>
              <Image
                src="/images/landing/hero-illustration.png" // Thay bằng tên file của bạn
                alt="Hero Illustration"
                width={600}
                height={500}
              />
            </div>
          </div>
        </section>

        {/* Feature Sections */}
        <section className="bg-vector-pattern">
          {features.map((feature, index) => (
            <FeatureSection key={index} {...feature} />
          ))}
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <h3 className="text-4xl font-bold text-shape4 leading-tight mb-12">
              Smart Vocabulary Learning with{" "}
              <span className="text-primary">Word Wise</span>
            </h3>
            <div className="grid md:grid-cols-2 items-center gap-12 text-left">
              <Image
                src="/images/landing/about-us.png"
                alt="About us illustration"
                width={500}
                height={400}
              />
              <p className="text-lg text-gray-600">
                Word Wise is an intelligent platform that helps learners expand
                their English vocabulary in a natural and effective way. By
                combining a smart browser extension, AI-powered practice, and a
                community-driven web app, Word Wise makes every moment an
                opportunity to learn. Our mission is to help students and
                professionals learn smarter, remember longer, and stay motivated
                together.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-vector-pattern py-24">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Here&#39;s what others love about Word Wise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Our learners are building vocabulary more effectively than ever.
              Here&#39;s what some of them say...
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg text-left"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-secondary">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="font-bold text-shape4">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
