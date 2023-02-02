module.exports = {
    validateRegister: (req, res, next) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                msg: "Please Enter Email And Password",
            });
        }
        next();
    },
    
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
            if (!token) {
                throw new Error('Authentication failed!');
            }
            const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send('Invalid token !');
        }
    },
};