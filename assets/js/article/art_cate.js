$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 获取文章类别数据
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // if (res.status !== 0) {
                //   return layui.layer.msg(res.message);
                // }
                var htmlstr = template("tpl-table", res);
                $("tbody").html(htmlstr);
            },
        });
    }

    //
    var indexAdd = null;
    //为添加类别按钮绑定点击事件
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章类别",
            content: $("#dialog-add").html(),
        });
    });

    //
    // 通过代理的形式，为 from-add 表单绑定 submit 事件
    $("body").on("submit", "#from-add", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        //   发起ajax请求
        // $.ajax({
        //     method: "POST",
        //     url: "/my/article/addcates",
        //     data: $(this).serialize(),
        //     success: function (res) {
        //         // console.log(res);
        //         if (res.status !== 0) {
        //             return layer.msg(res.message);
        //         }
        //         initArtCateList();

        //         layer.msg(res.message);
        //         // 根据索引，关闭对应的弹出层
        //         layer.close(indexAdd);
        //     },
        // });
        var url = "/my/article/addcates";
        var data = $(this).serialize();
        Initiation(url, data, indexAdd);
    });

    //
    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $("body").on("submit", "#from-edit", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        // console.log($(this).serialize());
        // $.ajax({
        //     method: "POST",
        //     url: "/my/article/updatecate",
        //     data: $(this).serialize(),
        //     success: function (res) {
        //         console.log(res);
        //         if (res.status !== 0) {
        //             return layer.msg(res.message);
        //         }
        //         initArtCateList();
        //         layer.msg(res.message);
        //         // 根据索引，关闭对应的弹出层
        //         layer.close(indexEdit);
        //     },
        // });
        var url = "/my/article/updatecate";
        var data = $(this).serialize();
        Initiation(url, data, indexEdit);
    });

    //
    // 封装增加文章,修改文章函数
    function Initiation(url, data, index) {
        $.ajax({
            method: "POST",
            url: url,
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                // 根据索引，关闭对应的弹出层
                layer.close(index);
            },
        });
    }

    //
    // 通过代理的形式，为编辑按钮绑定 点击事件
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });

        // 发起氢气获取相应分类的数据
        var id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val("from-edit", res.data);
            },
        });
    });

    //
    // 通过代理的形式，为删除按钮绑定 点击事件
    $("tbody").on("click", ".btn-delete", function () {
        // var id = $(this).siblings(".btn-edit").attr("data-id");
        var id = $(this).attr("data-id");
        // 提示用户是否要删除
        layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (
            index
        ) {
            //do something
            // 发起ajax请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    layer.close(index);
                    initArtCateList();
                },
            });
        });
    });
});
