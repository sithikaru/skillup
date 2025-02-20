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
        const fetchedMaterials = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMaterials(fetchedMaterials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
      setLoading(false);
    };

    fetchMaterials();
  }, [phaseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="text-lg animate-pulse">Loading...</span>
      </div>
    );
  }

  const categorizedMaterials = {
    Notes: materials.filter((item) => item.category === "Notes"),
    Assignments: materials.filter((item) => item.category === "Assignments"),
    Videos: materials.filter((item) => item.category === "Videos/Recordings"),
  };

  // Function to convert Google Drive link to embed URL
  const convertGoogleDriveUrl = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

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

      {Object.entries(categorizedMaterials).map(([category, items]) => (
        <section key={category} className="mb-12">
          <motion.h3
            className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {category}
          </motion.h3>

          <ul className="space-y-6">
            {items.map((item) => (
              <motion.li
                key={item.id}
                className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-2xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-400 mb-4">{item.description}</p>

                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline block mb-4"
                  >
                    Download Material
                  </a>
                )}

                {item.videoUrl && (
                  <div className="mt-4">
                    <iframe
                      src={convertGoogleDriveUrl(item.videoUrl)}
                      width="100%"
                      height="500px"
                      allow="autoplay"
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg shadow-lg"
                    ></iframe>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
