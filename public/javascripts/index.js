// $('#btnLogout').on('click', function () {
//     $.post('/logout', function (data) {
//         if (data.code != 200) {
//             $('#myModal .modal-body').text("注销发生错误");
//             $('#myModal').modal();
//             return;
//         }
//         location.href = "/login";
//     }
//     )
// })







    // $.ajax是jquery中ajax最底层的方法，get(),post(),getJson().getScript()是对ajax进行的封装
    // $.ajax又是对原生JS对象XmlhttpRequest进行封装
    // RESTful风格，有get，post，put，delete
    // Jquery脚本库中没有封装put和delete方法，所以要调用这两种方法，只能使用$.ajax


    // 第一种方法，使用$.fn.extend(),此种调用方法，必须先选择一个元素，再调用方法
    // $.fn.extend({
    //   why:function(){
    //     console.log("why")
    //   }
    // })
    // $(document).why()


    // //第二种方法，使用$.extend()
    // $.extend({
    //   rua:function(){
    //     console.log("rua")
    //   }
    // })
    // $.rua()


    // $("#btnLogout").click(function () {
    //   $.ajax({
    //     method: 'post',
    //     url: "/logout",
    //     data: {},
    //     success: function (data) {
    //       if (data.code != 200) {
    //         $('#myModal .modal-body').text('注销异常')
    //         $('#myModal').modal()
    //         return
    //       }

    //       location.href = 'login'

    //     },
    //     error: function (err) {
    //       $('#myModal .modal-body').text(err.message)
    //       $('#myModal').modal()
    //       return
    //     }
    //   })
    // })



    // $('.list-group a').click(function(){
//     $.cookie('activeLink',$(this).attr('href'));
// })

// var activeLink = $.cookie('activeLink');
// console.log(activeLink)
// $('.list-group a').removeClass('active');
// if(activeLink){
//     $(`.list-group a[href='${activeLink}']`).parent().addClass('active')
//     $(`.list-group a[href='${activeLink}']`).addClass('aWhite') 
// }

//获得当前url的path
var activeLink = purl().data.attr.path;
// $('.list-group a').parent().addClass('active')
$(`.list-group a[href='${activeLink}']`).parent().addClass('active');
$('.panel-title a').attr('aria-expanded', false);
$('.panel-collapse').removeClass('in');

console.log($(`.list-group a[href='${activeLink}']`).length)
if($(`.list-group a[href='${activeLink}']`).length == 0){
    $('.panel-collapse:first').addClass('in')
}
else{
    $(`.list-group a[href='${activeLink}']`).closest('.panel-default').find('.panel-title a').attr('aria-expanded', true);
    $(`.list-group a[href='${activeLink}']`).closest('.panel-collapse').addClass('in');
}




$('#logout').click(function(){
        $.post('/logout', function (data) {
        if (data.code != 200) {
            $('#myModal .modal-body').text(data.message);
            $('#myModal').modal();
            return;
        }
        location.href = "/login";
    }
    )
})