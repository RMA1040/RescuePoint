import express from "express";
import ejs from "ejs";
import {Client} from "./interface";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("port", 3000);

// ROUTE HANDLING
app.get("/", (req,res) =>{
    res.render("index");
});

app.get("/login", (req,res) =>{
    res.render("login");
});

app.get("/privacy", (req,res) =>{
    res.render("privacy");
});

app.get("/contact", (req,res)=>{
    res.render("contact");
});

app.post("/request", (req, res) => {
    const { name, licensePlate, latitude, longitude } = req.body;
    console.log(`Naam: ${name}, Nummerplaat: ${licensePlate}`);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Render de bevestigingspagina met de ontvangen gegevens
    res.render("confirmation", { name, licensePlate, latitude, longitude });
});

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send("404 - Not Found");
    }
);

app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));