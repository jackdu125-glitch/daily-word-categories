import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  ChevronRight,
  CircleDot,
  Gamepad2,
  Home,
  MessageSquare,
  Radio,
  Search,
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
  ["首页", Home],
  ["维基", BookOpen],
  ["新闻", Bell],
  ["评论", MessageSquare],
  ["向导", Swords],
  ["论坛", Gamepad2],
] as const;

const quickLinks = [
  "Resident Evil 4 Remake Walkthrough",
  "Best Weapons Upgrade Route",
  "Blue Medallion Locations",
  "Boss Counter Notes",
  "Treasure Map Checklist",
  "Beginner Survival Tips",
];

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
          <Link className={styles.drawerLogo} href="/forum">gameJack</Link>
          <div className={styles.profile}>
            <div className={styles.avatar}>NJ</div>
            <div>
              <strong>new game</strong>
              <span>AAA guide hub</span>
            </div>
          </div>
          {sideLinks.map(([label, Icon], index) => (
            <Link className={index === 0 ? styles.sideActive : styles.sideLink} href="/forum" key={label}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
          <div className={styles.socialRow}>
            <span>▶</span>
            <span>f</span>
            <span>◎</span>
            <span>𝕏</span>
            <span>♪</span>
            <span>◈</span>
          </div>
          <div className={styles.leftAd}>
            <span>AD</span>
            <strong>300 x 250</strong>
            <small>Guide sponsor slot</small>
          </div>
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
            <h1>Resident Evil guide command center.</h1>
            <p>
              Read the newest AAA guide signals, then turn walkthroughs,
              weapons, boss counters, maps, and player questions into cleaner
              strategy posts.
            </p>
          </section>

          <section className={styles.guidePanel}>
            <div className={styles.searchBox}>
              <Search size={18} aria-hidden="true" />
              <span>Search gameJack guides</span>
            </div>
            <div className={styles.guideHeader}>
              <span>Resident Evil 4 Remake</span>
              <h2>Walkthrough and guide index</h2>
              <p>
                Borrowing the best from Fextralife and Game8: left-side quick
                access, route-first guide structure, visible ads, and compact
                ranking blocks that keep readers moving.
              </p>
            </div>
            <div className={styles.quickGrid}>
              {quickLinks.map((link) => (
                <Link href="/guides/today" key={link}>
                  <span>{link}</span>
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
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

          <section className={styles.adBox}>
            <span>Advertisement</span>
            <strong>300 x 600</strong>
            <small>Reserved display slot</small>
          </section>

          <section className={styles.widget}>
            <h2>Season Event</h2>
            <div className={styles.countdown}>18:42:09</div>
            <p>Premium guide streak resets tonight.</p>
          </section>

          <section className={styles.widget}>
            <h2>Hot Guide Topics</h2>
            <ol className={styles.rankList}>
              <li>Village route order</li>
              <li>Best weapon upgrade path</li>
              <li>Merchant request checklist</li>
            </ol>
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
