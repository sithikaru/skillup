/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleApproval = async (userId: string, status: string) => {
    await updateDoc(doc(db, "users", userId), { status });
    setUsers(users.map(user => (user.id === userId ? { ...user, status } : user)));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Approve Payments</h2>
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Bank Slip</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center border-b border-gray-700">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.contact}</td>
              <td className="p-2">
                <a href={user.bankSlipUrl} target="_blank" className="text-blue-400">View Slip</a>
              </td>
              <td className="p-2">{user.status}</td>
              <td className="p-2">
                <button onClick={() => handleApproval(user.id, "Approved")} className="bg-green-500 p-2 rounded">Approve</button>
                <button onClick={() => handleApproval(user.id, "Rejected")} className="bg-red-500 p-2 rounded ml-2">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
