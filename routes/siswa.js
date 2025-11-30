// routes/siswa.js
const express = require('express');
const router = express.Router();
const Siswa = require('../models/Siswa');

// middleware ensure login
function ensureAuth(req,res,next){
  if(req.session.user) return next();
  req.flash('error_msg','Silakan login terlebih dahulu');
  res.redirect('/');
}

// list siswa
router.get('/', ensureAuth, async (req,res) => {
  const semua = await Siswa.find().sort({ nama: 1 });
  res.render('siswa_list', { siswas: semua });
});

// form tambah
router.get('/tambah', ensureAuth, (req,res) => {
  res.render('siswa_form', { siswa: null });
});

// proses tambah
router.post('/tambah', ensureAuth, async (req, res) => {
  try {
    const { nama, jk, nisn, nik, nokk, tingkat, rombel, tgl_masuk, terdaftar, tl } = req.body;

    const newSiswa = new Siswa({
      nama,
      jk,
      nisn,
      nik,
      nokk,
      tl,
      tingkat,
      rombel,
      tgl_masuk: new Date(tgl_masuk),
      terdaftar
    });

    await newSiswa.save();
    req.flash('success_msg', 'Data siswa berhasil ditambah');
    res.redirect('/siswa');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', err.message || 'Terjadi error');
    res.redirect('/siswa/tambah');
  }
});

// form edit by nisn
router.get('/edit/:nisn', ensureAuth, async (req,res) => {
  const nisn = req.params.nisn;
  const siswa = await Siswa.findOne({ nisn });
  if(!siswa){
    req.flash('error_msg','Siswa tidak ditemukan');
    return res.redirect('/siswa');
  }
  res.render('siswa_edit', { siswa });
});

// proses edit (hanya ngkat, rombel, tgl_masuk, terdaftar)
router.put('/edit/:nisn', ensureAuth, async (req,res) => {
  try {
    const nisn = req.params.nisn;
    const { tingkat, rombel, tgl_masuk, terdaftar } = req.body;
    const tgl = new Date(tgl_masuk);
    const siswa = await Siswa.findOne({ nisn });
    if(!siswa){
      req.flash('error_msg','Siswa tidak ditemukan');
      return res.redirect('/siswa');
    }
    siswa.tingkat = tingkat;
    siswa.rombel = rombel;
    siswa.tgl_masuk = tgl;
    siswa.terdaftar = terdaftar;
    await siswa.save();
    req.flash('success_msg','Data siswa berhasil diupdate');
    res.redirect('/siswa');
  } catch(err){
    console.error(err);
    req.flash('error_msg', err.message || 'Terjadi error saat update');
    res.redirect('/siswa');
  }
});

// delete by nisn
router.delete('/delete/:nisn', ensureAuth, async (req,res) => {
  try {
    const nisn = req.params.nisn;
    await Siswa.deleteOne({ nisn });
    req.flash('success_msg','Data siswa berhasil dihapus');
    res.redirect('/siswa');
  } catch(err){
    console.error(err);
    req.flash('error_msg','Gagal menghapus data');
    res.redirect('/siswa');
  }
});

module.exports = router;
