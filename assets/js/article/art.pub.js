$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor();

    //
    initCate();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 调用模板引擎,渲染分类的下拉菜单
                var htmlstr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlstr);
                // 一定要记得调用 form.render() 方法
                form.render();
            },
        });
    }

    //
    // 1. 初始化图片裁剪器
    var $image = $("#image");

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    //
    // 为选择封面的按钮,绑定点击事件函数
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    });

    // 监听 coverFile 的 change 事件, 获取用户选择的文件列表
    $("#coverFile").on("change", function (e) {
        // console.log(e);
        // console.log(e.target.files);
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg("请选择要上传的图片！");
        }
        // 根据选择的文件, 创建一个 对应的 URL 路径
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域从新设置新的图片
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    //
    // 定义发布文章的状态
    var art_state = "已发布";

    // 为存为草稿按钮, 绑定点击事件处理函数
    $("#btnSave2").on("click", function () {
        art_state = "草稿";
    });

    //
    // 为表单绑定 submit 提交事件
    $("#form_pub").on("submit", function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于 form 表单, 快速创建 formData 对象
        var fd = new FormData($(this)[0]);
        // 3. 将文章发布的状态, 存到 fd 中
        fd.append("state", art_state);
        // 4. 将封面裁剪过后的图片,输出为一个文件对象
        $image
            .cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象存储到 fd 中
                fd.append("cover_img", blob);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            });
    });

    //
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意: 如果想服务器提交的是 FormData 格式的数据,
            // 必须添加以下连个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 发布文章成功后,调整到列表页面
                location.href = "/article/art_list.html";
            },
        });
    }
});
