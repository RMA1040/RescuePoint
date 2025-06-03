import express from "express";
import { User } from "./interface";
import { login } from "./database";
import { secureMiddleware } from "./secureMiddleware";

export function loginRouter() {
    const router = express.Router();

    // GET /login
    router.get("/login", (req, res) => {
        if (req.session.user) {
            return res.redirect("/dashboard");
        }
        res.render("login");
    });

    // POST /login
    router.post("/login", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;

        try {
            const user: User = await login(email, password);
            delete user.password;
            req.session.user = user;
            res.redirect("/dashboard"); // ✅ Deze regel ontbrak
        } catch (e: any) {
            console.error("[login] Foutieve login:", e.message);
            res.redirect("/login");
        }
    });

    // POST /logout
    router.post("/logout", secureMiddleware, (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error("[logout] Fout bij sessie beëindigen:", err);
            }
            res.redirect("/login");
        });
    });

    return router;
}
