/**
 * Created by Administrator on 2016/11/21 0021.
 */
//获取页面头部
GetHtml("../common/common.txt","#header");
CheckBrower();
//页面加载自动执行
download();
SystemRedMsg();
var documentId,year;
$(function(){
    if(Request.documentId==undefined||Request.documentId=='undefined'){
        var doc = JSON.parse(store.get("documentarticle"));
        documentId = doc.documentId;
        selectcheckarticle(doc);
    }else{
        documentId = Request.documentId;
        year = Request.year;
        selectcheckarticle(null);
    }
})
//点击标题时预览
function selectcheckarticle(doc){
    if(doc==null){
        $(".fn_title").text("后台预览页面");
        $(".fn_year").text(year);
        $(".fn_download_num").text("0");
        $(".fn_press").text("人教社");
    }else{
        $(".fn_title").text(doc.title);
        $(".fn_year").text(doc.year);
        if(doc.pressName==null){
            $(".fn_press_li").hide();
        }else{
            $(".fn_press").text(doc.pressName);
        }
        $(".fn_download_num").text(doc.downNum);
    }
    $.ajax({
        type:"POST",
        data:{
            "documentId":documentId
        },
        url:"../../web/common/baiducheckarticle",
        dataType:"json",
        success:function(data){
            checkarticle(data.retData);
        }
    })
}

//文档预览的主方法
function checkarticle(data){
    var option = {
        docId: data.docId,
        token: data.token,
        host:  data.host,
        width: 930, //文档容器宽度
        pn: 0,  //定位到第几页，可选
        ready: function (handler) {  // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
            handler.setFontSize(1);
            handler.setBackgroundColor('#000');
            handler.setFontColor('#fff');
        },
        flip: function (data) {    // 翻页时回调函数, 可供客户进行统计等
            console.log(data.pn);
        },
        fontSize:'big',
        toolbarConf: {
            page: true, //上下翻页箭头图标
            pagenum: true, //几分之几页
            full: true, //是否显示全屏图标,点击后全屏
            copy: false, //是否可以复制文档内容
            position: 'center',// 设置 toolbar中翻页和放大图标的位置(值有left/center)
        } //文档顶部工具条配置对象,必选
    };
    new Document('reader', option);
}


//下载需要的方法
function download(){
	$(".download_span").unbind("click")
	$(".download_span").click(function(){
        //判断该用户是否认证
        console.log(JSON.parse(store.get("documentarticle")))
        NewDownload(JSON.parse(store.get("documentarticle")));
    });
}
//执行下载
function doDownload(obj){
    //下载次数加1
    var id = obj.resourseId;
    var bo = queryordownload(id,"download");
    if(!bo){
        alert("数据异常");
        return;
    }
    var flag = document.referrer.indexOf("realquestion.html");
    var type;
    if(Number(flag)>=0){
        type = "realQuestionDownload";
    }else{
        type = "practiceQuestionDownlaod";
    }
    //执行下载
    $.ajax({
        type:"POST",
        data:{
            "objectKey":obj.objectKey,
            "bucketName":obj.bucketName
        },
        url:"../../web/common/baidudownload",
        success:function(data){
            var a = document.createElement("a");
	        //a.setAttribute("href",data);
	        //a.setAttribute("target","_blank");
	        //a.setAttribute("download","下载");
	        //a.setAttribute("id","download");
		    window.open(data)
            //a.click();
        }
    });
}
Opration()
function Opration(){
    $('#GoIdentifyClose').on('click',function(){
        $('#NoIdentify').fadeOut(150);
    });
    $('#GoPayClose').on('click',function(){
        $('#p_LessMoney').fadeOut(150);
    });
    // $('#e_DownBox').on('click',function(){
    //     NewDownload()
    // });
}
//新下载
function NewDownload(obj) {
    console.log(obj)
    var SubData={};
    SubData.resourceId=obj.resourseId;
    SubData.type=obj.downloadtype;
    SubData.resType='5';
    $.ajax({
        "type": "post",
        "url": "/web/teacher/download/obtain",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var Codenum = parseInt(AllData);
            if(Codenum==1){
                doDownload(obj);
            }
            else if(Codenum==2){
                $('#p_LessMoney').fadeIn(200);
            }else {
                $('#NoIdentify').fadeIn(200);
            }
        }
    });
}
//下载或阅览时相应的字段加1
function queryordownload(id,str){
    var bo = true;
    $.ajax({
        type:"POST",
        data:{
            "id":id,
            "flag":str
        },
        url:"/web/common/queryordownnum",
        success:function(data){
            if(data.retCode!="0000"){
                bo = false;
            }
        }
    });
    return bo;
}
//下载扣除相应的金币
function practiceQuestionDownlaod(id,type){
    $.ajax({
        type:"POST",
        data:{
            "id":id,
            "type":type
        },
        url:"/web/teacher/examquestion/downlaodingAndReduceGold",
        success:function(data){
            console.log(data);
        }
    })
}