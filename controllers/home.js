const handleHome = (req, res, db)=> {
    db.select('*')
    .from('users')
    .then(data => {
        res.send(data);
    })
    .catch(err => res.send('unable to get users') );
}

module.exports = {
    handleHome
}