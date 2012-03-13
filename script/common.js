/**
 * @author Oren.Chen
 */
jQuery.noConflict();
jQuery(function($){
	 
	$("div.live-box h2").initHomeLive("div.live-box-list ul");  //排行榜
	$("div.cooperImageList").initColScrollGroup();				// 一组组的循环
	$("#cooperlist").cooperScroll($("#cooperlistitems"), false );	// 合作伙伴循环 一个个的循环
	$("ul.ctrls").videoListChange();			// 3.一组循环
	$("div.netShare").initNetShare();//分享
	$(".mouseover").initMouseOver();
	$(".joinlist-info").initMarquee(35, 1, ".joinlist-list", $(".joinlist-list li"), true);  // 类marquee循环
	
	$("ul.msg-opts").checkSelector("div.play-infolist", 'current');		// selector
	$("ul.play-control").initSelector("div.play-list-b", 'fc');			// selector & scroll
	
	
});

jQuery.fn.extend({
	initSlideShow: function(selecter, interval){
		var main = this;
		main.extend({
			current: null,
			canAutoScroll: false,
			ctrlWarper: jQuery(selecter),
			btn: jQuery(selecter).find("a").each(function(i){
				this.Num = i;
			}).bind({
				mouseover: function(e){
					main.go(this.Num);
				},
				click: function(e){
					return false;
				}
			}),
			slide: null,
			go: function(i){
				var tmp = this.btn.get(i);
				if(this.current == tmp){return false;}
				this.btn.removeClass("current");
				this.btn.eq(i).addClass("current");
				this.slide.group = i; this.slide.goScroll(main.slide.countCurrentGroup());
				main.current = tmp;
			},
			goNext: function(){
				var count = this.btn.length;
				var next = this.current.Num + 1;
				if(next >= count){
					next = 0;
				}
				this.go(next);
			},
			goPre: function(){
				var count = this.btn.length;
				var pre = this.current.Num - 1;
				if(pre < 0){
					pre = count - 1;
				}
				this.go(pre);
			},
			initInterval: function(time){
				this.canAutoScroll = true;
				this.bind({
					mouseenter: function(e){
						main.canAutoScroll = false;
					},
					mouseleave: function(e){
						main.canAutoScroll = true;
					}
				});
				this.btn.bind({
					mouseenter: function(e){
						main.canAutoScroll = false;
					},
					mouseleave: function(e){
						main.canAutoScroll = true;
					}
				});
				setInterval(function(){
					if(main.canAutoScroll){
						main.goNext();
					}
				}, time);
			},
			initSelf: function(){
				this.slide = this.colScrollGroup(this.attr("itemWidth"), 1, "ul", "li", "null");
				this.slide.animatetype = null;
				this.slide.time = 800;
				main.go(0);
				
				var t = parseInt(interval);
				if(t !== NaN && t > 0){
					this.initInterval(t * 1000);
				}
			}
		});
		this.initSelf();
		return this;
	}
});

jQuery.fn.extend({
	initMouseOver: function(){
		this.each(function(i){
			jQuery(this).hover(function(e){
				jQuery(this).removeClass("hidesub");
			}, function(e){
				jQuery(this).addClass("hidesub");
			});
		});
	},
	/**
	 * 分享
	 */
	initNetShare: function(){
		this.find("a").each(function(i){
			this.href = this.href + window.location.href;
		});
		return this;
	},
	/**
	 * 评论
	 */
	initCommentSubmit: function(){
		if(this.length <= 0){return this;}
		var main = this;
		this.extend({
			commentList: jQuery(this.attr("rel")),
			submiting: false,
			dosubmit: function(){
				var elem = main.content.get(0);
				if(elem.value == elem.defaultValue || elem.value.length < 6){
					alert("评论内容不能少于6个字符！");
					main.content.focus();
					return false;
				}
				if(this.submiting){
					return false;
				}
				this.submiting = true;
				jQuery.getJSON(main.attr("action"), main.serialize(), function(json){
					main.submiting = false;
					if(json.isSucceed){
						var html = "<dl><dt><a href=\"#\"><img src=\"common/assets/vi_peop.jpg\"></a></dt><dd>我  刚刚</dd><dd><span>"+main.content.val()+"</span></dd></dl>";
						main.commentList.length > 0 && main.commentList.prepend(html);
						main.content.val("");
					}else{
						alert(json.msg ? json.msg : "发布评论失败！");
					}
				});
			},
			btn: this.find(":submit").bind({
				click: function(e){
					main.dosubmit();
					return false;
				}
			}),
			content: this.find("textarea").bind({
				blur: function(e){
					this.value = jQuery.trim(this.value);
					if(this.value.length <= 0){
						this.value = this.defaultValue;
						this.style.color = "#9C9C9C";
					}
				},
				focus: function(e){
					if(this.value == this.defaultValue){
						this.value = "";
						this.style.color = "#000";
					}
				}
			}),
			initForm: function(){
				this.get(0).reset();
			}
		}).bind({
			submit: function(e){
				main.dosubmit();return false;
			}
		}).initForm();
		
		return this;
	},
	  
	initHomeLiveUl: function(){
		var main = this;
		this.extend({
			current:null
		});
		this.find("li").bind({
			mouseover: function(e){
				if(this != main.current){
					if(main.current){
						main.current.removeClass("current");
					}
					main.current = jQuery(this);
					main.current.addClass("current");
				}
			}
		}).eq(0).mouseover();
		return this;
	},
	initHomeLive: function(subSelecter){
		var main = this.hide();
		this.extend({
			children: jQuery(subSelecter).hide(),
			current: null,
			choosed: 1
		});
		
		this.each(function(i){
			this.Num = i;
			jQuery(this).find("a[rel]").bind({
				click: function(e){
					if(this.rel !== main.current){
						main.eq(main.choosed).hide();
						main.children.eq(main.choosed).hide();
						
						main.eq(this.Num).show();
						main.children.eq(this.Num).show();
						
						main.choosed = this.Num;
						main.current = this.rel;
					}
					return false;
				}
			}).each(function(j){
				this.Num = j;
				if(i == 0 && j == 0){
					main.current == this.rel;
				}
			})
		});
		main.eq(1).show();
		main.children.eq(1).show();
		
		this.children.initHomeLiveUl();
		
		return this;
	},
	initColScrollGroup: function(){
		this.each(function(i){
			$this = jQuery(this);
			$this.colScrollGroup($this.attr("itemWidth"), $this.attr("groupSize"), "ul", "li", "null");
		})
		return this;
	},
	colScrollGroup: function(itemWidth, groupSize, wrapSelector, itemSelector, nullSuffix){
		var main = this.extend({
			//当前所在组
			group: 0,
			//总共的组数
			groupCount: 0,
			//步进宽度
			step: itemWidth * groupSize,
			//内包装项
			wrap: this.find(wrapSelector),
			//所有项目
			items: this.find(itemSelector),
			//正在执行动画
			animating: false,
			//左右控制按钮
			controls: this.find("acronym").find("a").bind({
				click: function(e){
					//if(this.className != this.defaultClass || main.animating){return false;}
					if(this.className != this.defaultClass){return false;}
					switch(this.Num){
						case 0: 
							main.scrollToPrev(this);
							return false;
						case 1: 
							main.scrollToNext(this);
							return false;
						default: return false;
					}
				}
			}).each(function(i){
				this.Num = i;
				this.defaultClass = this.className;
			}),
			//初始化时没有数据
			nullInit: function(){
				this.controls.each(function(i){
					main.hiddenControl(this);
				});
			},
			//隐藏控制项
			hiddenControl: function(elem){
				if(elem){
					if(!nullSuffix){
						jQuery(elem).hide();
					}else{
						elem.className = elem.defaultClass.replace(/(^\s*)|(\s*$)/g, "") + nullSuffix;
					}
				}
			},
			//隐藏控制项
			showControl: function(elem){
				if(elem){
					if(!nullSuffix){
						jQuery(elem).show();
					}else{
						elem.className = elem.defaultClass;
					}
				}
			},
			//向前一组滚动
			scrollToPrev: function(elem){
				this.group--;
				this.goScroll(this.countCurrentGroup());
			},
			//向后一组滚动
			scrollToNext: function(elem){
				this.group++;
				this.goScroll(this.countCurrentGroup());
			},
			//计算当前组的距离
			countCurrentGroup: function(){
				if(this.group > 0){
					this.showControl(this.controls.get(0));
				}else{
					this.group = 0;	
					this.hiddenControl(this.controls.get(0));
				}
				if(this.group < this.groupCount - 1){
					this.showControl(this.controls.get(1));
				}else{
					this.group = this.groupCount - 1;
					this.hiddenControl(this.controls.get(1));
				}
				return this.group * this.step;
			},
			//初始化自己
			initSelf: function(){
				//如果项为空，或者小于等于每组个数，隐藏前后导航按钮，同时不初始化任何值
				if(this.items.length == 0 || this.items.length <= groupSize){this.nullInit();return;}
				this.groupCount = Math.ceil(this.items.length / groupSize);
				//设置内包装最大宽度，防止换行
				this.wrap.css({width: (this.groupCount * this.step) + "px"});
				this.countCurrentGroup();
			},
			animatetype: "easeInQuad",
			time: 500,
			goScroll: function(endLeft){
				main.animating = true;
				this.wrap.stop(true, true);
				this.wrap.animate({marginLeft: -endLeft + "px"}, main.time, main.animatetype, function(){
					main.animating = false;
				});
			}
		});
		this.initSelf();
    	return this;
	},
	cooperScroll: function(items, auto, interval){
			if( this.length < 0) { return this;}
			var main = this;
			this.extend({
				listitems: items,
				listitemsul: items.find('ul'),
				listitem: items.find('ul li'),
				ctrl: this.find('acronym a'),
				itemwidth: items.attr('itemwidth'),
				timer0: null,
				timer: null,
				iSpeed: 0,
				iNow: 0,
				auto: auto,	// 是否自动循环
				interval: interval,  // 多久自动循环一次
				startMove: function(iTarget){
						clearInterval(main.timer);
						main.timer = setInterval(function(){main.doMove(iTarget)},30);
					},
				doMove: function(iTarget){
						var itemsuld = main.listitemsul.get(0);
						
						main.iSpeed = (iTarget - itemsuld.offsetLeft)/2; 
						main.iSpeed = (main.iSpeed>0)?Math.ceil(main.iSpeed):Math.floor(main.iSpeed);
						itemsuld.style.left = itemsuld.offsetLeft + main.iSpeed + 'px';
						
					},
				toRun: function( oUl, oWrap, aLi){
						//console.log( Math.abs(parseInt(oUl.offsetLeft)));
						//console.log(oUl.offsetWidth-oWrap.width()-main.itemwidth);
							
						if(Math.abs(parseInt(oUl.offsetLeft)) > (oUl.offsetWidth-oWrap.width()-main.itemwidth)){
							oUl.style.left = (-main.itemwidth) + 'px';
							main.iNow=1;
						}
						main.iNow ++;
						main.startMove(-main.iNow*main.itemwidth);
					}
					
				});
			
			main.listitemsul.css({ 'width': main.listitem.length*main.listitem[0].offsetWidth*2});
			
			if(main.listitem.length*main.listitem[0].offsetWidth > main.listitems.get(0).offsetWidth){
					
					var html = main.listitemsul.html();
					main.listitemsul.html( html + html);
				
					var oLbtn = main.ctrl[0];
					var oRbtn = main.ctrl[1];
					var oUl = main.listitemsul.get(0);
					var aLi = main.listitem;
					jQuery(oLbtn).click( function(){
						main.toRun(oUl, main.listitems, aLi);
					});
					
					jQuery(oRbtn).click(
						function(){
							if(parseInt(oUl.offsetLeft)>=0){
								oUl.style.left = -(aLi.length)*main.itemwidth + 'px';
								main.iNow = aLi.length;
							}					
							main.iNow--;
							main.startMove(-main.iNow*main.itemwidth);
						}
					);
					
					if(main.auto == undefined ){
						main.auto = true;	
						main.interval = 3000;
					}
					
					// 自动循环
					if(main.auto && main.interval){
						main.timer0 = setInterval(function(){ main.toRun(oUl, main.listitems, aLi)}, main.interval);
						main.listitemsul.mouseover(function(){
							clearInterval(main.timer0);
						});
		
						main.listitemsul.mouseout(function(){
							main.timer0 = setInterval( function(){ main.toRun( oUl, main.listitems, aLi)}, main.interval);
						});
					}
	
		   }
		   else{
			 return this;   
		   }
	},
	/**
     * 初始化滚动栏
	 * @param {Integer} itemWidth 单个宽度或高度
	 * @param {Integer} groupSize 每组数目
	 * @param {String} wrapSelector 内包装项搜索表达
	 * @param {String} itemSelector 单个项搜索表达式
	 * @param {Boolean} isTop2bottom 是否上下滚动，默认左右滚动
     * @return JSoul
     */
    initMarquee: function(itemWidth, groupSize, wrapSelector, itemSelector, isTopBottom){
		var main = this;
		this.extend({
			//单组宽度
			totalWidth: 0,
			//内包装项
			wrap: jQuery(wrapSelector),
			//所有项目
			items: itemSelector,
			//滚动方式
			method: isTopBottom ? "marginTop" : "marginLeft",
			//初始化自己
			initSelf: function(){
				if(groupSize > this.items.length)return;
				this.totalWidth = itemWidth * this.items.length;
				this.wrap.after(this.wrap.get(0).cloneNode(true));
				this.bind({
					mouseover: function(e){
						main.clearTimeEvent();
					},
					mouseout: function(e){
						main.timeIntervarEvent(true);
					}
				});
				this.initTimeIntervarEvent(50, 1, "marqueeInterval").timeIntervarEvent(true);
			},
			start: 0,
			marqueeInterval: function(){
				if(this.start < this.totalWidth){
					this.start += this.speed;
				}else{
					this.start = 0;
				}
				this.wrap.css(this.method, (-this.start) + "px");
			}
		});
		this.initSelf();
		return this;
	}
	
});

jQuery.fn.extend({
	videoListChange: function(){
		var main = this;
		this.extend({
			itemWidth: 709,
			current: null,
			allList: jQuery("div.listall").extend({
				to: function(i){
					var px = - i * 709;
					this.stop(true, false);
					this.animate({marginLeft: px}, 800);
				}
			}),
			abtn: this.find("a").each(function(i){
				this.Num = i;
			}).bind({
				click: function(e){
					main.setCurrent(this);
					return false;
				}
			}),
			setCurrent: function(elem){
				if(main.current == elem){
					return false;
				}
				var pos = elem.Num * 37;
				main.css({backgroundPosition: "0 -" + pos + "px"});
				main.abtn.removeClass("current");
				elem.className = "current";
				main.current = elem;
				main.allList.to(elem.Num);
				return false;
			}
		});
		main.allList.css({width: (main.abtn.length * main.itemWidth) + "px"});
	}
});


jQuery.fn.extend({
		checkSelector: function(subSelecter, nclass){
			var main = this;
			this.extend({
				children: jQuery(subSelecter).hide(),
				current: null,
				choosed: 0,
				c: nclass
			});
			
			this.each(function(i){
				this.Num = i;
				jQuery(this).find("a[rel]").bind({
					click: function(e){
						if(this.rel !== main.current){
							// main.eq(main.choosed).hide();
							main.find('a').eq(main.choosed).removeClass();
							main.children.eq(main.choosed).hide();
							
							main.eq(this.Num).show();
							main.children.eq(this.Num).show();
							main.find('a').eq(this.Num).addClass(main.c);
							
							main.choosed = this.Num;
							main.current = this.rel;
							
							if(this.Num == 2){
								// 道具排行
								 var scroller  = new jsScroller(document.getElementById("play-cont"), 305, 235);
								 var scrollbar = new jsScrollbar (document.getElementById("play-scroll"), scroller, false);
							}else if(this.Num == 3){
								// 中奖名单
								 var scroller_re  = new jsScroller(document.getElementById("play-cont-reward"), 305, 235);
								 var scrollbar_re = new jsScrollbar (document.getElementById("play-scroll-reward"), scroller_re, false);
							}
							
						}
						
						return false;
					}
				}).each(function(j){
					this.Num = j;
					if(i == 0 && j == 0){
						main.current == this.rel;
					}
				})
			});
			main.eq(0).show();
			main.children.eq(0).show();
			
			return this;
		},
		
		initSelector: function(subSelecter, nclass){
		var main = this;
		this.extend({
			children: jQuery(subSelecter).hide(),
			current: null,
			choosed: 0,
			c: nclass
		});
		
		this.each(function(i){
			this.Num = i;
			jQuery(this).find("a[rel]").bind({
				click: function(e){
					if(this.rel !== main.current){
						// main.eq(main.choosed).hide();
						main.find('a').eq(main.choosed).removeClass();
						main.children.eq(main.choosed).hide();
						
						main.eq(this.Num).show();
						main.children.eq(this.Num).show();
						main.find('a').eq(this.Num).addClass(main.c);
						
						main.choosed = this.Num;
						main.current = this.rel;
					}
					  var scroller_loc  = new jsScroller(document.getElementById("play-cont-loc"), 305, 235);
  					  var scrollbar_loc = new jsScrollbar (document.getElementById("play-scroll-loc"), scroller_loc, false);
  
					return false;
				}
			}).each(function(j){
				this.Num = j;
				if(i == 0 && j == 0){
					main.current == this.rel;
				}
			})
		});
		main.eq(0).show();
		main.children.eq(0).show();
		
		return this;
	}
	
});

/**
 * jQuery原型扩展方法 [延时方法类型]
 */
jQuery.fn.extend({
	/**
	 * 初始化定时器事件
	 * @param {int} delay 延时毫秒
	 * @param {String} callback 回调方法名
	 * @return JSoul
	 */
	initTimeOutEvent:function(delay,callback){
		this.delay = delay;
		this.timeOutCallback = this[callback];
		return this;
	},
	/**
	 * 初始化计时器事件
	 * 
	 * 如果不存在回调方法名, 将调用系统默认计数器方法
	 * 必须实现 this.callback 每次要执行的方法
	 * 可选实现 this.endCallback 计时器结束时执行的方法
	 * 
	 * @param {int} interval 间隔毫秒
	 * @param {int} speed 执行速度
	 * @param {String} callbackName 回调方法名 
	 * @return JSoul
	 */
	initTimeIntervarEvent:function(interval,speed, callbackName){
		this.interval = interval;
		this.speed = speed;
		this.timeIntervarCallback = callbackName ? this[callbackName] : this.defaultInterval;
		return this;
	},
	/**
	 * 定时器事件
	 * 
	 * @param {bool} 是否清除已有事件
	 * @return JSoul
	 */
	timeOutEvent:function(isClear){
		if(this.length == 0){
			return this;
		}
		if(isClear && this.timeEventTimeout){
			clearTimeout(this.timeEventTimeout);
		}
		var _obj = this;
		this.timeEventTimeout = setTimeout(function(){
			if(_obj.timeOutCallback){
				_obj.timeOutCallback();
			}else{
				clearTimeout(_obj.timeEventTimeout);
			}
		}, this.delay);
		return this;
	},
	/**
	 * 计时器事件
	 * @param {bool} 是否清除已有事件
	 * @return JSoul
	 */
	timeIntervarEvent:function(isClear){
		if(isClear && this.timeEventInterval){
			clearInterval(this.timeEventInterval);
		}
		var _obj = this;
		this.timeEventInterval = setInterval(function(){
			_obj.timeIntervarCallback();
		}, this.interval);
		return this;
	},
	/**
	 * 清除延时事件
	 * @return JSoul
	 */
	clearTimeEvent: function(){
		if(this.timeEventTimeout){clearTimeout(this.timeEventTimeout); this.timeEventTimeout=null;};
		if(this.timeEventInterval){clearInterval(this.timeEventInterval); this.timeEventInterval=null;};
		return this;
	},
	/**
	 * 默认处理定时器动作
	 */
	defaultInterval: function(){
		var reduce = this.end - this.start;
		if (reduce == 0) {
			clearInterval(this.timeEventInterval);
			this.start = this.end;
			if(this.endCallback){
				this.endCallback(this);
			}
		}else{
			var target = Math.ceil(Math.abs(reduce) * this.speed);
			this.start += (reduce < 0 ? -target : target);
		}
		this.callback ? this.callback(this) : this.clearTimeEvent();
		return this;
	},
	/**
	 * 倒计时动作
	 */
	downInterval: function(){
		if (this.start == 0) {
			this.clearTimeEvent();
			if(this.endCallback){
				this.endCallback();
			}
		}else{
			this.start -= 1;
		}
		this.callback ? this.callback(this) : this.clearTimeEvent();
		return this;
	},
	/**
	 * 鼠标移动边界延时处理
	 * @param {int} delay 延时毫秒
	 * @param {String} callback 回调方法名
	 * @return JSoul
	 */
	mouseEdge: function(delay, endCallback, startCallback){
		var _obj = this;
		this.initTimeOutEvent(delay, endCallback).bindEvent({
			onmouseover: function(e){
				_obj[startCallback]();
			},
			onmouseout: function(e){
				_obj.timeOutEvent();
			}
		});
		return this;
	}
});

jQuery.fn.extend({
	flash: function(swf, vars, params){
		var defaultparam = {
            id: "previewItem",
            src: swf,
            width: this.attr("offsetWidth") + "px",
            height: this.attr("offsetHeight") + "px",
            allowScriptAccess: "always",
            allowNetworking: "all",
            allowFullScreen: "true",
            wmode: "transparent",
            salign: "LT",
            scale: "noscale",
            quality: "autohigh",
            flashvars: ""
        };
        if (param) {for (k in defaultparam) {if (param[k]) {defaultparam[k] = param[k];}}}
        if (vars) {
            defaultparam.flashvars = vars;
        }
        if (!defaultparam.name) {
            defaultparam.name = defaultparam.id;
        }
        this.html(jQuery.buildFlash(defaultparam, "10,0,0,0"));
        return this.find("#" + defaultparam.id);
	}
});
jQuery.extend({
	/**
	 * 
	 */
	buildFlash: function(param, version){
		var params = [], embedArgm = [], objArgm = [];
		var flashKeyValue = function(list, key, value){list.push(key);list.push('=\'');list.push(value);list.push('\' ');};
		var flashParams = function(list, key, value){list.push('<param name=\'');list.push((key == "src") ? "movie" : key);list.push('\' value=\'');list.push(value);list.push('\' />');};
        for (k in param) {
            switch (k) {
                case "movie":
                    continue;
                    break;
                case "id":
                case "name":
                case "width":
                case "height":
                case "style":
                    flashKeyValue(objArgm, k, param[k]);
                    flashKeyValue(embedArgm, k, param[k]);
                    break;
                default:
                    flashParams(params, k, param[k]);
                    flashKeyValue(embedArgm, k, param[k]);
            }
        }
        if (version) {
            objArgm.push('codeBase=\'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=');
            objArgm.push(version);
            objArgm.push('\' ');
        }
        if (window.ActiveXObject) {
            return '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + objArgm.join('') + '>' + params.join('') + '</object>';
        } else {
            return '<embed ' + embedArgm.join('') + ' pluginspage="http://www.adobe.com/go/getflashplayer_cn" type="application/x-shockwave-flash"></embed>';
        }
	}
});

jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});