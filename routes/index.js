var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var kisi = require('../models/kisi');
var chat = require('../models/chat');

mongoose.connect('mongodb://localhost/Mesajlasma', function (err) {

    if (err) throw err;

    console.log('routerden veritabanına bağlanıldı');
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/kullanicilar', function(req, res, next) {
    kisi.find({},{'kullaniciAdi':1,'online':1,'_id':0}).then(function (docs) {
        res.send({items:docs});
    });
});
router.post('/mesajlasma',function (req,res) {
    kisi.findOne({kullaniciAdi:req.body.msg},function (err,kisi) {
        if(err) throw err;
        chat.find({$or:[{'alankullanici':'all'},{'alankullanici':kisi.kullaniciAdi},
                {'alankullanici':'group'+kisi.groups},{'gonderenkullanici':kisi.kullaniciAdi}]},{'gonderenkullanici':1,
            'alankullanici':1,'mesaj':1,'_id':0},function (err,chat) {
            if (err) throw err;
            res.send({chats:chat});

        });
    });
});

module.exports = router;
