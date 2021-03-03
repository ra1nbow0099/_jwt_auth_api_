const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const {registerSchema, loginSchema} = require('../middlewares/validation')
const User = require('../model/User')

//REGISTER
router.post('/register', async (req, res) => {
    //validation
    const {error} = registerSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.message)
    }
        // If user is already exist
        const emailExist = await User.findOne({email : req.body.email})
        if (emailExist) return res.status(400).send('User is already exist!')

        //Creating hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        try{
            //saving to DB
            await user.save()
            //creating token
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' })
            res.header('auth-token', token).send('Registered successfully! Your token is: ' + token)
        } catch(err) {
            res.status(400).send('Server error!' + err)
        }
})

//LOGIN
router.post('/login', async (req, res) => {
        //validation
        const {error} = loginSchema.validate(req.body)
        if(error){
            return res.status(400).send(error.message)
        }
    //Finding
    const user = await User.findOne({email : req.body.email})
    if (!user) res.status(400).send('Problems with signing in?')
    //password
    const validPass = bcrypt.compare(req.body.password, user.password)
    if(!validPass) res.status(400).send('Problems with signing in?')
    //creating token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' })
    res.header('auth-token', token).send('Logged in! Your token is: ' + token)

})

//TEST ROUTE
router.get('/info', verifyToken ,(req, res) => {
    res.send('Some info!')
})



module.exports = router