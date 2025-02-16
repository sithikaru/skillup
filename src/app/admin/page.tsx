/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { protectAdminRoute } from "@/lib/protectAdmin";

interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  bankSlipUrl: string;
  verified: boolean;
  rejected?: boolean; // We'll store this in Firestore if user is rejected
  rejectionReason?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [rejectingUser, setRejectingUser] = useState<User | null>(null);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    protectAdminRoute(async () => {
      try {
        // Fetch all users from Firestore
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(
          (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as User)
        );

        // Filter out already verified or previously rejected
        const pendingUsers = usersList.filter((user) => !user.verified && !user.rejected);
        const verifiedUsers = usersList.filter(
          (user) => user.verified && !user.rejected
        );

        setApprovedUsers(verifiedUsers);
        setUsers(pendingUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    });
  }, []);

  const handleApproval = async (id: string, approve: boolean, reason: string = "") => {
    try {
      if (approve) {
        // Approve user: set verified = true
        await updateDoc(doc(db, "users", id), {
          verified: true,
          rejectionReason: "",
          rejected: false, // or remove this field if desired
        });

        // Remove them from the dashboard list
        setUsers((prev) => prev.filter((user) => user.id !== id));

        alert("User Approved!");
      } else {
        // Reject user: set verified = false, store reason, mark rejected = true
        await updateDoc(doc(db, "users", id), {
          verified: false,
          rejectionReason: reason,
          rejected: true,
        });

        // Delete from Firebase Auth using the Admin API route
        const res = await fetch(`/api/deleteUser?userId=${id}`, { method: "DELETE" });
        if (!res.ok) {
          throw new Error("Failed to delete user from Firebase Auth.");
        }

        // Remove from the dashboard list
        setUsers((prev) => prev.filter((user) => user.id !== id));

        alert(`User Rejected: ${reason}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating user status. Check console for details.");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {users.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="p-4 border border-gray-700 rounded mb-4">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Contact:</strong> {user.contact}
            </p>
            <p>
              <strong>Bank Slip:</strong>{" "}
              <a href={user.bankSlipUrl} target="_blank" className="text-blue-500">
                View Slip
              </a>
            </p>

            <div className="mt-3">
              <button
                onClick={() => handleApproval(user.id, true)}
                className="bg-green-500 text-white p-2 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => setRejectingUser(user)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {/* Approved Users */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Approved Users</h3>
      {approvedUsers.length === 0 ? (
        <p>No users have been approved yet.</p>
      ) : (
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-700 p-2">Name</th>
              <th className="border-b border-gray-700 p-2">Email</th>
              <th className="border-b border-gray-700 p-2">Contact</th>
              <th className="border-b border-gray-700 p-2">Bank Slip</th>
            </tr>
          </thead>
          <tbody>
            {approvedUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-800">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.contact}</td>
                <td className="p-2">
                  <a href={user.bankSlipUrl} target="_blank" className="text-blue-500">
                    View Slip
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("adminAuth");
          window.location.href = "/admin/login";
        }}
        className="bg-red-500 text-white p-2 rounded mt-6"
      >
        Logout
      </button>

      {/* Rejection Modal */}
      {rejectingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded">
            <h3 className="text-lg font-bold mb-3">Enter Rejection Reason</h3>
            <input
              type="text"
              className="p-2 w-full border border-gray-600 rounded bg-gray-700 text-white"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  if (rejectionReason.trim()) {
                    handleApproval(rejectingUser.id, false, rejectionReason.trim());
                    setRejectingUser(null);
                    setRejectionReason("");
                  } else {
                    alert("Please enter a reason.");
                  }
                }}
                className="bg-red-500 text-white p-2 rounded mr-2"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setRejectingUser(null);
                  setRejectionReason("");
                }}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
