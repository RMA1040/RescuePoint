RescuePoint Webapplicatie
==========================

https://rescuepoint.cloud/

Beschrijving:
-------------
RescuePoint is een eenvoudige Node.js/Express-webapplicatie die hulpaanvragen verzamelt en beheert via een dashboard. Gebruikers kunnen hun naam, nummerplaat en locatie indienen, waarna een bevestigingsscherm verschijnt. Admin-gebruikers kunnen ingelogd op het dashboard de ingediende hulpverzoeken bekijken. Verzoeken worden automatisch verwijderd na 24 uur.

Functionaliteiten:
------------------
- Invoeren van hulpverzoeken via formulier
- Bevestigingspagina na indienen
- Dashboard met overzicht van alle verzoeken (alleen voor ingelogde gebruikers)
- Login en logout voor admin-gebruikers
- Automatische verwijdering van oude verzoeken via MongoDB TTL-index

Technologieën:
--------------
- Node.js
- Express
- TypeScript
- MongoDB
- EJS templating engine
- express-session + connect-mongodb-session voor sessiebeheer

Installatie:
------------
1. Clone deze repository
2. Installeer dependencies met `npm install`
3. Maak een `.env` bestand met:
   - `MONGODB_URI=your_mongodb_connection_string`
   - `SESSION_SECRET=your_session_secret`
4. Start de server met `npm start`
5. Open http://localhost:3000 in je browser

Mappenstructuur:
----------------
- `index.ts`        → startpunt van de applicatie
- `views/`          → EJS-templates
- `public/`         → statische bestanden (CSS, afbeeldingen)
- `database.ts`     → verbinding met MongoDB en helper-functies
- `loginRouter.ts`  → login- en logout-routes
- `session.ts`      → sessiebeheer
- `secureMiddleware.ts` → middleware voor routebescherming

Beveiliging:
------------
- Alleen ingelogde gebruikers kunnen het dashboard bekijken
- Sessies worden opgeslagen in MongoDB
- Wachtwoorden worden gecontroleerd via een login-functie in `database.ts`

Auteur:
-------
Raymond Maetha
Gemaakt voor een intern project of demo-doeleinden.

