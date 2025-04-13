import { Readline } from "readline/promises";
import * as readline from 'readline-sync';
import express from "express";
import ejs from "ejs";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("port", 3000);

// ROUTE HANDLING
app.get("/", (req,res) =>{
    res.render("index");
});

app.use((req, res) => {
    res.type("text/html");
    res.status(404);
    res.send("404 - Not Found");
    }
);

app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));




/*
let ClientName: string;
let LicensePlate: string;

ClientName = readline.question("Geef uw naam in: ");
LicensePlate = readline.question("Geef uz nummerplaat in: ");
console.log(`Klant: ${ClientName} met nummerplaat ${LicensePlate}`);
*/