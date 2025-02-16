/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Register() {
  const [isChecked, setIsChecked] = useState(false);

  // Framer Motion variants (example fade-in + slight upward motion)
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    username: "",
    password: "",
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<string>("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!/^(07|94)\d{8}$/.test(form.contact))
      newErrors.contact = "Invalid Sri Lankan phone number";

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.username))
      newErrors.username = "4-20 characters (letters, numbers, underscores)";

    if (form.password.length < 6 || !/\d/.test(form.password))
      newErrors.password =
        "Password must be at least 6 characters and contain a number";

    if (!form.file) newErrors.file = "Bank slip is required";
    else if (
      !["image/jpeg", "image/png", "application/pdf"].includes(form.file.type)
    )
      newErrors.file = "Only JPG, PNG, or PDF files allowed";
    else if (form.file.size > 5 * 1024 * 1024)
      // 5MB limit
      newErrors.file = "File size must be less than 5MB"; // Fixed error message

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, file }));
    setFileName(file.name);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const userId = userCredential.user.uid;

      // Upload bank slip
      const fileRef = ref(storage, `bankSlips/${userId}/${form.file!.name}`);
      await uploadBytes(fileRef, form.file!);
      const fileUrl = await getDownloadURL(fileRef);

      // Create user document
      await setDoc(doc(db, "users", userId), {
        name: form.name,
        email: form.email,
        contact: form.contact,
        username: form.username.toLowerCase(),
        bankSlipUrl: fileUrl,
        verified: false,
        createdAt: new Date(),
      });

      alert("Registration submitted for verification!");
      window.location.href = "/Dashboard";
    } catch (error: any) {
      let errorMsg = "An unexpected error occurred";
      if (error.code === "auth/email-already-in-use")
        errorMsg = "Email is already registered.";
      else if (error.code === "auth/weak-password")
        errorMsg = "Weak password. Try a stronger one.";
      else if (error.code === "auth/invalid-email")
        errorMsg = "Invalid email format.";

      setErrors((prev) => ({ ...prev, form: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const formattedMessage =
      `Hello, I need help with my Skill Up 3.0 registration.%0A%0A` +
      `Name: ${form.name || "Not provided"}%0A` +
      `Email: ${form.email || "Not provided"}%0A` +
      `Contact: ${form.contact || "Not provided"}%0A` +
      `Username: ${form.username || "Not provided"}`;

    return `https://wa.me/94741457706?text=${formattedMessage}`;
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-lg space-y-6 mt-20 ">
      <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent text-center">
        Skillup Registration
      </h2>

      {errors.form && (
        <div className="p-3 bg-red-800/25 text-red-500 rounded-lg text-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          {
            label: "Full Name",
            name: "name",
            type: "text",
            placeholder: "Full name",
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "youremail@email.com",
          },
          {
            label: "Contact Number",
            name: "contact",
            type: "tel",
            placeholder: "0712345678",
          },
          {
            label: "Username",
            name: "username",
            type: "text",
            placeholder: "userName",
          },
          {
            label: "Password",
            name: "password",
            type: "password",
            placeholder: "••••••••",
          },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={
                form[
                  name as "name" | "email" | "contact" | "username" | "password"
                ] || ""
              } // Type-safe value binding
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
            {errors[name] && (
              <span className="text-red-400 text-sm">{errors[name]}</span>
            )}
          </div>
        ))}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Bank Payment Slip (PDF/Image)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-400"
          />
          {fileName && (
            <p className="text-sm text-gray-400">Selected file: {fileName}</p>
          )}
          {errors.file && (
            <span className="text-red-400 text-sm">{errors.file}</span>
          )}
        </div>
        <div className="dark  text-gray-200 min-h-screen py-8 flex justify-center items-start">
      <div className="dark  text-gray-200 min-h-screen py-8 flex justify-center items-start px-2">
        <motion.div
          className=""
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4
                       text-transparent bg-clip-text
                       bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Skill Up 3.0 &mdash; Registration Guidelines & Certificate Eligibility
          </motion.h1>

          {/* Certificate & Recommendation Letter Eligibility */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2
              className="text-2xl font-semibold text-transparent bg-clip-text 
                         bg-gradient-to-r from-purple-300 to-purple-500"
            >
              Certificate & Recommendation Letter Eligibility
            </h2>
            <p className="leading-relaxed text-gray-300">
              <strong className="text-purple-300">Skill Up 3.0</strong> consists
              of three phases, with Phase 01 including seven sessions. To be eligible for the{" "}
              <span className="text-purple-300">Skill Up Participation Certificate</span> and{" "}
              <span className="text-purple-300">Recommendation Letter</span>, participants must:
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
              <li>
                <span className="text-purple-300">Attend at least two sessions</span> in Phase 01.
              </li>
              <p className="text-purple-400">AND</p>
              <li>
                <span className="text-purple-300">Attend both Phase 02 and Phase 03 sessions.</span>
              </li>
              <p>
                Participants who fail to meet these attendance requirements will{" "}
                <strong className="text-purple-500">NOT</strong> receive a certificate or
                recommendation letter.
              </p>
            </ul>
          </motion.div>

          {/* Registration Instructions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2
              className="text-2xl font-semibold text-transparent bg-clip-text
                         bg-gradient-to-r from-purple-300 to-purple-500"
            >
              Registration Instructions
            </h2>
            <ol className="list-decimal list-inside ml-4 space-y-3 text-gray-300 leading-relaxed">
              <li>
                <strong className="text-purple-400">Email Requirements:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>
                    IIT students must use their IIT email (<code>@iit.ac.lk</code>).
                  </li>
                  <li>Other university and school students must use their personal email.</li>
                </ul>
              </li>

              <li>
                <strong className="text-purple-400">Username Format:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>
                    <span className="text-purple-300 font-semibold">
                      IIT students:
                    </span>{" "}
                    FirstName_IITID (Example: <code>John_20230001</code>).
                  </li>
                  <li>
                    <span className="text-purple-300 font-semibold">
                      Other university and school students:
                    </span>{" "}
                    FirstName_UniversityName or FirstName_SchoolName
                    (Example: <code>Sarah_ColomboUni</code> or <code>David_RoyalCollege</code>).
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-purple-400">Bank Payment Slip:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Upload a clear and valid bank payment slip in PDF or image format.</li>
                  <li>
                    Failure to upload a valid payment slip will result in an{" "}
                    <span className="text-purple-500">unsuccessful registration</span>.
                  </li>
                  <li>Double-check your email and username format before submitting.</li>
                </ul>
              </li>

              <li>
                <strong className="text-purple-400">Zoom Session Login Requirement:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>
                    Participants must log in to all online Zoom sessions using the{" "}
                    <span className="text-purple-300">
                      same username they used during registration
                    </span>
                    .
                  </li>
                  <li>
                    Failure to use the correct username may result in attendance not being
                    recorded.
                  </li>
                </ul>
              </li>
            </ol>
          </motion.div>

          {/* Agreement & Confirmation */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2
              className="text-2xl font-semibold text-transparent bg-clip-text
                         bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"
            >
              Agreement & Confirmation
            </h2>
            <p className="text-gray-300 leading-relaxed">
              I have read and understood the above instructions. I agree to follow the
              registration guidelines and acknowledge that I will only receive the{" "}
              <span className="text-purple-300">Skill Up Participation Certificate</span>{" "}
              and Recommendation Letter if I meet the attendance requirements.
            </p>

            {/* Confirmation Checkbox */}
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="form-checkbox h-5 w-5 text-purple-500 
                           transition duration-150 ease-in-out rounded"
                required
              />
              <span className="select-none">
                <span className="text-purple-300">I agree</span> to the above statement.
              </span>
            </label>
          </motion.div>
        </motion.div>
      </div>
    </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition duration-200 flex items-center justify-center"
        >
          {loading ? "Processing..." : "Register Account"}
        </button>
      </form>

      {/* Floating WhatsApp Button */}
      <a
        href={generateWhatsAppMessage()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col items-center space-y-1"
      >
        <div className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition">
          <Image
            src="/whatsapp-icon.svg"
            alt="WhatsApp"
            className="w-8 h-8"
            width={32}
            height={32}
          />
        </div>
        <span className="text-sm text-gray-300 text-center">
          Contact for
          <br />
          any registration issues
        </span>
      </a>
    </div>
  );
}
