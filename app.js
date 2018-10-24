const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();

app.get('/api/free', (req, res) => {
    res.json({
        message: 'Welcome to the free API'
    });
});

app.get('/api/nonfree', verifyToken, (req, res) => {
    jwt.verify(req.token, 'super_secret', (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Done .... ',
                authData: decoded
            });
        }
    });

});

function verifyToken(req, res, next) {
    const jwtHeader = req.headers['jwt']
    if (typeof jwtHeader === 'undefined') {
        res.sendStatus(403);
    } else {
        req.token = jwtHeader;
        next();
    }

}

app.post('/api/login', (req, res) => {
    if (typeof req.headers['name'] !== 'undefined' && typeof req.headers['email'] !== 'undefined') {
        //Find user
        const user = {
            id: new Date().getTime(),
            username: req.headers['name'],
            email: req.headers['email']
        }
        jwt.sign({ user: user }, 'super_secret', { expiresIn: '30s' }, (error, token) => {
            if (!error) {
                res.setHeader('jwt',token);
                res.end()
            } else {
                res.sendStatus(500);
            }
        });
    } else {
        res.redirect('/api/free');
    }
});


module.exports = router;
app.listen(5000, () => console.log('server listening on port 5000'));