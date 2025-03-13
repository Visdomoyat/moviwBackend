const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    try{
        if(!req.headers.authorization) {
            return res.status(401).json({err: 'No token provided'})
        }

        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(401).json({err:'Token missing'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }catch(err){
        res.status(401).json({err: 'Invalid or expired token'})
    }
}

module.exports = verifyToken