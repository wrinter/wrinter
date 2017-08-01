/**
 * Created by wcd on 2016/12/15.
 */
window.onload=function(){
    var getPaper=function(){};
    getPaper.prototype={
        constructor:getPaper,//确定原型链
        init:function(){
            this.assign_paper();
            this.getCss();
        },
        getUrl:function(){
            var url =window.location.href;
            var u = url.split("?");
            if(typeof(u[1]) == "string"){
                u= u[1].replace(/uuid=/,"");
                return u ;
            }
        },
        getCss : function(){
            $.ajax({
                type:"post",
                url:"/api/common/commonStyle",
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if(data.retCode == "0000"){
                        var retData = data.retData;
                        //console.log(retData);
                        //retData.appendTo("head");
                        $("head").append(retData);
                    }
                },
                error:function(e){
                    console.log(e)
                }
            })
        },
        assign_paper:function(){
            var param={};
            var that=this;
            var uuid=that.getUrl().split("&")[0];
            if(uuid){
                param.uuid=uuid;
                param.knowledgeId=that.getUrl().split("&")[1].split("=")[1];
                param.categoryId=that.getUrl().split("&")[2].split("=")[1];
            }else{
                param.uuid="135c04ebf9cfd93a62440651f5acda43";
                param.knowledgeId="c2d45acec3f546199f67aabfd83473a8";
                param.categoryId="95bb3984827241e3b6d9efcb76b8d966";
            }
            $.ajax({
                "type": "post",
                "url": "/api/teacher/paper/assign/paperinfo",
                "dataType":'json',
                "data": param,
                success:function(data){
                    console.log(data)
                    var li="";
                    var questionLines=data.retData.questionLines;
                    //将题型写入html中
                    for(var k in questionLines){
                        if(questionLines[k].questionGroup==[]){
                            li+="<div class='typeName'>"+questionLines[k].lineName+"</div>";
                        }else{
                            if(questionLines[k].scoreDef!=null&&questionLines[k].scoreDef!="") {
                                li += "<div class='_typeName'>" + questionLines[k].lineName + questionLines[k].scoreDef + "</div>";
                            }else{
                                li+="<div class='_typeName'>"+questionLines[k].lineName+"</div>";
                            }
                        }
                        var group = questionLines[k].questionGroup;
                        for(var _k in questionLines[k].questionGroup){
                            var groupCode = group[_k].groupCode;
                            var questions = group[_k].questions;
                            if(groupCode!=""&&groupCode!=null){
                                var isSplite = group[_k].isSplite;
                                if(isSplite=="0"){
                                    if(group[_k].content!=null&&group[_k].content!=""){
                                        li += "<div class='content'><label>" + group[_k].lnOrder + "、</label>"
                                            + group[_k].content.replace("【","").replace("材料","").replace("】","") + "</div>";
                                    }else{
                                        li += "<div class='content'><label>" + group[_k].lnOrder + "、</label>"+"</div>";
                                    }
                                    for(var key in questions){
                                        li+="<div class='content'>";
                                        li+="<a href='assignWork_detail.html?id="+questions[key].questionId+"&uuid="+uuid+"&knowledgeId="+that.getUrl().split("&")[1].split("=")[1]+"&categoryId="+that.getUrl().split("&")[2].split("=")[1]+"'>";
                                        li+="<div class='paperDetailTitle'>"+"<label>"+questionLines[k].questionGroup[_k].lnOrder+"、</label>"+questions[key].questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ")+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionA+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionB+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionC+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionD+"</div>";
                                        li+="</a>";
                                        li+="</div>";
                                    }
                                }else{
                                    li += "<div class='paperDetailTitle'>"+ group[_k].content.replace("【材料】","")+ "</div>";

                                    for(var key in questions){
                                        li+="<div class='content'>";
                                        li+="<a href='assignWork_detail.html?id="+questions[key].questionId+"&uuid="+uuid+"&knowledgeId="+that.getUrl().split("&")[1].split("=")[1]+"&categoryId="+that.getUrl().split("&")[2].split("=")[1]+"'>";
                                        li+="<div class='paperDetailTitle'>"+"<label>"+questionLines[k].questionGroup[_k].lnOrder+"、</label>"+questions[key].questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ")+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionA+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionB+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionC+"</div>";
                                        li+="<div class='choose'>"+questionLines[k].questionGroup[_k].questions[key].optionD+"</div>";
                                        li+="</a>";
                                        li+="</div>";
                                    }

                                }
                            }else{
                                for(var key in questions){
                                    li+="<div class='content'>";
                                    li+="<a href='assignWork_detail.html?id="+questions[key].questionId+"&uuid="+uuid+"&knowledgeId="+that.getUrl().split("&")[1].split("=")[1]+"&categoryId="+that.getUrl().split("&")[2].split("=")[1]+"'>";
                                    li+="<div class='paperDetailTitle'>"+"<label>"+questionLines[k].questionGroup[_k].lnOrder+"、</label>"+group[_k].questions[key].questionTitle.replace("【题干】","").replace("<img","<img style='max-width:100%;' ")+"</div>";
                                    //   if(questionLines[k].questionGroup[_k].questions[key].questionTypeId=="01"){
                                    li+="<div class='choose'>"+questions[key].optionA+"</div>";
                                    li+="<div class='choose'>"+questions[key].optionB+"</div>";
                                    li+="<div class='choose'>"+questions[key].optionC+"</div>";
                                    li+="<div class='choose'>"+questions[key].optionD+"</div>";
                                    //    }
                                    li+="</a>";
                                    li+="</div>";
                                }

                            }


                        }
                    }

                    $(".a_paper").html(li.replace(/null/g,""));
                    intMathJax();//公式
                }
            });
        }
    }
    $(function() {
        new getPaper().init();//实例化
    })
}