import type { Metadata } from "next";
import Link from "next/link";
import { Check, Crown, MessageSquare, Sparkles } from "lucide-react";
import { CheckoutButton } from "./checkout-button";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "gameJack Pro Membership",
  description:
    "Join new game Pro on gameJack for premium walkthroughs, archive explanations, and member discussion access.",
};

const benefits = [
  "Full daily solving walkthrough",
  "Premium archive explanations",
  "gameJack member badge",
  "Ad-free product promise",
  "Early access positioning for future games",
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
        <h1>Enter the gameJack pro room.</h1>
        <p>
          new game Pro turns every daily puzzle into a strategy file: category
          logic, trap positions, and the moves stronger solvers see first.
        </p>

        <div className={styles.pricePanel}>
          <span>new game Pro</span>
          <strong>$3.99 / month</strong>
          <small>Cancel anytime. Checkout is handled by Paddle.</small>
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
            Read AAA guide summaries in plain English: route order, build
            priority, boss counters, map checks, and what to do next.
          </p>
        </article>
        <article>
          <MessageSquare size={18} aria-hidden="true" />
          <h2>Member community</h2>
          <p>
            Members can open focused forum threads for a specific game, boss,
            build, quest, or collectible route without noisy public clutter.
          </p>
        </article>
      </section>
    </main>
  );
}
