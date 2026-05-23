"use client";

import { useAuthStore } from "@/store/authStore";
import { useAdminDataStore } from "@/store/adminDataStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CopyPlus, Wand2, Link2, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { users, orders, cards, fetchUsers, fetchOrders, fetchCards } =
    useAdminDataStore();

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchCards();
  }, [fetchUsers, fetchOrders, fetchCards]);

  const stats = [
    {
      label: "Total Users",
      value: users?.length.toString(),
      icon: Users,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Orders",
      value: orders?.length.toString(),
      icon: ShoppingBag,
      color: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Available Cards",
      value: cards?.length.toString(),
      icon: CopyPlus,
      color: "text-violet-500 dark:text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Revenue",
      value: `$${orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0).toFixed(2)}`,
      icon: Wand2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's what's happening with your Choose Special site today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card overflow-hidden rounded-2xl shadow-sm border border-border p-6 flex items-center gap-4 hover:shadow-md hover:shadow-primary/5 transition-shadow"
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 font-heading">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/cards/create"
              className="group flex flex-col items-center justify-center p-6 bg-muted rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-border">
                <CopyPlus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium text-foreground">New Card</span>
            </Link>

            <Link
              href="/admin/links/create"
              className="group flex flex-col items-center justify-center p-6 bg-muted rounded-xl hover:bg-secondary/5 border border-transparent hover:border-secondary/20 transition-all"
            >
              <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-border">
                <Link2 className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-medium text-foreground">Create Link</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 font-heading">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-3">
            <Wand2 className="w-8 h-8 opacity-40" />
            <p>No recent activity yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
