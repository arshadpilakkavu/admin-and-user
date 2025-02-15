const { checkSession, isLogin } = require('../middileware/auth');
const userSchema = require('../model/usermodel');
const bcrypt = require("bcrypt");
const saltround = 10;



// data save
const registerUser = async (req, res) => {
    try {

        const { name, phone, email, password } = req.body


        const user = await userSchema.findOne({
            $or: [
                { name },
                { phone },
                { email }
            ]
        });



        if (user) return res.render('user/singup', { msg: 'user exists' })

        const hashedPassword = await bcrypt.hash(password, saltround);

        const newUser = new userSchema({

            name,
            phone,
            email,
            password: hashedPassword


        })

        await newUser.save()

        res.render('user/login')

    } catch (error) {


    }


}

const logout = (req, res) => {
    req.session.user = null
    res.redirect('/')
}


//login funtion

const login = async (req, res) => {
    try {
        const { name, password } = req.body

        const user = await userSchema.findOne({ name })

        if (!user) return res.render('user/login', { msg: 'user not exist' })
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.render('user/login', { msg: 'incorect password' })
        req.session.user = true
        res.render('user/home', { msg: 'login successful' })

    } catch (error) {
        res.render('user/login', { msg: "somthimg wrong" })
    }



}


const loadSingup = (req, res) => {
    res.render('user/singup')

}


const loadLogine = (req, res) => {
    res.render('user/login')

}


//home

const loadHome = (req, res) => {
    res.render('user/home')
}





















module.exports = {
    registerUser,
    loadLogine,
    loadSingup,
    login,
    loadHome,
    checkSession,
    isLogin,
    logout,


}