import type { Metadata } from "next";
import Link from "next/link";
import { Check, Crown, MessageSquare, Sparkles } from "lucide-react";
import { CheckoutButton } from "./checkout-button";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pro Membership",
  description:
    "Join Daily Word Categories Pro for premium walkthroughs, archive explanations, and member discussion access.",
};

const benefits = [
  "Full daily solving walkthrough",
  "Premium archive explanations",
  "Member badge in the forum",
  "Ad-free product promise",
  "Early access positioning for future word games",
];

export default function MembershipPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <nav className={styles.nav}>
          <Link href="/">Play today</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/forum">Forum</Link>
        </nav>

        <div className={styles.mark}>
          <Crown size={24} aria-hidden="true" />
        </div>
        <h1>Go deeper than the answer.</h1>
        <p>
          Pro turns each daily puzzle into a short lesson: why each category
          works, where the traps sit, and how stronger solvers read the board.
        </p>

        <div className={styles.pricePanel}>
          <span>Pro Member</span>
          <strong>$3.99 / month</strong>
          <small>Cancel anytime. Checkout is handled by Stripe.</small>
          <CheckoutButton />
        </div>
      </section>

      <section className={styles.grid} aria-label="Membership benefits">
        {benefits.map((benefit) => (
          <article className={styles.card} key={benefit}>
            <Check size={17} aria-hidden="true" />
            <span>{benefit}</span>
          </article>
        ))}
      </section>

      <section className={styles.split}>
        <article>
          <Sparkles size={18} aria-hidden="true" />
          <h2>Premium guides</h2>
          <p>
            Read the daily solve path in plain English: opening group, middle
            traps, final category logic, and what to remember tomorrow.
          </p>
        </article>
        <article>
          <MessageSquare size={18} aria-hidden="true" />
          <h2>Member community</h2>
          <p>
            Keep the forum compact and useful: strategy posts, daily puzzle
            reactions, feedback, and member-first product updates.
          </p>
        </article>
      </section>
    </main>
  );
}
