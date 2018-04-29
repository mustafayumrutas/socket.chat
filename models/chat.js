var mongoose = require('mongoose');

//Types: String, Number, Date, Buffer, Boolean, Mixed, Objectid, Array, Decimal128

var chatsema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    gonderenkullanici: {type:String,required:true, lowercase: true}, //index:true

    alankullanici: {type:String,required:true},

    olusturulmaTarihi: {type: Date, default: Date.now() },

    mesaj: {type:String}
});

var chat = mongoose.model('chat', chatsema);

module.exports = chat;