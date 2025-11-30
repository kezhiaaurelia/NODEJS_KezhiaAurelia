const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

function ensureAuth(req, res, next){
  if(req.session.user) return next();
  req.flash('error_msg','Login required');
  res.redirect('/');
}

// seed admin jika belum ada (jalankan saat server start)
(async function seedAdmin(){
  try {
    const admin = await User.findOne({ username: 'admin' });
    if(!admin) {
      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync('admin', salt);
      await User.create({ username: 'admin', password: hashed });
      console.log('Admin user created (username: admin, password: admin)');
    }
  } catch(err){ console.error(err); }
})();

// login page
router.get('/', (req,res) => {
  res.render('login');
});

// proses login
router.post('/login', async (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    req.flash('error_msg','Isi username dan password');
    return res.redirect('/');
  }

  const user = await User.findOne({ username });
  if(!user){
    req.flash('error_msg','User tidak ditemukan');
    return res.redirect('/');
  }

  const match = user.comparePassword(password);
  if(!match) {
    req.flash('error_msg','Password salah');
    return res.redirect('/');
  }

  // simpan session
  req.session.user = { id: user._id, username: user.username };
  req.flash('success_msg','Login berhasil');
  res.redirect('/home');
});

// logout
router.get('/logout', (req,res) => {
  req.session.destroy(()=> {
    res.redirect('/');
  });
});

module.exports = router;
