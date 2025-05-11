// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Bearer header

//     // Check if token is missing
//     if (!token) {
//         return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: true, message: "Forbidden: Invalid token" }); // 403 for invalid tokens
//         }
//         req.user = user; // Attach the decoded user data to the request object
//         next(); // Pass control to the next middleware
//     });
// }

// module.exports = {
//     authenticateToken,
// };
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Fetch the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ 
            error: true, 
            message: 'Unauthorized: No token provided' 
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: 'Forbidden: Invalid token'
            });
        }
        req.user = user; // Attach decoded user info to the request
        next();
    });
}

module.exports = { authenticateToken };

