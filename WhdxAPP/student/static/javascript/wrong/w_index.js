/********************************************错题本详情页By徐扬**********************************************/
//获取题目
GetUserSub();
function GetUserSub(){
    var SubData={};
    SubData.uuid=Request.uuid;
    SubData.materialId=Request.materialId;
    SubData.questionId=Request.questionId;
    SubData.groupCode=Request.groupCode
    $.ajax({
        "type": "post",
        "url": "/api/student/center/getWrongQuestion",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatAnalysis(AllData);
                CreatAnalysisQue(AllData);
                intMathJax();//公式
            }
        }
    });
};
//创建分析
function CreatAnalysis(data){
    data=data[0].questions[0];
    var analysis=data.analysis;
    if(analysis!=null&&analysis!=''){
        $('#w_AnalysisMain').html(analysis)
    }else {
        console.log(0)
        $('#w_AnalysisMain').html('暂无解析').css('color','#999')
    }
};
//选项排列方式
function IsOptionShow(A,B,C,D){
    var Option='';
    if(A.indexOf('oneline')!=-1){
        Option=A+B+C+D;
    }else if(A.indexOf('twoline')!=-1){
        B=B+'</br>';
        Option=A+B+C+D;
    }else {
        Option=A+B+C+D;
    }
    return Option;
};
//创建试题
var $AnalysisQue='';
var $Question='';
//正常题型
function NormalQue(data){
    data=data[0].questions[0];
    $Question='';
    var IsType=data.questionTypeId;
    $('#Edit').attr('data-questionId',data.questionId);
    if(data.optionA!=null){var $A=data.optionA; }else {var $A='';}
    if(data.optionB!=null){var $B=data.optionB;}else {var $B='';}
    if(data.optionC!=null){var $C=data.optionC;}else {var $C='';}
    if(data.optionD!=null){var $D=data.optionD;}else {var $D='';}
    //客观题
    var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30||IsType==34);
    var content=data.questionTitle.replace(/\】/g,'');
    content=content.replace(/题干/g,'');
    content=content.replace(/\【/g,'');
    content=content.replace(/\【题干】/g,'');
    $Question+=content;//题干
    if(IsSelect){
        $Question+=IsOptionShow($A,$B,$C,$D);
    }
    $('#w_Question').html($Question);
    for(var i=0;i<data.labels.length;i++){
        //答案
        if(data.labels[i].questionType=='03'||data.labels[i].questionType==03){
            var answer=data.labels[i].content.replace(/\】/g,'');
            answer=answer.replace(/答案/g,'');
            answer=answer.replace(/\【/g,'');
            answer=answer.replace(/\【答案】/g,'');
            $AnalysisQue+='<div class="m_Answer0 ">';
            $AnalysisQue+='<div class="fc6f Is100 ml02">【答案】</div>';
            $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>'; ;
            $AnalysisQue+='</div>';
        }
        //解析
        if(data.labels[i].questionType=='05'||data.labels[i].questionType==05){
            var Analysis=data.labels[i].content.replace(/\】/g,'');
            Analysis=Analysis.replace(/解析/g,'');
            Analysis=Analysis.replace(/\【/g,'');
            Analysis=Analysis.replace(/\【解析】/g,'');
            $AnalysisQue+='<div class="m_Analysis">';
            $AnalysisQue+='<p class="fc58 ml02">【解析】</p>';
            $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>'; ;
            $AnalysisQue+='</div>';
        }
        $('#w_Anlysis').html($AnalysisQue);
    };
    Edit();
};
//组合题
function GroupQue(obj){
    $AnalysisQue='';
    var  Que=obj[0].questions;
    $('#Edit').attr('data-questionId',obj[0].questionId);
    if(Que==null){return false;}
    var Content=obj[0].content;//材料题目
    $Question+='<p>'+Content+'</p>';
    for(var j=0;j<Que.length;j++){
        var  data=Que[j];
        var IsType=data.questionTypeId;
        var $A,$B,$C,$D='';
        if(data.optionA!=null){ $A=data.optionA; }else { $A='';}
        if(data.optionB!=null){ $B=data.optionB;}else { $B='';}
        if(data.optionC!=null){ $C=data.optionC;}else { $C='';}
        if(data.optionD!=null){ $D=data.optionD;}else { $D='';}
        //客观题
        var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30||IsType==34);
        var content=data.questionTitle.replace(/\】/g,'');
        content=content.replace(/题干/g,'');
        content=content.replace(/\【/g,'');
        content=content.replace(/\【题干】/g,'');
        $Question+=content;//题干
        var wrongQuestion = data.wrongQuestion;
        var $wrongQuestion = wrongQuestion ? "<img src='../../static/image/wrong/wrong.png' style='height: 1em' />" : "<img src='../../static/image/wrong/right.png' style='height: 1em' />";
        if(IsSelect){
            $Question+=IsOptionShow($A,$B,$C,$D)+$wrongQuestion+"<br />";;
        }

        for(var i=0;i<data.labels.length;i++){
            //答案
            if(data.labels[i].questionType=='03'||data.labels[i].questionType==03){
                var answer=data.labels[i].content.replace(/\】/g,'');
                answer=answer.replace(/答案/g,'');
                answer=answer.replace(/\【/g,'');
                answer=answer.replace(/\【答案】/g,'');
                $Question+='<div class="m_Answer0 ">';
                $AnalysisQue+='<div class="fc6f Is100 ml02">【答案】</div>';
                $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>'; ;
                $Question+='</div>';
            }
            //解析
            if(data.labels[i].questionType=='05'||data.labels[i].questionType==05){
                var Analysis=data.labels[i].content.replace(/\】/g,'');
                Analysis=Analysis.replace(/解析/g,'');
                Analysis=Analysis.replace(/\【/g,'');
                Analysis=Analysis.replace(/\【解析】/g,'');
                $Question+='<div class="m_Analysis">';
                $AnalysisQue+='<p class="fc58 ml02">【解析】</p>';
                $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>'; ;
                $Question+='</div>';
            }
        };
        $('.w_Question').html($Question);
        $('#w_Anlysis').css('display','none');
    }
    var isSplite=obj[0].isSplite;//组合题可拆分情况
    if(isSplite == "0"){//不可拆分
        for(var i=0;i<obj[0].labels.length;i++){
            if(obj[0].labels[i].questionType=='03'||obj[0].labels[i].questionType==03){
                var answer=obj[0].labels[i].content.replace(/\】/g,'');
                answer=answer.replace(/答案/g,'');
                answer=answer.replace(/\【/g,'');
                answer=answer.replace(/\【答案】/g,'');
                $AnalysisQue+='<div class="m_Answer0 ">';
                $AnalysisQue+='<div class="fc6f Is100 ml02">【答案】</div>';
                $AnalysisQue+='<div class="fc33 Is100">'+answer+'</div>'; ;
                $AnalysisQue+='</div>';
            }
            //解析
            if(obj[0].labels[i].questionType=='05'||obj[0].labels[i].questionType==05){
                var Analysis=obj[0].labels[i].content.replace(/\】/g,'');
                Analysis=Analysis.replace(/解析/g,'');
                Analysis=Analysis.replace(/\【/g,'');
                Analysis=Analysis.replace(/\【解析】/g,'');
                $AnalysisQue+='<div class="m_Analysis">';
                $AnalysisQue+='<p class="fc58 ml02">【解析】</p>';
                $AnalysisQue+='<div class="fc33 Is100">'+Analysis+'</div>'; ;
                $AnalysisQue+='</div>';
            }
        }
        $('#w_Anlysis').html($AnalysisQue);
        $('#w_Anlysis').css('display','block');
    }
    Edit();
};
//创建分析
function CreatAnalysisQue(data){
    //组合题
    if(data[0].groupCode!=''&&data[0].groupCode!=null){
        GroupQue(data)
    }else{
        NormalQue(data);
    }
    GetComCss();
};
//获取公共样式
function GetComCss(){
    $.ajax({
        "type": "post",
        "url": "/api/common/commonStyle",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('head').append(AllData);
            }
        }
    });
};
//点击编辑
function Edit(){
    $('#Edit').on('click',function(){
        javascript:bc.setQuestionId($(this).attr('data-questionId'),$('#w_AnalysisMain').html());
    });
}

