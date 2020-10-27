$(function () {
  // 点击"去注册账号"的链接
  $("#link_reg").on("click", function () {
    $(".login-box").hide().siblings().show();
  });

  // 点击"去登陆" 的链接
  $("#link_login").on("click", function () {
    $(".reg-box").hide().siblings().show();
  });

  // 从 layui 中获取 form 对象
  var form = layui.form;
  // 通过 form.verify 函数,自定义效验规则

  form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 效验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的确认密码框中的内容
      // 还需拿到密码框中的内容
      // 然后进行一次等于判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致! ";
      }
    },
  });

  var layer = layui.layer;
  // 监听表单注册提交事件
  $("#form_reg").on("submit", function (e) {
    // 1. 阻止表单的提交行为
    e.preventDefault();
    // 2. 发起 Ajax 的POST请求
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      // 模拟人的点击行为
      $("#link_login").click();
      return layer.msg("注册成功，请登录！");
    });
  });

  // 监听表单登陆提交事件
  $("#form_login").on("submit", function (e) {
    // 1. 阻止表单的提交行为
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/api/login",
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("登陆失败！");
        }
        layer.msg("登陆失败！");
        // 将登陆成功得到的 token 存到 localStorage 中
        localStorage.setItem("token", res.token);
        // 跳转到后台主页
        location.href = "/index.html";
      },
    });

    // var data = {
    //   username: $("#form_login [name=username]").val(),
    //   password: $("#form_login [name=password]").val(),
    // };
    // $.post("http://ajax.frontend.itheima.net/api/login", data, function (res) {
    //   if (res.status !== 0) {
    //     return layer.msg(res.message);
    //   }
    //   localStorage.setItem("token", res.token);
    //   return (window.location = "index.html");
    // });
  });
});
