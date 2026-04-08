"use client";

import {
  Bell,
  Check,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCheck,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useSubscriptions } from "@/lib/subscription-context";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { cn, formatCurrency } from "@/lib/utils";
import type { Subscription, Notification } from "@/lib/types";

/* ------------------ HELPERS ------------------ */

const getDiffDays = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);

  return Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
};

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const createNotifications = (subscriptions: Subscription[]): Notification[] => {
  return subscriptions
    .map<Notification | null>((sub) => {
      if (!sub.nextPaymentDate) return null;

      const diffDays = getDiffDays(sub.nextPaymentDate);
      if (diffDays < 0 || diffDays > 30) return null;

      let title = "";
      if (diffDays === 0) {
        title = `${sub.name} payment due today`;
      } else if (diffDays <= 7) {
        title = `${sub.name} payment due in ${diffDays} day${
          diffDays === 1 ? "" : "s"
        }`;
      } else {
        title = `${sub.name} payment due this month`;
      }

      return {
        id: sub.id,
        title,
        description: `Your ${sub.name} subscription of ${formatCurrency(
          sub.cost
        )} is due on ${formatDueDate(sub.nextPaymentDate)}.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "payment",
      };
    })
    .filter(
      (notification): notification is Notification => notification !== null
    );
};

/* ------------------ COMPONENT ------------------ */

function NotificationsContent() {
  const { subscriptions } = useSubscriptions() as {
    subscriptions: Subscription[];
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState({ emailReminders: false });
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  /* ✅ LOAD + APPLY READ STATE */
  useEffect(() => {
    const readIds = JSON.parse(
      localStorage.getItem("readNotifications") || "[]"
    );

    const newNotifications = createNotifications(subscriptions).map((n) => ({
      ...n,
      read: readIds.includes(n.id),
    }));

    setNotifications(newNotifications);
  }, [subscriptions]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("subscriptionPreferences");

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        if (typeof parsed.emailReminders === "boolean") {
          setPreferences({ emailReminders: parsed.emailReminders });
        }
      } catch {
        localStorage.removeItem("subscriptionPreferences");
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });

    return () => unsubscribe();
  }, []);

  /* ✅ SAVE SINGLE READ */
  const markAsRead = (id: string) => {
    setNotifications((current) => {
      const updated = current.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );

      const readIds = updated.filter((n) => n.read).map((n) => n.id);
      localStorage.setItem("readNotifications", JSON.stringify(readIds));

      return updated;
    });
  };

  /* ✅ SAVE ALL READ */
  const markAllAsRead = () => {
    setNotifications((current) => {
      const updated = current.map((n) => ({ ...n, read: true }));

      const readIds = updated.map((n) => n.id);
      localStorage.setItem("readNotifications", JSON.stringify(readIds));

      return updated;
    });
  };

  const handleSendEmailReminder = async () => {
    if (!auth.currentUser) {
      setEmailStatus("Please log in");
      return;
    }

    setIsSendingEmail(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

      const response = await fetch(`${backendUrl}/api/email-reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, subscriptions }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setEmailStatus("Email sent!");
    } catch (err: any) {
      setEmailStatus(err.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return "Yesterday";
  };

  const getIcon = () => CreditCard;

  /* ------------------ UI ------------------ */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-white/60">
            Stay updated with your subscription alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            onClick={markAllAsRead}
            className="gap-2 px-4 py-2 rounded-xl 
            bg-white/10 border border-white/20 text-white 
            backdrop-blur-xl hover:bg-white/20 transition"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <h3>Unread</h3>
            <p className="text-xl font-bold">{unreadCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3>Payment Reminders</h3>
            <p>{notifications.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3>Alerts</h3>
            <p>0</p>
          </CardContent>
        </Card>
      </div>

      {/* EMAIL */}
      <Card>
        <CardHeader>
          <CardTitle>Email Reminder</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between">
          <p>{userEmail}</p>

          <Button
            type="button"
            onClick={handleSendEmailReminder}
            disabled={isSendingEmail || !userEmail}
            className="gap-2 px-4 py-2 rounded-xl font-medium 
bg-white/10 border border-white/20 text-white 
backdrop-blur-xl 
hover:bg-white/20 hover:scale-[1.02] 
transition-all duration-200"
          >
            <Mail className="h-4 w-4" />
            {isSendingEmail ? "Sending..." : "Send reminder email"}
          </Button>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {notifications.map((n) => {
            const Icon = getIcon();

            return (
              <div
                key={n.id}
                className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <Icon className="text-primary" />

                <div className="flex-1">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-white/60">{n.description}</p>

                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(n.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Mark as read
                    </Button>
                  )}
                </div>

                <div>
                  <span>{formatTimestamp(n.timestamp)}</span>
                  {!n.read && <Badge>New</Badge>}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsContent />
    </DashboardLayout>
  );
}