/**
 * Created by lgr on 2016/12/5.
 */
$(document).ready(function(){
    var uuid = Request.uuid;//获取栏目id
    var $page = 1;
    var $limit = 15;
    n_greatlist = $(".n_greatlist").clone(true);
    $(".n_date").html("");
    function getTest(){
        var uuid = Request.uuid;//获取栏目id
        if($page <=1){
            $(".n_date").html("");
            $limit = 15;
        }
        var parmas = {};
        parmas.pageNum = $page;
        parmas.pageSize = $limit;
        //parmas.uuid =  "f3dde4429bd51e1c04bf34bb240cbb2b";
        if(uuid){
            parmas.uuid =  uuid;
        }else{
            parmas.uuid =  "3e6ea89858397f7c46ed3dab0c5dc5a7";
        }
        sessionStorage.setItem("uuid",JSON.stringify(parmas.uuid))//存取uuid
        $.ajax({
            type : "post",
            url : "/api/teacher/paper/report/list",
            data : parmas,
            dataType : "json",
            success : function(data){
                if(data.retCode == "0000"){
                    //判斷數據
                    //if(data.retData.list.length <= 0){
                    //    javascript:bc.emptyPage();//空白页
                    //    return false;
                    //}
                    var n_date = $(".n_date");
                    for(var i = 0;i<data.retData.list.length;i++){
                            var Dtrue = data.retData.list[i];
                            var date = Dtrue.assignTime;
                            var newclone = n_greatlist.clone(true);
                            var obj = Dtrue.obj;
                            var type = Dtrue.type;
                            var name = Dtrue.name;
                            var average = Dtrue.average;
                            var assignTime = Dtrue.assignTime;
                            var id = Dtrue.id;
                            newclone.find(".n_greatwho").text(obj)
                            newclone.find(".n_daytime").text(assignTime)
                            function csubstr(str,len){
                                if(str.length>10){
                                    return str.substring(0,len)+"...";
                                }else{
                                    return str;
                                }
                            }
                            //if(name.length>10){
                            //    name = name.substring(0,10)+"...";
                            //}
                            newclone.find(".n_subject").text(csubstr(name,10));//限制题目字数
                            if(type.substring(0,1) == "3"){
                                newclone.find(".n_classimg").attr("src","../../static/image/notice/prevetest.png")
                            }
                            if(type.substring(0,1) == "4"){
                                newclone.find(".n_classimg").attr("src","../../static/image/notice/proport.png")
                            }
                            if (type.substring(0,1) == "1" || type.substring(0,1) == "2" ){
                                newclone.find(".n_classimg").hide();
                            }
                            newclone.attr({"type":type,"id":id,"average":average});
                            //查看详情
                            newclone.on("click",function(){
                                var type = $(this).attr("type");
                                var id = $(this).attr("id");
                                var average = $(this).attr("average");
                                var subjectname = newclone.find(".n_subject").text();

                                sessionStorage.setItem("paperAssignId",JSON.stringify(id));
                                sessionStorage.setItem("type",JSON.stringify(type));
                                if(typeof(average) == "undefined"){
                                    var average = "";
                                    sessionStorage.setItem("average",JSON.stringify(average));//平均分
                                }else{
                                    sessionStorage.setItem("average",JSON.stringify(average));//平均分
                                }
                                sessionStorage.setItem("subjectname",JSON.stringify(subjectname));
                                if(type.substring(0,1) == "4"){
                                    window.location.href = "../Chinese/Chinese_notice.html";
                                }
                                if(type.substring(0,1) == "1"){
                                    window.location.href = "notice_details.html";
                                }
                                if(type.substring(0,1) == "3"){
                                    window.location.href = "Preview_notice.html";
                                }
                                if(type.substring(0,1) == "2"){
                                    window.location.href = "notice_testdetails.html?type="+type+'&uuid='+Request.uuid+'&ThispaperAssignId='+id;
                                }
                            })
                            newclone.appendTo(n_date);
                    }
                    $page = $page + 1;
                }else{
                    //dropload.resetload(false);
                    //javascript:bc.ret(data.retCode, data.retMsg);
                    javascript:bc.emptyPage();//空白页
                }
            },
            error : function(e){
                //dropload.resetload(false);
                console.log(e)
            }
        })
    }
    //上拉加载和下拉刷新
    Refresh();
    refresher.init({
        id:"wrapper",//<------------------------------------------------------------------------------------┐
        pullDownAction:Refresh,
        pullUpAction:Load
    });
    function Refresh() {
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el =document.querySelector("#wrapper ul");
            //这里写你的刷新代码
            document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="<img style='width:0.1rem' src='../../static/image/notice/ok.png'/>刷新成功";
            $page = 1;;
            getTest()
            setTimeout(function () {
                wrapper.refresh();
                document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="";
            },1000);//模拟qq下拉刷新显示成功效果
            /****remember to refresh after  action completed！ ---yourId.refresh(); ----| ****/
        }, 1000);
    }
    function Load() {
        setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el =document.querySelector("#wrapper ul");
            //console.log($page++);
            //$page++;
            getTest()
            wrapper.refresh();/****remember to refresh after action completed！！！   ---id.refresh(); --- ****/
        },2000);
    }
})

