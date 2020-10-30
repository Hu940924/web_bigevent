$(function () {
  // 获取 form 对象
  var form = layui.form;
  var layer = layui.layer;
  // 自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新密码与原密码不能相同 ！";
      }
    },
    rePwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次密码不一致！";
      }
    },
  });
  //
  //
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message + "请从新登陆！");

        // 重设表单
        $(".layui-form")[0].reset();
        // $(".layui-input").val("");
        //
        setInterval(function () {
          localStorage.removeItem("token");
          window.parent.location.href = "/login.html";
        }, 1000);
      },
    });
  });
});
