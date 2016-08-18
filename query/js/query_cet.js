if(self!=top)window.open(self.location,'_top');

var result = new Object();

result.publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMFBIs6VqyyxytxiY6sHocThOKoJWNSY8BuKXMilvKUsdagv44zFJvMXnV2E7ZbdjpNS1IY/uRoJzwUuob3sme0CAwEAAQ==";

document.write("<div style=display:none><iframe name=_ajax onload=try{t=contentWindow.location.host}catch(e){return}p=parentNode;if(t&&p.style.display)p.innerHTML=p.innerHTML></iframe>"+
				"<form name='form1' method='POST' action='https://www.baidu.com' target='_ajax'><input type='hidden' name='tp' value='' /><input type='hidden' name='czn' value='' /><input type='hidden' name='v' value='' /></form></div>");

var tp;
window.onload = function() {
	
//	if(!checkTime()){
//		alert("对不起，请于2016年8月19日上午9：00再来查询！");
//		location.href = "/";
//	}
	
	if(get("sn"))
		tp = 1;
	else
		tp = 2;
	var c,sn,z,n;
	
	get("submitButton").onclick=function(){
		//		document.domain = "neea.edu.cn";
		
		z = get("zkzh").value.toUpperCase();
		
		n = get("name").value;
		var v = get("verify").value.toLowerCase();
		
		//_hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
		//_hmt.push(['_trackEvent', 'query', 'click', c+'-q', 1]);
		
		var obj = get("all");
		if(obj.hasChildNodes()){
			obj.removeChild(obj.childNodes[0]);
		}
		if(checkParm(get("zkzh"),true)&&checkParm(get("name"),false)){
			if(!v||trim(v).length<1){
				var va = document.createTextNode("请输入验证码！");
				obj.appendChild(va);
				get("verify").focus();
				return;
			}
		}else{
			return;
		}
		var ksxmObj = getKsxm(z);
		if(ksxmObj==null){
			alert("“准考证号”输入格式不正确！");
			return;
		}else{
			c = ksxmObj.code;
			sn = ksxmObj.name;
		}
		
		var shadeDivStr = "<div id='shadeDiv' class='shadeDiv'><div class='lodcenter'><img src='../cet201606/query/images/loading.gif'><br><br>正在查询成绩，请耐心等待...</div></div>";
		var shadeDiv = document.createElement("div");
		shadeDiv.setAttribute("id","shadeDiv");
		shadeDiv.setAttribute("class","shadeDiv");
		shadeDiv.innerHTML = "<div class='lodcenter'><img src='../cet201606/query/images/loading.gif'><br><br>正在查询成绩，请耐心等待...</div>";
		get("Body").appendChild(shadeDiv);
		var crypt = new JSEncrypt();
		crypt.setPublicKey(result.publicKey);
		var czn = encodeURIComponent(crypt.encrypt((c+","+z+","+n).replace(/\s/g, "")));
		form1.action = "http://cache.neea.edu.cn/query.html";
		form1.tp.value = tp;
		form1.czn.value = czn;
		form1.v.value = v;
		form1.submit();
		get("submitButton").disabled = true;
		get("submitButton").className = "disabled";
		//alert(result.getCook);
		
	};
	
	result.callback = function(data){
		get("Body").removeChild(get("shadeDiv"));
		eval("data="+data);
		if(data.s||data.s==0){
			if(tp==1){
				get("sn").innerHTML = "2016年6月"+sn;
				get("z").innerHTML = z;
				get("x").innerHTML = data.x;
				get("n").innerHTML = data.n;
				get("s").innerHTML = data.s;
				if(data.t&&data.t=="1"){
					get("tipss").style.display = "block";
				}
				if(("'CET4','CET6'").indexOf(c)!=-1){
					get("l").innerHTML = data.l;
					get("r").innerHTML = data.r;
					get("w").innerHTML = data.w;
				}else{
					result.hideCet46();
				}
			}else{
				get("set-sn").innerHTML = "2016年5月"+(z.charAt(0)=="F"?"全国大学英语四级考试口语考试（CET-SET4）":"全国大学英语六级考试口语考试（CET-SET6）");
				get("z").innerHTML = z;
				get("n").innerHTML = data.n;
				get("s").innerHTML = data.s;
				
				get("report0").style.display = "none";
				get("report1").style.display = "none";
				
				var flag = data.f;
				if(flag&&flag=="1"){
					get("reportName1").innerHTML = data.n;
					if(data.sf&&data.cs&&data.dz){
						get("reportAddr").innerHTML = "，邮寄地址为<span class='weight'>"+data.sf+data.cs+data.dz+"</span>";
					}
					if(data.e&&data.e.replace(/\s/g, "")){
						get("reportEms1").innerHTML = "您的成绩单已寄出，EMS单号：<span class='weight'>"+data.e+"</span>";
					}
					get("report1").style.display = "block";
				}else{
					get("reportName0").innerHTML = data.n;
					get("report0").style.display = "block";
				}
			}
			
			get("query_param").style.display = "none";
			get("query_result").style.display = "block";
			_hmt.push(['_trackEvent', 'querySuccess', 'result', c+'-qs', 1]);
		}else{
			if(data.error){
				alert(data.error);
				if(data.error.indexOf("验证码")>0){
					result.verifys();
				}
			}else{
				alert("您查询的结果为空！");
			}
		}
		get("submitButton").disabled = false;
		get("submitButton").className = "";
	};
	
	get("button").onclick=function(){
		goon();
	};
	
	document.onkeydown = function()
	{
        if(event.keyCode == 13) {
        	get("submitButton").click();
        	return false;
        }
	};
};

function get(id){return document.getElementById(id);}

//更换验证码
result.verifys=function()
{
	get("verifysDiv").style.display = "block";
  var imgs=get('img_verifys');
  imgs.src="http://searchtest1.neea.edu.cn/Imgs.do?act=verify&amp;t=0.8841180045674784";
  imgs.style.visibility = "visible";
  imgs.src=imgs.src.replace(/=[.\d]+/,'='+Math.random());
  get("verify").value='';
  get("verify").focus();
};

result.getCook = function(name, value) {
    name += "=";
    var a = document.cookie.split("; ");
    for (var i = 0; i < a.length; i++) if (a[i].indexOf(name) == 0) return decodeURIComponent(a[i].substring(name.length));
    return value;
};

result.hideCet46=function(){get("scoreT").style.display="none";};

function trim(str)
{
    for(var  i  =  0  ;  i<str.length  &&  str.charAt(i)==" "  ;  i++  )  ;
    for(var  j  =str.length;  j>0  &&  str.charAt(j-1)==" "  ;  j--)  ;
    if(i>j)  return  "";  
    return  str.substring(i,j);
}

function checkString(s) {
	if(!s)
		return true;
	//var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
    return pattern.test(s);
}

function checkSpace(s) {
	var f = true;
	if(s.indexOf(" ")==-1){
		f = false;
	}
	return f;
}

function checkNum(z){
	if(!z)
		return true;
    var pattern = new RegExp("^[0-9]*$");
    return pattern.test(z);
}

function checkZkzh(z){
	var f = false;
	if(tp==1){
		if(!checkNum(z))f = true;
		else{
			var t = z.charAt(9);
			if(isNaN(t))f = true;
		}
	}else{
		if(!checkNum(z.substring(1)))f = true;
		else{
			var t = z.charAt(0);
			if(t!="F"&&t!="S")f = true;
		}
	}
	return f;
}

/**
 * 验证查询条件
 * t    this
 * f 是否准考证号
 */
function checkParm(t,f){
	var alt = t.alt;
	var name = t.name;
	var val = t.value;
	//alert(name+":"+val);
	val = trim(val);
	var errorName = name+"error";
	var errorObj = get(errorName);
	if(errorObj){
		if(errorObj.hasChildNodes())errorObj.removeChild(errorObj.childNodes[0]);
	}else{
		return false;
	}
	var err = "";
	if(val){
		if(checkString(val))err = "“"+alt+"”格式错误";
	}else err = "“"+alt+"”不能为空";
	if(!err){
		if(f==true){
			t.value = val;
			val = val.toUpperCase();
			if(checkSpace(val))err = "“"+alt+"”中间不能有空格";
			else if(val.length!=15)err = "请输入15位“"+alt+"”";
			else if(checkZkzh(val))err = "“"+alt+"”输入格式不正确！";
		}
	}
	if(err){
		errorObj.appendChild(document.createTextNode(err));
		return false;
	}
	return true;
}

function getKsxm(z){
	if(tp==1){
		var t = z.charAt(9);
		if(!isNaN(t))return dq.rdsub[t];
	}else{
		var t = z.charAt(0);
		if(t=="F"||t=="S")return dq.rdsub[0];
	}
	return null;
}

//function checkTime(){
//	var t = new Date("2016/08/19 08:30:00").getTime();
//	var d=new Date().getTime();
//	if(d>=t){
//		return true;
//	}
//	return false;
//}

function goon(){
	get("zkzh").value = "";
	get("name").value = "";
	get("verify").value = "";
	get("verifysDiv").style.display = "none";
	get("query_result").style.display = "none";
	get("query_param").style.display = "block";
	var divs = document.getElementsByTagName("div");
	for (var i=0; i< divs.length; i++ )
	{
		if (divs[i].className == "tipss") {
			divs[i].style.display = "none";
		}
	}
}
