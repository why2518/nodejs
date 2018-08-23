$('#btnSave').click(function (e) {
    e.preventDefault();
    

    var tno = $.trim($('#tno').val());
    var name = $.trim($("#name").val());
    var birthday = $.trim($('#birthday').val())
    if(!tno){
        $('#myModal .modal-body').text("来自客户端的验证，教师编号，姓名，生日不能为空!");
        $('#myModal').modal();
        return;
    }


    
    var data = {
        tno: $('#tno').val(),
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
    $.post('/teachers/add', data, function (d) {
        if(d.code != 200){
            $('#myModal .modal-body').text(d.message);
            $('#myModal').modal();
            return;
        }
        
        location.href = '/students/list'
    })
})