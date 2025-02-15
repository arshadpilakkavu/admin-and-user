const checkSession = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect("/login")
    }
}

const isLogin = (req, res, next) => {
    if (req.session.admin) {
        res.redirect("/dashboard")
    } else {
        next()
    }

}






module.exports = { checkSession, isLogin }