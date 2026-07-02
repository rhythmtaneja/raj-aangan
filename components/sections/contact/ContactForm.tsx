"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/anim/Reveal";

const serif = { fontFamily: "var(--font-cormorant-garamond)" } as const;

// ═══════════════════════════════════════════════════════════════════════════
// ─── TUNE THESE KNOBS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_BG = "#0f2f3b"; // dark navy behind the white card (from figma 5)

// ─ White message card ──
const CARD_BG = "#ffffff";
const CARD_PAD_X = "px-6 md:px-14";
const CARD_PAD_Y = "py-12 md:py-16";

// ─ Copy ──
const TITLE_TEXT = "Message Us";
const SUBTITLE_TEXT = "Have any question for our services? We're here to help you.";

// ─ Submit button (beige/gold rectangle from figma) ──
const SUBMIT_BG = "#d0b880";
const SUBMIT_HOVER = "#c1a76d";
const SUBMIT_TEXT = "Send your message";

// ─ Photo on the right ──
const PHOTO_SRC = "/images/contact-form.jpg";
const PHOTO_ASPECT = "aspect-[4/5]";

// ═══════════════════════════════════════════════════════════════════════════

export default function ContactForm() {
  // Controlled form state — light-touch. Wire up your backend / email service
  // inside handleSubmit later (Resend, SendGrid, /api/contact route, etc.).
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    request: "",
  });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to real endpoint. For now just flag as sent.
    console.log("Contact form submission:", form);
    setSent(true);
  }

  return (
    <section
      id="message"
      className="w-full px-6 py-24 md:px-16 md:py-32"
      style={{ backgroundColor: SECTION_BG }}
    >
      <Reveal>
        <div
          className="mx-auto w-full max-w-6xl overflow-hidden"
          style={{ backgroundColor: CARD_BG }}
        >
          <div className={`grid grid-cols-1 md:grid-cols-[1.15fr_1fr]`}>
            {/* LEFT — form */}
            <div className={`${CARD_PAD_X} ${CARD_PAD_Y}`}>
              <h2
                style={{ ...serif, fontSize: "clamp(2rem, 3vw, 58px)" }}
                className="mb-4 font-semibold text-[#191919]"
              >
                {TITLE_TEXT}
              </h2>

              <p className="mb-10 max-w-md text-[clamp(0.95rem,1.05vw,20px)] text-[#4a4a4a]">
                {SUBTITLE_TEXT}
              </p>

              {sent ? (
                <div className="rounded border border-[#d0b880] bg-[#faf5e8] px-6 py-6">
                  <p style={serif} className="text-lg text-[#191919]">
                    Thank you — your message is on its way. We'll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <Textarea
                    name="request"
                    placeholder="Special Request"
                    value={form.request}
                    onChange={handleChange}
                    rows={5}
                  />

                  <button
                    type="submit"
                    style={{ backgroundColor: SUBMIT_BG }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = SUBMIT_HOVER)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SUBMIT_BG)}
                    className="mt-4 w-fit px-8 py-3.5 font-medium text-[#191919] transition-colors text-[clamp(0.95rem,1.1vw,22px)]"
                  >
                    {SUBMIT_TEXT}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT — photo */}
            <div className={`relative ${PHOTO_ASPECT} w-full md:aspect-auto md:h-full`}>
              <Image
                src={PHOTO_SRC}
                alt="Venue interior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Small styled inputs ───────────────────────────────────────────── */

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded border border-[#191919]/25 bg-transparent px-5 py-3.5 text-[#191919] outline-none placeholder:text-[#8a8a8a] focus:border-[#191919] transition-colors text-[clamp(0.95rem,1.05vw,20px)] " +
        (props.className ?? "")
      }
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "w-full resize-none rounded border border-[#191919]/25 bg-transparent px-5 py-3.5 text-[#191919] outline-none placeholder:text-[#8a8a8a] focus:border-[#191919] transition-colors text-[clamp(0.95rem,1.05vw,20px)] " +
        (props.className ?? "")
      }
    />
  );
}
