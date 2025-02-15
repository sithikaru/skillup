import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

// Disable bodyParser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Load Service Account Key (Replace with actual JSON file path)
const KEY_FILE_PATH = path.join(process.cwd(), "service-account.json");
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing form data" });
    }

    const file = files.file as any; // Get uploaded file
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Upload file to Google Drive
      const response = await drive.files.create({
        requestBody: {
          name: file.originalFilename,
          parents: ["YOUR_GOOGLE_DRIVE_FOLDER_ID"], // Change this!
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.filepath),
        },
      });

      // Make file public
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const fileLink = `https://drive.google.com/uc?id=${response.data.id}`;
      return res.status(200).json({ fileUrl: fileLink });

    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      return res.status(500).json({ message: "Failed to upload file" });
    }
  });
}
