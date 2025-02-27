module.exports = {
    ensureAuthenticate(req, res, next)   {
        if(req.isAuthenticated()) {
            return next()
        }
        res.redirect(('user/login'))
    }
}