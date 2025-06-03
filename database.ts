import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { User } from "./interface";
import bcrypt from "bcrypt";
dotenv.config();

console.log("Using MONGODB_URI:", process.env.MONGODB_URI);

// Haal de URI uit de omgeving, fallback naar lokale MongoDB
export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

// Maak een nieuwe MongoClient aan
export const client = new MongoClient(MONGODB_URI);

// Definieer de collectie voor gebruikers in de database "login-express"
export const userCollection = client.db("login-express").collection<User>("users");

// Functie om de MongoDB-verbinding netjes te sluiten bij afsluiten van het proces
async function exit() {
  try {
    await client.close();
    console.log("Disconnected from database");
  } catch (error) {
    console.error("Error during disconnection:", error);
  }
  process.exit(0);
}

// Connect functie die zorgt voor connectie en event listener voor process exit
export async function connect() {
  try {
    await client.connect();
    console.log("Connected to database");
    
    // Luister naar Ctrl+C / SIGINT en sluit connectie netjes af
    process.on("SIGINT", exit);
    
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Her-throw zodat de app hiervan weet
  }
}

// Login functie
export async function login(email: string, password: string): Promise<User> {
    if (!email || !password) {
        throw new Error("E-mail en wachtwoord zijn verplicht.");
    }

    const user: User | null = await userCollection.findOne({ email: email });

    if (!user) {
        throw new Error("Gebruiker niet gevonden.");
    }

    const passwordCorrect = await bcrypt.compare(password, user.password || "");
    if (!passwordCorrect) {
        throw new Error("Wachtwoord onjuist.");
    }

    return user;
}

const saltRounds = 12;

//Creat User functie voegt User toe aan database
export async function createInitialUser(): Promise<void> {
    const userCount = await userCollection.countDocuments();
    if (userCount > 0) {
        console.log("[info] Initial admin user already exists.");
        return;
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const adminUser: User = {
        email,
        password: hashedPassword,
        role: "ADMIN"
    };

    await userCollection.insertOne(adminUser);
    console.log(`[info] Initial admin user created with email: ${email}`);
}


