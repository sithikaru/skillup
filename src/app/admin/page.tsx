/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { protectAdminRoute } from "@/lib/protectAdmin";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    protectAdminRoute(() => {
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, verified: doc.data().verified, ...doc.data() }));
        setUsers(usersList.filter(user => !user.verified)); // Show only unapproved users
      };
      fetchUsers();
    });
  }, []);

  const handleApproval = async (id: string, status: boolean, reason: string = "") => {
    await updateDoc(doc(db, "users", id), { verified: status, rejectionReason: reason });
    alert(status ? "User Approved!" : `User Rejected: ${reason}`);
    window.location.reload();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {users.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="p-4 border border-gray-700 rounded mb-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Contact:</strong> {user.contact}</p>
            <p><strong>Bank Slip:</strong> <a href={user.bankSlipUrl} target="_blank" className="text-blue-500">View Slip</a></p>

            <div className="mt-3">
              <button onClick={() => handleApproval(user.id, true)} className="bg-green-500 text-white p-2 rounded mr-2">Approve</button>
              <button onClick={() => {
                const reason = prompt("Enter rejection reason:");
                if (reason) handleApproval(user.id, false, reason);
              }} className="bg-red-500 text-white p-2 rounded">Reject</button>
            </div>
          </div>
        ))
      )}

      <button onClick={() => {
        localStorage.removeItem("adminAuth");
        window.location.href = "/admin/login";
      }} className="bg-red-500 text-white p-2 rounded mt-6">Logout</button>
    </div>
  );
}
