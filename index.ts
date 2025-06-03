import express from "express";
import ejs from "ejs";
import dotenv from "dotenv";
import { connect, client,createInitialUser,login } from "./database";
import { Client,User } from "./interface";
import session from "./session";
import { secureMiddleware } from "./secureMiddleware";
import { loginRouter } from "./loginRouter";

dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(session);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("port", 3000);

app.use(loginRouter());

// Connect to MongoDB before server starts
connect().then(() => {
  createInitialUser();
  const db = client.db("login-express");
  const requestCollection = db.collection<Client>("requests");

  // ROUTES
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.get("/privacy", (req, res) => {
    res.render("privacy");
  });

  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  app.get("/dashboard",secureMiddleware, async (req, res) => {
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
      time: new Date(),
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

// Login route
app.post("/login", async (req, res) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  try {
    let user: User = await login(email, password);
    delete user.password;
    req.session.user = user;
    res.redirect("/");
  } catch (e: any) {
    res.redirect("/login");
  }
});

// Logout 
app.post("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
  // Fallback route
  app.use((req, res) => {
    res.type("text/html");
    res.status(404).send("404 - Niet gevonden");
  });

  app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
  );
});
