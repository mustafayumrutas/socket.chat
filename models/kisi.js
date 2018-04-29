var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var kisiSema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    kullaniciAdi: {type:String,required:true, unique:true, lowercase: true}, //index:true

    socketid: {type:String,required:true,unique:true},

    online:{type:Boolean,required:true},

    groups:[{type:String}],

    olusturulmaTarihi: {type: Date, default: Date.now() }
});

var kisi = mongoose.model('kisi', kisiSema);

module.exports = kisi;