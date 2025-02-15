"use client";
import { useEffect, useState } from "react";
import { protectRoute } from "@/lib/protectRoute";

export default function Events() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    protectRoute(() => setAllowed(true));
  }, []);

  if (!allowed) return <div className="text-white">Checking access...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold">Exclusive Events</h2>
      <p>Welcome to the verified users&apos; events page!</p>
    </div>
  );
}
