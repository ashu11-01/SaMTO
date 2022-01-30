const bcrypt = require('bcryptjs')
const user = require('../models/user-model')
const {passport,getToken, verifyToken} = require('../middlewares/passport')

exports.register = async (req,res) => {
    let {name,email,password,roleType} = req.body
    // console.log(req.body)
    if(!name || !email || !password || !roleType){
        //console.log({name,email,password,roleType})
        return res.status(404).send('Invalid request')
    }

    try{
        let dbResponse = null;
        const userResult = await user.findOne({email})
        if(userResult && userResult.email === email){
            return res.status(400).send(`${email} is already in use`)
        }
        else{
            // create new user with recieved req body
            const hashedPswd = bcrypt.hashSync(password, bcrypt.genSaltSync());
            // const newUser = new user ({name, email, password : hashedPswd, roleType})
            const dbResponse = await user.create({name, email, password : hashedPswd, roleType})
            return res.send(dbResponse)
                
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send('An error occurred')
    }
}

exports.login = async(req,res) => {
    const reqEmail = req.body.email
    const reqPswd = req.body.password
    try{
        let dbResponse
        dbResponse = await user.findOne({email:reqEmail})
        if(!dbResponse){
            return res.status(401).send('Incorrect Email id')
        }
        // console.log(dbResponse)
        // return res.send(dbResponse)
        bcrypt.compare(reqPswd,dbResponse.password,(err,success)=>{
            if(err){
                console.log(err)
                return res.status(500).send('Something went wrong')
            }
            else if(success){
                const userObj = {'_id':dbResponse._id}
                const token = getToken(userObj)
                return res.status(200).send({
                    success : true,
                    message : 'Login successful',
                    token
                })
            }
            else{
                return res.status(401).send('Incorrect password')
            }
        })
    }
    catch(err){
        console.log('User auth error', err)
        return res.status(500).send('Something went wrong')
    }
}

exports.getUserByEmail = (req,res,next)=>{
    const userResult ={
        success :true,
        email : req.user.email,
        roleType : req.user.roleType
    }
    res.send(userResult)
}