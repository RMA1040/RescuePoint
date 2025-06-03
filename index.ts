import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import ejs from "ejs";
import { connect, client, createInitialUser } from "./database";
import { Client } from "./interface";
import session from "./session";
import { secureMiddleware } from "./secureMiddleware";
import { loginRouter } from "./loginRouter";

const app = express();
app.set("view engine", "ejs");
app.use(session);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("port", 3000);

app.use(loginRouter());

// Connect to MongoDB before server starts
connect().then(async () => {
  await createInitialUser();
  const db = client.db("login-express");
  const requestCollection = db.collection<Client>("requests");

  // ✅ TTL-index: verwijder verzoeken automatisch na 24 uur
  await requestCollection.createIndex(
    { time: 1 },
    { expireAfterSeconds: 60 * 60 * 24 } // 24 uur
  );

  // ROUTES
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/privacy", (req, res) => {
    res.render("privacy");
  });

  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  app.get("/dashboard", secureMiddleware, async (req, res) => {
    try {
      const requests = await requestCollection.find().toArray();
      res.render("dashboard", { request: requests });
    } catch (error) {
      console.error("Fout bij ophalen van verzoeken:", error);
      res.status(500).send("Interne serverfout");
    }
  });

  app.post("/request", async (req, res) => {
    const { name, licensePlate, latitude, longitude } = req.body;

    const newRequest: Client = {
      name,
      licensePlate,
      latitude,
      longitude,
      time: new Date(), // ⚠️ belangrijk voor TTL
    };

    try {
      await requestCollection.insertOne(newRequest);
      res.render("confirmation", {
        name: newRequest.name,
        licensePlate: newRequest.licensePlate,
        latitude: newRequest.latitude,
        longitude: newRequest.longitude,
      });
    } catch (error) {
      console.error("Fout bij opslaan van aanvraag:", error);
      res.status(500).send("Er ging iets mis bij het opslaan van je aanvraag.");
    }
  });

  // 404 fallback
  app.use((req, res) => {
    res.type("text/html");
    res.status(404).send("404 - Niet gevonden");
  });

  app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
  );
});
