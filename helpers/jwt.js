const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked : isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

async function isRevoked (req, token) {
    const payload = token?.payload || token || {};
    const api = process.env.API_URL;
    
    // Allow logged-in regular users for customer-specific actions
    if (req.method === 'POST' && req.url.startsWith(`${api}/orders`)) {
        return false;
    }
    if (req.method === 'GET' && req.url.startsWith(`${api}/orders/get/usersorders/`)) {
        return false;
    }
    if (req.method === 'GET' && req.url.startsWith(`${api}/users/`)) {
        return false;
    }

    if (!payload.isAdmin) {
        return true;
    } 

    return false;
}

module.exports = authJwt;