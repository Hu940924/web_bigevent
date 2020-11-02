$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 加载文章分类
    initCate();

    // 获取用户选择的的文章类容
    initEdit();

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
                const htmlstr = template("selectAetCates", res);
                $("#art_cate").html(htmlstr);
                // 一定要记得调用 form.render() 方法
                form.render();
            },
        });
    }

    //
    // 获取用户选择的的文章类容
    function initEdit() {
        let id = localStorage.getItem("id");
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                let art = res.data;
                form.val("addForm", {
                    Id: art.Id,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content,
                });
                // 初始化富文本编辑器
                initEditor();
                // 1. 初始化图片裁剪器
                let $image = $("#image");
                $image.attr(
                    "src",
                    "http://ajax.frontend.itheima.net" + art.cover_img
                );
                // 2. 裁剪选项
                let options = {
                    aspectRatio: 400 / 280,
                    preview: ".img-preview",
                };
                // 3. 初始化裁剪区域
                $image.cropper(options);
            },
        });
    }

    //
    // 为选择封面的按钮,绑定点击事件函数
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    });

    // 监听 coverFile 的 change 事件, 获取用户选择的文件列表
    $("#coverFile").on("change", function (e) {
        const files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg("请选择要上传的图片！");
        }
        // 根据选择的文件, 创建一个 对应的 URL 路径
        const newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域从新设置新的图片
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper({
                aspectRatio: 400 / 280,
                preview: ".img-preview",
            }); // 重新初始化裁剪区域
    });

    //
    // 定义发布文章的状态
    let art_state = "已发布";

    // 为存为草稿按钮, 绑定点击事件处理函数
    $("#btnSave").on("click", function () {
        art_state = "草稿";
    });

    //
    // 为表单绑定 submit 提交事件
    $("#addEdit").on("submit", function (e) {
        //  阻止表单的默认提交行为
        e.preventDefault();
        //  将封面裁剪过后的图片,输出为一个文件对象
        $("#image")
            .cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 基于 form 表单, 快速创建 formData 对象
                let fd = new FormData($("#addEdit")[0]);
                // 将文章发布的状态, 存到 fd 中
                fd.append("state", art_state);
                // 将文件对象存储到 fd 中
                fd.append("cover_img", blob);
                //  发起 ajax 数据请求
                publishArticle(fd);
            });
    });

    //
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("编辑文章失败!");
                }
                layer.msg(res.message);
                // 发布文章成功后,调整到列表页面
                location.href = "/article/art_list.html";
            },
        });
    }
});
