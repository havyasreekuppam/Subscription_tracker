"use client";
import type { Subscription } from "@/lib/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

// // TYPES
// export interface Subscription {
//   id?: string
//   name: string
//   cost: number
//   billingCycle: string
//   nextPaymentDate: string
//   category: string

//   // ✅ add these (used in UI)
//   icon?: string
//   color?: string
// }

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id">) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;

  // ✅ ADD THIS
  unreadCount: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // 🔥 FETCH
  const fetchSubscriptions = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "subscriptions"),
      where("userId", "==", user.uid),
    );

    const snapshot = await getDocs(q);

    const data: Subscription[] = snapshot.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        name: d.name || "",
        cost: d.cost || 0,
        billingCycle: d.billingCycle || "monthly",
        nextPaymentDate: d.nextPaymentDate || "",
        category: d.category || "",
        icon: d.icon || "code",
        color: d.color || "#6366f1",
      };
    });

    setSubscriptions(data);
  };

  // 🔥 ADD
  const addSubscription = async (sub: Omit<Subscription, "id">) => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in");
      return;
    }

    await addDoc(collection(db, "subscriptions"), {
      ...sub,
      userId: user.uid,
      createdAt: new Date(),
    });

    await fetchSubscriptions();
  };

  // 🔥 DELETE
  const deleteSubscription = async (id: string) => {
    await deleteDoc(doc(db, "subscriptions", id));
    await fetchSubscriptions();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchSubscriptions();
      } else {
        setSubscriptions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ SIMPLE FIX (no notifications system yet)
  const unreadCount = 0;

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        deleteSubscription,
        unreadCount, // ✅ IMPORTANT
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error("useSubscriptions must be used within provider");
  }

  return context;
}
