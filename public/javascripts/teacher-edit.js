$('#btnSave').click(function (e){
    e.preventDefault();
    var tno = $.trim($('#tno').val());
    var name = $.trim($("#name").val());
    var birthday = $.trim($('#birthday').val())
    if(!tno){
        $('#myModal .modal-body').text("来自客户端的验证，学号，姓名，生日不能为空!");
        $('#myModal').modal();
        return;
    }

    var data = {
        id:$("input[type = 'hidden']").val(),
        tno: tno,
        name: name,
        sex: $('#sex').val(),
        birthday: birthday,
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


    $.post('/teachers/edit',data,function(data){
        if(data.code != 200){
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }
        location.href = '/teachers/list'
    })
})