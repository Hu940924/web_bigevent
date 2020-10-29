// 注意: 每次调用 $.get(), 或 $.post() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中,可以会拿到我们给 ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 ajax 请求之前, 统一拼接请求的根路径

  options.url = "http://ajax.frontend.itheima.net" + options.url;
  //   console.log(options.url);

  // 统一设置为统一权限的接口, 设置headers 请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调函数
  options.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 1. 强制清除token
      localStorage.removeItem("token");
      // 2. 强制跳转页面
      location.href = "/login.html";
    }
  };
});
