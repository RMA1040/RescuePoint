import { NextFunction, Request, Response } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        // Zet de gebruiker ook beschikbaar in views (EJS bijv.)
        res.locals.user = req.session.user;
        return next();
    }
    return res.redirect("/login");
}
