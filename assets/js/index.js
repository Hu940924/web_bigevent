$(function () {
  // 调用 getUaerInfo 获取用户的基本信息
  getUaerInfo();

  var layer = layui.layer;

  // 点击退出按钮,实现退出功能
  $("#btnLogout").on("click", function () {
    // 提示用户是否退出
    layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function (
      index
    ) {
      //do something
      // console.log("ok");
      // 1. 清空本地存储的 token
      localStorage.removeItem("token");
      // 2. 从新跳转到登陆页面
      window.location.href = "/login.html";
      layer.close(index);
    });
  });
});

// 获取用户的基本信息
function getUaerInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers 就是请求不头配置项
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data);
    },
  });
}

// 渲染用户的头像
function renderAvatar(user) {
  // 1. 获取用户的昵称
  var name = user.nickname || user.username;
  //  2. 设置欢迎的文本
  $("#welcome").html("欢迎&nbsp&nbsp" + name);
  // 3. 用需渲染用户头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 3.2 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
