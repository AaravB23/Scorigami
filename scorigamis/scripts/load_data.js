/**  Uploads clean data from local CSV to Firestore.
 *   Prerequisites:
 *      1. scraper.py ran, to get initial data.
 *      2. data_cleaner.py ran, to get cleaned CSV file.
 *      3. Run this script to upload to Firestore.
 */
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { fileURLToPath } from "url";

// Setup paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Used before Github Actions
//const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin SDK server-side
// Service Account saved on Github
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // Running in GitHub Actions — use secret from env
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  // Running locally — use local file
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      "Missing Firebase credentials."
    );
  }
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Clears the database, only ran sometimes.
async function clearCollection(collectionName, batchSize = 200) {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.limit(batchSize).get();

  if (snapshot.empty) {
    console.log(`${collectionName} collection already empty.`);
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));

  await batch.commit();
  console.log(`Deleted ${snapshot.size} docs from ${collectionName}`);

  // Recurse until the collection is empty
  await clearCollection(collectionName, batchSize);
}

// Read the CSV 
async function readCSV(filePath) {
    const file = fs.readFileSync(filePath, "utf8");

    const parsed = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    });

    if (parsed.errors.length) {
    throw new Error("CSV could not be parsed correctly.");
    }

    console.log("CSV parsed successfully.");
    return parsed.data;
}

// Find newest cleaned CSV
function findCleanedCSV(dir) {
    if (!fs.existsSync(dir)) return null;

    const files = fs.readdirSync(dir);
    const target = files.find((f) => f.startsWith("cleaned_scorigami_data_"));

    return target ? path.join(dir, target) : null;
}

// Main upload function
async function uploadGamesToFirestore(games) {
    const BATCH_SIZE = 100;
    let batch = db.batch();
    let count = 0;
    let batchNum = 1;

    console.log(`Found ${games.length} games. Uploading in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < games.length; i++) {
    const g = games[i];
    if (!g.W_Team || !g.L_Team || !g.Year) continue;

    // Use unique ID in format:
    // "Winner-Loser-Month-Day-Year"
    // Slashes are removed since Firestore document IDs cannot contain them.
    const gameId = `${g.W_Team}-${g.L_Team}-${g.Month}-${g.Day}-${g.Year}`.replace(/\s+/g, "_");
    const ref = db.collection("games").doc(gameId);

    if (i < 3) {
        console.log("Sample upload:", g);
        console.log("Doc ID:", gameId);
    }

    batch.set(ref, g);
    count++;

    // Upload in small batches just in case there are issues with one file
    // Easier to narrow issues down
    if (count >= BATCH_SIZE || i === games.length - 1) {
        console.log(`\nCommitting batch #${batchNum} (${count} docs)...`);
        try {
            await batch.commit();
            console.log(`Batch #${batchNum} committed successfully.`);
        } catch (err) {
            console.error(`Batch #${batchNum} failed:`, err.message);
        }
        batch = db.batch();
        count = 0;
        batchNum++;
    }
    }
}

// Main Execution, execute immediately
(async () => {
    try {
        const dir =
        process.env.GITHUB_ACTIONS === "true"
            ? path.join(process.cwd(), "public") // GitHub Actions
            : path.join(__dirname, "../public"); // Local
        const filePath = findCleanedCSV(dir);
    if (!filePath) throw new Error("No cleaned CSV found in ../public.");

    // Only clear if want to reset DB.
    const resetDB = true;
    if (resetDB) await clearCollection("games");

    const games = await readCSV(filePath);
    if (!games.length) throw new Error("CSV file empty or unreadable.");

    await uploadGamesToFirestore(games);
    } catch (err) {
        console.error("Script failed:", err.message);
        process.exit(1);
    } finally {
        console.log("Upload complete - Firestore connection will auto-close.");
    }
})();