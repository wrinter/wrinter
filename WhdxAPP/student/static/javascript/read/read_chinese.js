/********************************************语文阅读By徐扬**********************************************/
//获取题目
GetUserPkInfo();
function GetUserPkInfo(){
    var SubData={};
    SubData.id=Request.id;
    $.ajax({
        "type": "post",
        "url": "/api/student/homework/report/getUserPaperReport",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatArtBox(AllData.article)
                CreatCar(AllData.resPaperUser)
                CreatRequireTxt(AllData.resPaperUser)
            }
        }
    });
};
function CreatArtBox(data){
    if(data==null){return false;}
    if(data.subtitle == null || data.subtitle == ""){
    }else{
        $(".auother").text("作者: "+data.subtitle);
    }
    $('#a_ArtTitle').html(data.title);
    var content=data.content;
    content=content.replace(/\&lt;/g,'<');
    content=content.replace(/\&amp;#39;/g,'´');
    content=content.replace(/\&gt;/g,'>');
    content=content.replace(/\&quot;/g,'"');
    content=content.replace(/\&amp;quot;/g,'"');
    content=content.replace(/\&amp;nbsp;/g, "");
    $('#c_ArticleContent').html(content);
};
//创建打卡
function CreatCar(data){
    if(data==null){return false;}
    var status=data.status;
    var useTime=data.useTime;
    if(status==3){
        $('.r_Car').html('未读');
    }else {
        $('.r_Car').text('已读 (用时：'+ToComTime(useTime)+')');
    }
}
//转换时间
function ToTime(value) {
    var Second = parseInt(value);// 秒
    var Minute = 0;// 分
    var result;
    if(Second<60){
        result =Second+'秒';//秒
    }else {
        result=Math.round(Second/60)+'分钟'
    }
    return result;
};
/*分享*/
$('.c_share').on('click',function(){
    javascript:bc.share();
})
$('.c_back').click(function(){
    javascript:bc.back();
});
//创建教师要求
//创建教师要求
function CreatRequireTxt(data){
    var requireMent=data.requireMent;
    if(requireMent==null||requireMent==''){
        requireMent='暂无';
        $('#r_Require').css('display','none')
    }
    else {
        $('#r_Require').css('display','')
        $('#r_RequireTxt').html(requireMent);
        RequireOp()
    }
}
function RequireOp(){

    $('#r_Require').on('click',function(){
        if($(this).hasClass('Has')){
            $('#r_RequireBox').animate({right:'-10rem'},300)
            $(this).attr('src','../../static/image/common/require.png').removeClass('Has');
        }else {
            $('#r_RequireBox').animate({right:'1rem'},500)
            $(this).attr('src','../../static/image/common/kolaico.png').addClass('Has');
        }

    })
}

