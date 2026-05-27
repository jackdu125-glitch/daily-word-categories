"use client";

import { Crown } from "lucide-react";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

export function CheckoutButton() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    setStatus("Preparing checkout...");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("Supabase is not configured yet.");
      setLoading(false);
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      setStatus("Sign in first, then start membership checkout.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/membership/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      setStatus(payload.error ?? "Checkout is not ready yet.");
      setLoading(false);
      return;
    }

    window.location.href = payload.url;
  }

  return (
    <div className={styles.checkoutBox}>
      <button disabled={loading} onClick={startCheckout} type="button">
        <Crown size={17} aria-hidden="true" />
        {loading ? "Opening checkout..." : "Start Pro membership"}
      </button>
      {status ? <p>{status}</p> : null}
    </div>
  );
}
