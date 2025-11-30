const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/home');
    }
    res.clearCookie('connect.sid'); // hapus session cookie
    res.redirect('/'); // kembali ke halaman login
  });
});

module.exports = router;
