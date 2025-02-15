/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Load Service Account JSON
const KEY_FILE_PATH = path.join(process.cwd(), "service-account.json");
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export async function uploadToDrive(file: any) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: ["YOUR_GOOGLE_DRIVE_FOLDER_ID"], // Change to your Drive Folder ID
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    // Make the file public
    drive.permissions.create({
          fileId: response.data.id as string,
          requestBody: {
              role: "reader",
              type: "anyone",
          },
      });

    // Get file link
    const fileLink = `https://drive.google.com/uc?id=${response.data.id}`;
    return fileLink;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
}
