/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { protectAdminRoute } from "@/lib/protectAdmin";

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<DocumentData[]>([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    category: "Notes",
    phase: "phase-01", // Default phase
    file: null as File | null,
    videoUrl: "",
  });

  const [selectedPhase, setSelectedPhase] = useState("phase-01");

  useEffect(() => {
    protectAdminRoute(fetchMaterials);
  }, [selectedPhase]); // Re-fetch when phase changes

  const fetchMaterials = async () => {
    const q = query(
      collection(db, "materials"),
      where("phase", "==", selectedPhase)
    );
    const querySnapshot = await getDocs(q);
    const fetchedMaterials = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMaterials(fetchedMaterials);
  };

  const handleFileChange = (e: any) => {
    setNewMaterial({ ...newMaterial, file: e.target.files[0] });
  };

  const handleAddMaterial = async () => {
    try {
      let fileUrl = "";
  
      // Upload to Firebase Storage if file is selected
      if (newMaterial.file) {
        const storageRef = ref(
          storage,
          `materials/${newMaterial.phase}/${newMaterial.category}/${newMaterial.file.name}`
        );
        await uploadBytes(storageRef, newMaterial.file);
        fileUrl = await getDownloadURL(storageRef);
      }
  
      // Add document to Firestore without the File object
      await addDoc(collection(db, "materials"), {
        title: newMaterial.title,
        description: newMaterial.description,
        category: newMaterial.category,
        phase: newMaterial.phase,
        fileUrl: fileUrl,  // Save the download URL
        videoUrl: newMaterial.videoUrl,
      });
  
      // Reset the form fields
      setNewMaterial({
        title: "",
        description: "",
        category: "Notes",
        phase: "phase-01",
        file: null,
        videoUrl: "",
      });
  
      // Refresh the materials list
      fetchMaterials();
    } catch (error) {
      console.error("Error adding material:", error);
    }
  };
  

  const handleDeleteMaterial = async (id: string, fileUrl: string) => {
    try {
      if (fileUrl) {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
      }
      await deleteDoc(doc(db, "materials", id));
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-4xl font-extrabold mb-12 text-center">
        Admin Materials Dashboard
      </h2>

      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-4">Add New Material</h3>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={newMaterial.title}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, title: e.target.value })
          }
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          value={newMaterial.description}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, description: e.target.value })
          }
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        ></textarea>

        {/* Phase Selection */}
        <select
          value={newMaterial.phase}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, phase: e.target.value })
          }
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        >
          <option value="phase-01">Phase 01</option>
          <option value="phase-02">Phase 02</option>
          <option value="phase-03">Phase 03</option>
        </select>

        {/* Category Selection */}
        <select
          value={newMaterial.category}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, category: e.target.value })
          }
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        >
          <option value="Notes">Notes</option>
          <option value="Assignments">Assignments</option>
          <option value="Videos/Recordings">Videos/Recordings</option>
        </select>

        {/* File Upload */}
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        />

        {/* Video URL */}
        <input
          type="text"
          placeholder="Video URL"
          value={newMaterial.videoUrl}
          onChange={(e) =>
            setNewMaterial({ ...newMaterial, videoUrl: e.target.value })
          }
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        />

        {/* Add Material Button */}
        <button
          onClick={handleAddMaterial}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Material
        </button>
      </div>

      <div>
        <h3 className="text-3xl font-bold mb-4">Materials List</h3>

        {/* Filter by Phase */}
        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="block w-full p-2 mb-4 bg-gray-800 text-white rounded"
        >
          <option value="phase-01">Phase 01</option>
          <option value="phase-02">Phase 02</option>
          <option value="phase-03">Phase 03</option>
        </select>

        {materials.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 p-4 mb-4 rounded shadow-md"
          >
            <h4 className="text-2xl font-semibold">{item.title}</h4>
            <p className="text-gray-400">{item.description}</p>
            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline mt-2 block"
              >
                Download Material
              </a>
            )}
            <button
              onClick={() => handleDeleteMaterial(item.id, item.fileUrl)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
