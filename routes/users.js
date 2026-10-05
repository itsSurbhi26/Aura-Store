const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

router.get('/', async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        return res.status(500).json({success:false})
    }
    res.send(userList);
})

router.get ('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, message: 'The user with the given ID does not exist' });
        }
        res.status(200).send(user);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Invalid user ID or server error', error: err.message });
    }
})

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    user = await user.save();

    if (!user)
        return res.status(404).send('User cannot be created')
    res.send(user);
})

router.put('/:id', async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        if (!userExist) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Only re-hash password if a new one is provided
        let newPasswordHash = userExist.passwordHash;
        if (req.body.password) {
            newPasswordHash = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name || userExist.name,
                email: req.body.email || userExist.email,
                passwordHash: newPasswordHash,
                phone: req.body.phone || userExist.phone,
                isAdmin: req.body.isAdmin !== undefined ? req.body.isAdmin : userExist.isAdmin,
                street: req.body.street || userExist.street,
                apartment: req.body.apartment || userExist.apartment,
                zip: req.body.zip || userExist.zip,
                city: req.body.city || userExist.city,
                country: req.body.country || userExist.country,
            },
            { new: true }
        ).select('-passwordHash');

        if (!updatedUser) {
            return res.status(400).json({ success: false, message: 'User cannot be updated' });
        }
        res.status(200).send(updatedUser);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'User deleted successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email})
    const secret = process.env.secret;

    if(!user) {
        return res.status(400).send('User with given Email not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userID: user.id,
            isAdmin : user.isAdmin
        }, secret, {expiresIn : '1d'} )
        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('Password is mismatch');
    }
})

router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments();
    if (userCount === undefined || userCount === null) {
        return res.status(500).json({ success: false })
    }
    res.status(200).send({
        userCount: userCount
    });
})

module.exports = router;