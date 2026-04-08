"use client";

import type { Subscription } from "@/lib/types"
import { formatCurrency } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Plus, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SubscriptionItem } from "@/components/subscription-item";
import { SubscriptionForm } from "@/components/subscription-form";
import { useSubscriptions } from "@/lib/subscription-context";

function DashboardContent() {
  const { subscriptions, addSubscription, deleteSubscription } =
    useSubscriptions();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const monthlySpending = subscriptions.reduce((acc, sub) => {
      const cost = sub.cost ?? 0;
      if (sub.billingCycle === "monthly") return acc + cost;
      return acc + cost / 12;
    }, 0);

    return {
      monthlySpending,
      yearlySpending: monthlySpending * 12,
      activeCount: subscriptions.length,
    };
  }, [subscriptions]);

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Subscription, "id">) => {
    addSubscription(data);
    setEditingSubscription(null);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingSubscription(null);
  };

  const safeCurrency = (value: number) =>
    mounted ? formatCurrency(value) : "₹0.00";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60">Track your subscriptions</p>
        </div>

        <Button
          onClick={() => setFormOpen(true)}
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
        >
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/10 border border-white/10">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm text-white/60">
              Monthly Spending
            </CardTitle>
            <CreditCard className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white font-bold">
              {safeCurrency(stats.monthlySpending)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border border-white/10">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm text-white/60">
              Yearly Spending
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white font-bold">
              {safeCurrency(stats.yearlySpending)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border border-white/10">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm text-white/60">
              Active Subscriptions
            </CardTitle>
            <Calendar className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-white font-bold">
              {stats.activeCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SUBSCRIPTIONS LIST */}
      <Card className="bg-white/10 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            Your Subscriptions
          </CardTitle>
        </CardHeader>

        <CardContent>
          {subscriptions.length > 0 ? (
            <div className="space-y-3">
              {subscriptions.map((sub, index) => (
                <SubscriptionItem
                  key={sub.id || index}
                  subscription={sub}
                  onEdit={handleEdit}
                  onDelete={deleteSubscription}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 py-10">
              No subscriptions yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* FORM */}
      <SubscriptionForm
        open={formOpen}
        onOpenChange={handleFormClose}
        subscription={editingSubscription}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}