/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { FaFileAlt, FaVideo } from "react-icons/fa";

export default function PhaseMaterials() {
  const { phaseId } = useParams(); // Use useParams instead of useRouter
  const [materials, setMaterials] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!phaseId) return;

      setLoading(true);
      try {
        const q = query(
          collection(db, "materials"),
          where("phase", "==", phaseId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedMaterials = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "", // Ensure title exists
            ...data,
          };
        });
        setMaterials(
          fetchedMaterials.sort((a, b) => a.title.localeCompare(b.title))
        );
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
      setLoading(false);
    };

    fetchMaterials();
  }, [phaseId]);

  // Function to convert Google Drive link to embed URL
  const convertGoogleDriveUrl = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <motion.span
          className="text-lg animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.h2
        className="text-5xl mt-20 font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {phaseId && phaseId.toString().replace("-", " ").toUpperCase()}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {materials.map((item) => (
          <motion.div
            key={item.id}
            className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              {item.category === "Videos/Recordings" ? (
                <FaVideo className="text-purple-400 text-2xl mr-2" />
              ) : (
                <FaFileAlt className="text-blue-400 text-2xl mr-2" />
              )}
              <h4 className="text-2xl font-semibold">{item.title}</h4>
            </div>
            <p className="text-gray-400 mb-4">{item.description}</p>

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                download
                className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-300"
              >
                Download Material
              </a>
            )}

            {item.videoUrl && (
              <div className="mt-4">
                <iframe
                  src={convertGoogleDriveUrl(item.videoUrl)}
                  width="100%"
                  height="300px"
                  allow="autoplay"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
