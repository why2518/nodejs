$('#btnSave').click(function (e) {
    e.preventDefault();
    

    var sno = $.trim($('#sno').val());
    var name = $.trim
    var birthday = $('#birthday').val()
    if(!sno){
        
    }


    
    var data = {
        sno: $('#sno').val(),
        name: $('#name').val(),
        sex: $('#sex').val(),
        birthday: $('#birthday').val(),
        card: $('#card').val(),
        majorId: 1,
        classId: 1,
        departId: 1,
        nativePlace: $('#nativePlace').val(),
        address: $('#address').val(),
        qq: $('#qq').val(),
        phone: $('#phone').val(),
        email: $('#email').val()
    }
    $.post('/students/add', data, function (d) {
        if(d.code != 200){
            $('#myModal .modal-body').text(d.message);
            $('#myModal').modal();
            return;
        }
        
        location.href = '/students/list'
    })
})