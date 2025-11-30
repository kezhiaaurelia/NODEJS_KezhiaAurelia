const mongoose = require('mongoose');

const SiswaSchema = new mongoose.Schema({
  nama: { type: String, required: true, trim: true },
  jk: { type: String, enum: ['L','P'], required: true },
  nisn: { type: String, required: true, unique: true }, // validasi digit di validator
  nik: { type: String, required: true, unique: true },
  nokk: { type: String, required: true },
  tingkat: { type: String, enum: ['X','XI','XII'], required: true },
  rombel: { type: String, enum: ['PPLG 1','PPLG 2','RPL 1','RPL 2'], required: true },
  ttl: {type: String,required: true},
  tgl_masuk: { type: Date, required: true },
  terdaftar: { type: String, enum: ['Siswa Baru','Pindahan'], required: true }
}, { timestamps: true });

SiswaSchema.path('nisn').validate(function(value) {
  return /^\d{10}$/.test(value); // 10 digit
}, 'NISN harus 10 digit angka');

SiswaSchema.path('nik').validate(function(value) {
  return /^\d{16}$/.test(value); // 16 digit
}, 'NIK harus 16 digit angka');

SiswaSchema.path('tgl_masuk').validate(function(value) {
  // maksimal hari ini
  if(!value) return false;
  const today = new Date();
  today.setHours(23,59,59,999);
  return value <= today;
}, 'Tanggal masuk tidak boleh melewati hari ini');

module.exports = mongoose.model('Siswa', SiswaSchema);
