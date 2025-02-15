import { google } from "googleapis";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import multer from "multer";

const upload = multer({ dest: "/tmp" });

const uploadMiddleware = upload.single("file");

export async function POST(req: Request) {
  return new Promise((resolve, reject) => {
    uploadMiddleware(req as any, {} as any, async (err) => {
      if (err) return reject(NextResponse.json({ error: "File upload failed" }, { status: 400 }));

      const file = (req as any).file;
      if (!file) return reject(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));

      try {
        const auth = new google.auth.GoogleAuth({
          keyFile: path.join(process.cwd(), "google-service-account.json"), // Your Google Drive API key file
          scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const drive = google.drive({ version: "v3", auth });

        const filePath = path.join("/tmp", file.filename);
        await writeFile(filePath, file.buffer);

        const driveRes = await drive.files.create({
          requestBody: {
            name: file.originalname,
            parents: ["YOUR_GOOGLE_DRIVE_FOLDER_ID"], // Replace with your shared folder ID
          },
          media: {
            mimeType: file.mimetype,
            body: file.buffer,
          },
        });

        const fileId = driveRes.data.id;

        // Make file public
        await drive.permissions.create({
          fileId: fileId!,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });

        const fileURL = `https://drive.google.com/uc?id=${fileId}`;

        return resolve(NextResponse.json({ fileURL }));
      } catch (error) {
        console.error("Google Drive Upload Error:", error);
        return reject(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
      }
    });
  });
}
