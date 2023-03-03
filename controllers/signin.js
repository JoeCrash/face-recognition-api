const handleSignin = (req, res, db, bcrypt)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('invalid form submission');
    }

    db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(async(data) => {
        const isValidPassword = await bcrypt.compare(req.body.password, data[0].hash); //await compareStringToHash(req.body.password, data[0].hash);
        if(isValidPassword){
            return db.select('*')
            .from('users')
            .where('email', '=', req.body.email)
            .then(user => res.status(200).json(user[0]) )
            .catch(err => res.status(400).json("unable to get user") )
        }else{
            res.status(400).json("invalid credentials");
        }
    })
    .catch(err => res.status(400).json("bad user pass combo") )
}

module.exports = {
    handleSignin
}