const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const {token} = req.body;
    if(!token){
        return res.send('Access denied');
    }
    jwt.verify(token, 'MasterKey', (err,decoded) => {
        if(err){
            return res.send(err);
        }
        req.body.username = decoded.username;
        next();
    });
}

module.exports = verifyToken;