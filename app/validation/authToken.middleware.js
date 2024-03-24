import jwt from "jsonwebtoken";

// this middleware is used to verify the token
export default function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token undefined" });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err)
            return res.status(403).json({ error: "Token verification failed" });

        req.user = user;
        next();
    });
}
