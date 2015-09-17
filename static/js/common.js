$(document).ready(function(){
	window.instagram.init && instagram.init();
});
var instagram = {
	max_tag_id : null
	,moreFlag : false
	,init : function (){
		$("#formGroupInputLarge").keyup(function (e){
			if (e.keyCode == 13) instagram.search();
		})
		 
		instagram.search();
		
	    $(".scrollTop").click(function(event){            
	        event.preventDefault();
	        $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
		});
	}
	
	,search : function (){
		instagram.more(true);
	}
	
	,more : function (a){
		try
		{
			var appendUrl = '';
			if(!a && instagram.max_tag_id != null)
			{
				instagram.moreFlag = true;
				appendUrl = "&max_tag_id="+instagram.max_tag_id;
			}
			var searchData = $("#formGroupInputLarge").val();
			if(!searchData) searchData = 'test';
			
			searchData = encodeURIComponent(searchData);
			
			instagram.ajaxInsta('https://api.instagram.com/v1/tags/'+searchData+'/media/recent?access_token=4411227.6072586.79fdbbdeab11480c8adf92887b9c380a'+appendUrl, 'instagram.searchCallBack(jsonData);');
			
		}catch(e){window.console && console.log(e);}
	}
	
	,searchCallBack : function (jsonData){
		if(jsonData.meta != null && jsonData.meta.error_message != null)
		{
			alert(jsonData.meta.error_message);
			return false;
		}
		var obj = jsonData.data;
		var resultArra = new Array();
		if(obj != null)
		{
			var thisObj,img,text;
			for(var i=0; i<obj.length; i++)
			{
				thisObj = obj[i];

				if(thisObj['images'] == null || thisObj['caption'] == null || thisObj['images']['standard_resolution'] == null)
					continue;

				img = thisObj['images']['standard_resolution']['url'];
				text = thisObj['caption']['text'];
				text = c_replace(text,'"',"'");
				resultArra.push('<div class="col-lg-3 col-md-4 col-xs-6 thumb">');
				resultArra.push('	<a rel="group" class="thumbnail" href="'+img+'" title="'+text+'">');
				resultArra.push('		<img class="img-responsive" src="'+img+'" alt="">');
				resultArra.push('	</a>');
				resultArra.push('</div>');
			}
			instagram.max_tag_id = jsonData['pagination']['next_max_tag_id'];
		
			if(instagram.moreFlag)	$("#searchData").append(resultArra.join(''));
			else					$("#searchData").html(resultArra.join(''));
		
		    $("a[rel=group]").fancybox({
				'titlePosition'		: 'outside',
				'overlayColor'		: '#000',
				'overlayOpacity'	: 0.9
			});
		}
	}
	
	,ajaxInsta : function (ajaxUrl,callbackSuccessFunc){
		$.ajax({
	        type:"GET"
			,dataType: 'jsonp'
			,contentType: "text/html; charset=utf-8"
			,jsonpCallback: "jsonpcallback"
			,url: ajaxUrl
			,success: function(jsonData) 
			{
				try
				{
					eval(callbackSuccessFunc);
			
				} 
				catch(e) 
				{
					alert("error");
				}
			
			}
			, error: function(jqXHR, exception) 
			{
				instagram.ajaxError(jqXHR, exception);
			}
		});
	}
	
	,ajaxError : function(jqXHR, exception){
		if (jqXHR.status === 0) {
			alert('Not connect.\n Verify Network.');
		} else if (jqXHR.status == 404) {
			alert('Requested page not found. [404]');
		} else if (jqXHR.status == 500) {
			alert('Internal Server Error [500].');
		} else if (exception === 'parsererror') {
			alert('Requested JSON parse failed.');
		} else if (exception === 'timeout') {
			alert('Time out error.');
		} else if (exception === 'abort') {
			alert('Ajax request aborted.');
		} else {
			alert('Uncaught Error.\n' + jqXHR.responseText);
		}
	}
};
function c_replace(str,ori,ch){
	if(str.indexOf(ori) > -1)
		return str.split(ori).join(ch);
	else
		return str;
}
