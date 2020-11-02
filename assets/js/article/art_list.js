$(function () {
    let layer = layui.layer;
    let laypage = layui.laypage;
    //
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        const y = dt.getFullYear();
        const m = padzero(dt.getMonth() + 1);
        const d = padzero(dt.getDate());

        const hh = padzero(dt.getHours());
        const mm = padzero(dt.getMinutes());
        const ss = padzero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };

    // 定义补零的函数
    function padzero(n) {
        return n > 9 ? n : "0" + n;
    }

    //
    // 定义一个查询的参数对象,将来请求数据的时候,
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值. 默认请求第一页的数据
        pagesize: 2, // 眉页显示几条数据, 默认每页显示2条
        cate_id: "", // 文章分类的 id
        state: "", // 文章的发布状态
    };

    //
    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res.data);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎渲染数据
                // console.log(res);
                let htmlstr = template("tpl-table", res);
                $("tbody").html(htmlstr);
                // layer.msg(res.message);
                // 调用渲染分页的方法
                renderPage(res.total);
            },
        });
    }

    // 初始化所有分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败！");
                }
                // console.log(res);
                // 调用模板引擎渲染分类的可选项
                let htmlstr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlstr);
                // 通知layui 从新渲染表单区域的UI结构
                layui.form.render();
            },
        });
    }

    // 为筛选表单绑定 submit 事件
    $("#formSearch").submit(function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染页面
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用   laypage.render() 方法来渲染分页结构
        laypage.render({
            elem: "pageBox", // 分页容器的 Id
            count: total, // 中数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认选中的分页

            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候, 触发 jump 回调
            // 1. 点击页码的时候, 会触发 jump 回调
            // 2. 只要调用了 laypage.renger() 方法, 就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值, 来判断是通过哪种方式, 触发 jump 回调
                // 如果 first 这个值为 true, 证明是方式2 触发的
                // 否则就是方式1 触发的
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值, 赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数. 赋值到 q 这个查询参数的 pagesize s属性中
                q.pagesize = obj.limit;
                if (!first) {
                    // 根据最新的 q 获取对应的数据列表,并渲染表格
                    initTable();
                }
            },
        });
    }

    // 通过代理的形式, 为删除按钮绑定点击事件处理函数
    $("tbody").on("click", ".btnDelete", function () {
        // 获取删除按钮的个数
        let len = $(".btnDelete").length;
        // console.log(len);
        // 获取到文章的ID
        const id = $(this).attr("data-id");
        // 询问用户是否要删除数据
        layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (
            index
        ) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 当数据删除完成之后, 需要判断当前这一页中, 是否还有剩余的数据
                    // 如果没有剩余的数据了, 则让页码值 -1 之后
                    // 再从新调用initTable 方法
                    if (len === 1) {
                        // 如果 len 的值 等于1, 证明删除完毕后,页面没有任何数据了
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                },
            });

            layer.close(index);
        });
    });
});
