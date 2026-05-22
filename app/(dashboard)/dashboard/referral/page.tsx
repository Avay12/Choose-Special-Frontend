"use client";

import { useState } from "react";
import {
  Copy,
  Gift,
  Users,
  CheckCircle2,
  DollarSign,
  Wallet,
  Tag,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function ReferralPage() {
  const { user } = useAuthStore();
  const [isCopied, setIsCopied] = useState(false);
  const [friendCode, setFriendCode] = useState("");

  // Generate a pseudo-referral code using user's ID
  const referralCode = user?.id
    ? `REF-${user.name?.split(" ")[0].toUpperCase()}-${user.id}`
    : "REF-USER";
  const referralLink = `https://choosespecial.com/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendCode.trim() === "") return;
    alert(`Referral code ${friendCode} applied successfully!`);
    setFriendCode("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Referrals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite friends and earn 5% of their completed orders
        </p>
      </div>

      {/* Section 1: Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Referrals */}
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm flex items-center gap-5">
          <div className="flex-shrink-0 h-14 w-14 rounded-[1rem] bg-muted flex items-center justify-center border border-border">
            <Users className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Referrals
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">0</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm flex items-center gap-5">
          <div className="flex-shrink-0 h-14 w-14 rounded-[1rem] bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <DollarSign className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Earnings
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">$0.00</p>
          </div>
        </div>

        {/* Referral Balance */}
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm flex items-center gap-5">
          <div className="flex-shrink-0 h-14 w-14 rounded-[1rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Wallet className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Referral Balance
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">$0.00</p>
          </div>
        </div>

        {/* Commission Rate */}
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm flex items-center gap-5">
          <div className="flex-shrink-0 h-14 w-14 rounded-[1rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Gift className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Commission Rate
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">5%</p>
          </div>
        </div>
      </div>

      {/* Section 2: Have a Referral Code? */}
      <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden p-8">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="h-6 w-6 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Have a Referral Code?
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Enter a friend's referral code to link your account
        </p>

        <form
          onSubmit={handleApplyCode}
          className="flex flex-col sm:flex-row gap-4 mb-4"
        >
          <input
            type="text"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            placeholder="ENTER REFERRAL CODE"
            className="flex-1 bg-muted/60 border-2 border-transparent rounded-[1.25rem] py-4 px-6 text-sm font-bold text-foreground focus:bg-card focus:border-primary/20 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="rounded-[1.25rem] bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            Apply
          </button>
        </form>
        <p className="text-sm text-muted-foreground/60">
          You can only use a referral code once, and it can't be changed after
          applying.
        </p>
      </div>

      {/* Section 3: Your Referral Link */}
      <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden p-8">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Your Referral Link
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Share this link with friends. When they place orders, you earn 5%
          commission!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-muted/40 border-2 border-border rounded-[1.25rem] py-4 px-6 text-sm font-semibold text-muted-foreground focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center rounded-[1.25rem] px-8 py-4 text-sm font-bold text-white shadow-sm transition-all sm:w-auto whitespace-nowrap border ${
              isCopied
                ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-none"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" /> Copy
              </>
            )}
          </button>
        </div>

        <div className="flex items-center text-sm font-medium text-muted-foreground">
          Your referral code:
          <span className="ml-2 bg-muted text-foreground font-bold px-3 py-1 rounded-lg border border-border">
            {referralCode}
          </span>
        </div>
      </div>

      {/* Section 4: How It Works */}
      <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden p-8">
        <h2 className="text-xl font-bold text-foreground mb-10">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-0.5 bg-border z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-black mb-5 shadow-lg shadow-primary/25 border-4 border-card">
              1
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              Share Your Link
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Send your unique referral link to friends
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-black mb-5 shadow-lg shadow-primary/25 border-4 border-card">
              2
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              Friend Signs Up
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              They create an account using your link
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-black mb-5 shadow-lg shadow-primary/25 border-4 border-card">
              3
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              They Order
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When they place orders, you earn commission
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-black mb-5 shadow-lg shadow-primary/25 border-4 border-card">
              4
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">
              Request Payout
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once you reach $5, request a payout via ticket
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Referral Rules */}
      <div className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Referral Rules
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start text-sm text-muted-foreground">
            <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
            <span className="font-medium">
              Earn 5% commission on every completed order from referred users.
            </span>
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
            <span className="font-medium">
              Referral earnings are added to a separate referral balance.
            </span>
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
            <span className="font-medium">
              Minimum $5 required to request a payout.
            </span>
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
            <span className="font-medium">
              To receive payout, submit a request and an admin will process it.
            </span>
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30"></span>
            <span className="font-medium">
              No commission for cancelled, failed, or refunded orders.
            </span>
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30"></span>
            <span className="font-medium">Self-referrals are not allowed.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
