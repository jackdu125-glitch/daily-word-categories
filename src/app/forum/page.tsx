import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Bug,
  CircleDot,
  Gamepad2,
  MessageSquare,
  Palette,
  Radio,
  ShieldAlert,
  Swords,
} from "lucide-react";
import { getForumPosts } from "@/lib/community-data";
import { ForumClient } from "./forum-client";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "gameJack Forum",
  description:
    "Discuss new game strategy, announcements, fan art, bug reports, and daily solving notes on gameJack.",
};

const sideLinks = [
  ["Announcements", Bell],
  ["General", MessageSquare],
  ["Guides", BookOpen],
  ["Fan-Art", Palette],
  ["Bug Report", Bug],
] as const;

export default async function ForumPage() {
  const posts = await getForumPosts();

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.logo} href="/">
          <Gamepad2 size={23} aria-hidden="true" />
          <span>new game</span>
        </Link>
        <nav>
          <Link href="/">Play</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/membership">Pro</Link>
        </nav>
        <div className={styles.playerCard}>
          <span>gameJack ID</span>
          <strong>Lv. 27 Word Ranger</strong>
        </div>
      </div>

      <div className={styles.hub}>
        <aside className={styles.sidebar} aria-label="Forum sections">
          <div className={styles.profile}>
            <div className={styles.avatar}>NJ</div>
            <div>
              <strong>gameJack</strong>
              <span>Membership hub</span>
            </div>
          </div>
          {sideLinks.map(([label, Icon], index) => (
            <Link className={index === 0 ? styles.sideActive : styles.sideLink} href="/forum" key={label}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
          <div className={styles.statStrip}>
            <span>Power</span>
            <strong>8,420</strong>
            <small>Season score</small>
          </div>
        </aside>

        <section className={styles.content}>
          <section className={styles.header}>
            <div className={styles.mark}>
              <Swords size={22} aria-hidden="true" />
            </div>
            <span className={styles.eyebrow}>gameJack community terminal</span>
            <h1>new game forum command center.</h1>
            <p>
              Official notes, strategy files, fan ideas, and puzzle feedback in
              one immersive hub built around daily word play.
            </p>
          </section>

          <ForumClient initialPosts={posts} />
        </section>

        <aside className={styles.widgets} aria-label="Global game widgets">
          <section className={styles.widget}>
            <h2>Server Status</h2>
            <div className={styles.serverRow}>
              <CircleDot size={14} aria-hidden="true" />
              <span>US-East</span>
              <strong>24ms</strong>
            </div>
            <div className={styles.serverRow}>
              <CircleDot size={14} aria-hidden="true" />
              <span>US-West</span>
              <strong>38ms</strong>
            </div>
            <div className={styles.serverWarn}>
              <ShieldAlert size={14} aria-hidden="true" />
              <span>EU word archive syncing</span>
            </div>
          </section>

          <section className={styles.widget}>
            <h2>Season Event</h2>
            <div className={styles.countdown}>18:42:09</div>
            <p>Premium guide streak resets tonight.</p>
          </section>

          <section className={styles.widget}>
            <h2>Live Pulse</h2>
            <div className={styles.pulse}>
              <Radio size={15} aria-hidden="true" />
              <span>42 players reading hints</span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
