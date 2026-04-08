"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils"
export default function SubscriptionsPage() {
  const router = useRouter();

  // ✅ All states INSIDE component
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [category, setCategory] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // 📦 Fetch data
  const fetchSubscriptions = async () => {
    const token = localStorage.getItem("token");


    try {
      const res = await fetch("http://localhost:3000/api/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setSubscriptions(data);
      } else {
        console.log("Not an array:", data);
        setSubscriptions([]); // prevent crash
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }


  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // ➕ Add
  const handleAdd = async () => {
    if (!name || !cost) return;


    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        cost,
        billingCycle,
        nextBillingDate,
        category,
      }),
    });

    setName("");
    setCost("");
    setBillingCycle("monthly");
    setNextBillingDate("");
    setCategory("");

    fetchSubscriptions();


  };

  // ❌ Delete
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");


    await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchSubscriptions();


  };

  return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] via-[#0f172a] to-black px-4">


    {/* Glow */}
    <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full top-10 left-10"></div>
    <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

    {/* Glass Container */}
    <div className="relative w-full max-w-2xl p-8 rounded-2xl 
    bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">

      {/* Heading */}
      <h1 className="text-2xl font-bold text-white mb-2">
        Subscriptions
      </h1>
      <p className="text-white/60 mb-6">
        Manage your subscriptions
      </p>

      {/* ✅ SINGLE CLEAN FORM */}
      <div className="flex flex-col gap-3 mb-6">

        <div className="flex flex-col gap-3 mb-6">

          <Input
            placeholder="Subscription name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />

          <Input
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />

          <select
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"

          >

            ```
            <option value="monthly">Monthly</option>
            ```

            ```
            <option value="yearly">Yearly</option>
            ```

          </select>

          <Input
            type="date"
            value={nextBillingDate}
            onChange={(e) => setNextBillingDate(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />

          <Input
            placeholder="Category (e.g. Entertainment)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />

          <Button onClick={handleAdd} className="gap-2 mt-2">
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>

        </div>

      </div>

      {/* List */}
      <div className="space-y-3">
        {subscriptions.length === 0 ? (
          <p className="text-white/50 text-sm text-center py-6">
            No subscriptions yet
          </p>
        ) : (
          Array.isArray(subscriptions) && subscriptions.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between p-4 rounded-xl
            bg-white/[0.03] border border-white/10 backdrop-blur-lg
            hover:bg-white/[0.05] transition"
            >
              <div>
                <p className="text-white font-medium">{sub.name}</p>
                <p className="text-sm text-white/60">
                  {formatCurrency(Number(sub.cost))} • {sub.billingCycle}
                </p>
                <p className="text-xs text-white/40">
                  {sub.category} • {new Date(sub.nextBillingDate).toDateString()}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(sub._id)}
                className="text-red-400 hover:bg-white/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>


  );
}
