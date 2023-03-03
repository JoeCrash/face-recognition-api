const handleProfile = async (req, res, db)=>{
    const {id} = req.params;
    await db.select('*').from('users').where({id})
    .then(user => {
        if(user[0]) {
            res.status(200).json(user[0]);
        }else{
            res.status(404).json("User not found");
        }
    })
    .catch(err => res.status(400).json("Couldn't get user"));
}

module.exports = {
    handleProfile
}