import { Readline } from "readline/promises";
import * as readline from 'readline-sync';

let ClientName: string;
let LicensePlate: string;

ClientName = readline.question("Geef uw naam in: ");
LicensePlate = readline.question("Geef uz nummerplaat in: ");
console.log(`Klant: ${ClientName} met nummerplaat ${LicensePlate}`);