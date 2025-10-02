import { Storage } from "@google-cloud/storage";

const rawCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!rawCredentials) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS env variable");
}

let parsedCredentials;
try {
  parsedCredentials = JSON.parse(rawCredentials);
} catch (err) {
  throw new Error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS JSON");
}

const storage = new Storage({
  projectId: parsedCredentials.project_id,
  credentials: {
    client_email: parsedCredentials.client_email,
    private_key: parsedCredentials.private_key,
  },
});

const bucketName = "calng-photo-bucket";
const bucket = storage.bucket(bucketName);

export { bucket };
