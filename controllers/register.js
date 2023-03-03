const handleRegister = async (req, res, db, bcrypt)=>{
    const {email, name, password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json('invalid form submission');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); //await createHash(password, 10);
    if(email && name && hashedPassword){
        db.transaction(trx => {
            trx.insert({hash: hashedPassword, email: email})
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .then(user => {
                    res.status(201).json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch(err => res.status(400).json('unable to register'));
    }else{
        res.status(400).json("register failed");
    }
}

module.exports = {
    handleRegister
}