jQuery(function($){
	$("#registerForm").initRegisterForm();
});


jQuery.fn.extend({
	initRegisterForm: function(){
		if(this.length <= 0){return this;}
		var main = this; var form = this.get(0);
		this.extend({
			verifycode: jQuery("#verifycode").next("a").andSelf().extend({
				refresh: function(){
					if(!this.baseimage){
						this.baseimage = this.attr("src");
					}
					this.attr("src", this.baseimage + "?t=" + (new Date()).valueOf());
				}
			}).bind({
				click: function(e){
					main.verifycode.refresh();
					return false;
				}
			}),
			checkItem: function(elem){
				if(elem.id !== "password" && elem.id !== "repassword"){
					elem.value = jQuery.trim(elem.value);
				}
				if(elem.value.length <= 0){
					return false;
				}
				switch(elem.id){
					case "email":
						return elem.value.match(/^(\w)+(\.\w+)*@(\w)+((\.(net|com|cn|org|gov|info|name|me|tw|int|edu|us|jp|uk|cc)){1,3})$/);
						break;
					case "password":
						return true;
						break;
					case "repassword":
						return elem.value == form["password"].value;
						break;
					case "username":
						return elem.value.length <= 16;
						break;
					default:
						break;
				}
				return true;
			},
			check: function(){
				var ret = true;
				main.input.each(function(i){
					if(!main.checkItem(this)){
						this.style.borderColor = "#ff0000";
						ret = false;
					}
				});
				return ret;
			},
			
			input: this.find("div.opt input").bind({
				blur: function(e){
					if(!main.checkItem(this)){
						this.style.borderColor = "#ff0000";
					}
					if(this.id == "username"){
						jQuery.get('forum.php?mod=ajax&inajax=yes&infloat=register&handlekey=register&ajaxmenu=1&action=checkusername&username=' + encodeURIComponent(this.value), function(json){
							var msg = jQuery(json).find("root").text();
							if(msg == 'succeed'){
								msg = '<img src="static/image/common/check_right.gif" width="16" height="16" />';
							}else{
								msg = '<em style="color:red">' + msg + '</em>';
							}
							jQuery("#namemsg").html(msg);
						});
					}
					if(this.id == "email"){
						jQuery.get('forum.php?mod=ajax&inajax=yes&infloat=register&handlekey=register&ajaxmenu=1&action=checkemail&email=' + this.value, function(json){
							
							var msg = jQuery(json).find("root").text();
							if(msg == 'succeed'){
								msg = '<img src="static/image/common/check_right.gif" width="16" height="16" />';
							}else{
								msg = '<em style="color:red">' + msg + '</em>';
							}
							jQuery("#emailmsg").html(msg);
						});	
					}
					if(this.id == "repassword"){
						if(this.value != ''){
							if(jQuery("#password").val() != this.value){
								var msg = '<em style="color:red">两次输入的密码不一致</em>';
							}else{
								var msg = '<img src="static/image/common/check_right.gif" width="16" height="16" />';
							}
							jQuery("#repwdmsg").html(msg);
						}
					}
				},
				focus: function(e){
					this.style.borderColor = "#C4C4C4 #C7C7C7 #E2E2E2 #C3C3C3";
				}
			})
		}).bind({
			submit: function(e){
				if(!main.check()){
					return false;
				}
				if(!form["agreement"].checked){
					alert("您必须同意用户注册协议才能注册！");
					return false;
				}
				return true;
			}
		});
		return this;
	}
});