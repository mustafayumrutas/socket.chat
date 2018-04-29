
$("document").ready(function () {
   console.log('ben böyleyim');
    var socket = io.connect('http://localhost:3000');
    function listedoldur() {
        $.ajax({
            type: 'POST',
            url: '/kullanicilar',
            dataType: 'json',
            success: kullanicigoster
        });
        function kullanicigoster(data,status) {
            for(i = 0;i<data.items.length;i++) {
                if ($('#kullaniciadi').val() != data.items[i].kullaniciAdi) {
                    if(data.items[i].online==true) {
                        var users = $("<li class=\"list-group-item list-group-item-success\"></li>").text(data.items[i].kullaniciAdi).attr('id', data.items[i].kullaniciAdi);
                    }
                    else {
                        var users = $("<li class=\"list-group-item list-group-item-danger\"></li>").text(data.items[i].kullaniciAdi).attr('id', data.items[i].kullaniciAdi);
                    }

                    $('#list-tab').append(users);
                }
            }
            $('#baslik').html('Kullanici Adi: ').append($('#kullaniciadi').val());
        }
    }
    function chatdoldur(msg) {
        $.ajax({
            type: 'POST',
            url: '/mesajlasma',
            dataType: 'json',
            data: {msg: msg},
            success: chatgoster
        });

        function chatgoster(data, status) {
            for (i = 0; i < data.chats.length; i++) {
                if (data.chats[i].alankullanici == 'all') {
                    if(data.chats[i].gonderenkullanici!=$('#kullaniciadi').val()) {
                        $('#Mesajlasma').append("<li><b><span style=color:black>" + "[General from "+ data.chats[i].gonderenkullanici+"]"+"</span></b> :"+ data.chats[i].mesaj + "</li><hr/>");

                    }
                    else{
                        $('#Mesajlasma').append("<li><b><span style=color:black>" + "["+ data.chats[i].gonderenkullanici+" To General "+"]"+"</span></b> :"+ data.chats[i].mesaj + "</li><hr/>");
                    }
                }
                else if (data.chats[i].alankullanici == $('#kullaniciadi').val()) {
                    $('#Mesajlasma').append("<li><b><span style=color:#AE00FF>" + "[Whisper from "+ data.chats[i].gonderenkullanici+"]"+"</span></b> :" + data.chats[i].mesaj + "</li><hr/>");
                }
                else if (data.chats[i].alankullanici.substr(0,5) !='group') {
                    $('#Mesajlasma').append("<li><b><span style=color:#AE00FF>" + "[Whisper to "+ data.chats[i].alankullanici+"]"+"</span></b> :" + data.chats[i].mesaj + "</li><hr/>");
                }
                else {
                    var group = data.chats[i].alankullanici.substr(5);
                    if(data.chats[i].gonderenkullanici!=$('#kullaniciadi').val()) {
                        $('#Mesajlasma').append("<li><b><span style=color:#FF9900>" + group+" from "+ data.chats[i].gonderenkullanici+"]"+"</span></b> :"+ data.chats[i].mesaj + "</li><hr/>");

                    }
                    else{
                        $('#Mesajlasma').append("<li><b><span style=color:#FF9900>" + "["+ data.chats[i].gonderenkullanici+" To " + group +"]"+"</span></b> :"+ data.chats[i].mesaj + "</li><hr/>");
                    }

                }
            }
            $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
        }
    }

    $('#girdi').submit(function () {
       socket.emit('chat message',$('#yazi').val(),function (err) {
           if(err){
               if (err.substr(0, 3) === '/e ') {
                   msg = err.substr(3);
                   var ind = msg.indexOf(' ');
                   if (ind !== -1) {
                       var err = msg.substr(0);
                       $('#Mesajlasma').append("<li><b><span style=color:#BD0000>"+err+"</span></li><hr/>");
                       $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
                   }
               }
               else{
                   $('#Mesajlasma').append("<li><b><span style=color:#009E25>"+err+"</span></li><hr/>");
                   $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
               }
           }
           else{
               if (msg.substr(0, 3) === '/w ') {
                   msg = msg.substr(3);
                   var ind = msg.indexOf(' ');
                   if (ind !== -1) {
                       var name = msg.substr(0, ind);
                       msg = msg.substr(ind + 1);
                       $('#Mesajlasma').append("<li><b><span style=color:#AE00FF>" + "[Whisper to "+ name+"]"+"</span></b> :" + '-' + msg + "</li><hr/>");
                       $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
                   }
               }
           }
       });
        var msg = $('#yazi').val().trim();
       $('#yazi').val('');
       return false;

    });
    socket.on('private message', function(msg){
        $('#Mesajlasma').append("<li><b><span style=color:#AE00FF>" + "[Whisper from "+ msg.kullaniciadi+"]"+"</span></b> :" + '-' + msg.mesaj + "</li><hr/>");
        $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
    });
    socket.on('all message', function(msg){
        if(msg.kullaniciadi!=$('#kullaniciadi').val()) {
            $('#Mesajlasma').append("<li><b><span style=color:black>" + "[General from "+ msg.kullaniciadi+"]"+"</span></b> :"+ msg.mesaj + "</li><hr/>");
            $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
        }
        else{
            $('#Mesajlasma').append("<li><b><span style=color:black>" + "["+ msg.kullaniciadi+" To General "+"]"+"</span></b> :"+ msg.mesaj + "</li><hr/>");
            $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
        }
    });
    socket.on('group message', function(msg){
        if(msg.kullaniciadi!=$('#kullaniciadi').val()) {
            $('#Mesajlasma').append("<li><b><span style=color:#FF9900>" + msg.grupismi+" from "+ msg.kullaniciadi+"]"+"</span></b> :"+ msg.mesaj + "</li><hr/>");
            $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
        }
        else{
            $('#Mesajlasma').append("<li><b><span style=color:#FF9900>" + "["+ msg.kullaniciadi+" To " + msg.grupismi +"]"+"</span></b> :"+ msg.mesaj + "</li><hr/>");
            $("#Mesajlasma").animate({ scrollTop: $("#Mesajlasma")[0].scrollHeight }, 1000);
        }
    });

    $('#kullanicigiris').submit(function (e) {
        e.preventDefault();
            socket.emit('new user',$('#kullaniciadi').val(),function (data) {
                if(data){
                    listedoldur();
                    chatdoldur($('#kullaniciadi').val());
                    $('.login').hide();
                    $('.chatbox').show();
                }
                else{
                    console.log('KULLANICI SUAN AKTİF');
                    alert($('#kullaniciadi').val()+' kullanicisi suan aktif');
                }
            });

    });
    socket.on('userdisconnect', function (data) {
        var txt='#'+data;
        console.log(data);
        $(txt).toggleClass('list-group-item-success list-group-item-danger');
    });
    socket.on('new user list',function (data) {
        if($('#kullaniciadi').val()!=data) {
            var newuserlist = $("<li class=\"list-group-item list-group-item-success\"></li>").text(data).attr('id', data);
            $('#list-tab').append(newuserlist);
        }
    });
    socket.on('change user list',function (data) {
        var changeuserlist='#'+data;
        $(changeuserlist).toggleClass('list-group-item-danger list-group-item-success');
    });


});