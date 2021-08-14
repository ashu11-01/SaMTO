const bcrypt = require('bcryptjs')
const user = require('../models/user-model')

exports.register = async (req,res) => {
    let {name,email,password,roleType} = req.body
    // console.log(req.body)
    if(!name || !email || !password || !roleType){
        console.log({name,email,password,roleType})
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