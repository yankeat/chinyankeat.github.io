var accessToken = "bf7047a7e5334a84a4380da98f68331e";
var staging_accessToken = "38734e707aa64511858bd5773671d9bb";
var baseUrl = "https://api.api.ai/v1/";
var server = "production";
var sessionid = "";
var urlstring = 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json';

$(document).ready(function () {
    $("#input").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            send("",$("#input").val());
        }
    });

	// generate sessionid
	sessionid = makeid();
	
    $("#submit_input").on("click",function (event) {
        event.preventDefault();
        send("",$("#input").val());
    });
    $(document).on("click", ".wc-card-buttons li button", function () {
        send($(this).text(),$(this).val());
    });
    $(document).on("click", ".wc-quick-reply-buttons ul li button", function () {
        //alert("test button2");
        send($(this).text(),$(this).val());
    });
    $("#TopButton").on("click",function (event) {
        send("Chatbot in Training","Chatbot in Training");
    });

	hideQuickReplyBar();
	
	// capture all links if they appear in bot message
	$("body").on("click", "a", function(event) {
		var linkURL = $(this).text();
		if(linkURL.search("http")>=0) {
			event.preventDefault();
			$("wc-message-content").css("z-index", "3");
			$("#wc-popup-button-ok").attr('href', linkURL);
			$("#wc-popup-url").fadeIn(150);
		}
	});	
	$("button").on("click", function(event) {
		console.log("button clicked");
		var linkURL = $(this).text();
	});	
	
	activateCarousel();
	
	send("Let's Start", "Let's Start",0);


});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 22; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}



function setInput(text) {
    $("#input").val(text);
    send("",text);
}


function send(text, value,display=1) {

	if(text.length > 0 || value.length>0) {
		$(input).val('');
		$(".quick-reply-buttons").remove();
		
		hideQuickReplyBar();

		if (value.substring(0, 4) == 'http') {
			window.open(value, '_blank', '');
		} else {
			if(display==1) {
				$("#answer").append("<div class='wc-message-wrapper list'><div class='wc-message wc-message-from-me'><div class='wc-message-content'><span class='format-plain'>" + ((text != "") ? text : value) + "<span></div></div></div>");
				$("#answer").append(loading);

				scrollToBottom();
			} else {
				$("#answer").append(loading);				
			}

			$.ajax({
				type: "POST",
				async: true,
				url: baseUrl + "query?v=20170810",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + ((server == 'production') ? accessToken : staging_accessToken)
				},
				data: JSON.stringify({ query: value, lang: "en", sessionId: sessionid }),

				success: function (data) {
					$(".loading").remove();
					setResponse(JSON.stringify(data, undefined, 2));
					logResponse(JSON.stringify(data, undefined, 2));
				},
				error: function () {
					setResponse("Internal Server Error");
				}
			});
		}
	}
}


var x = '';
var iscard = 0;
var loading = '<div class="loading wc-loading-container"><img src="assets/img/typingstatus.png"><div class="wc-typing wc-loading-container-typing"></div></div>';

function wrap_cards(value) {
    var y = '';
	y += '<div class="wc-message-wrapper carousel">';
	y += '<img class="wc-message-from-bot-avatar" src="assets/img/digi-avatar.png"/>';
    y += '<div class="wc-message wc-message-from-bot">';
	y += '<div class="wc-message-content">';
	y += '<div>';
//    y += '<svg class="wc-message-callout"><path class="point-left" d="m0,6 l6 6 v-12 z"></path><path class="point-right" d="m6,6 l-6 6 v-12 z"></path></svg>';
    y += '<div class="wc-carousel">';
//	y += '<div>';
//    y += '<div class="wc-hscroll-outer">';
//    y += '<div class="wc-hscroll" style="margin-bottom: -17px;">';
    y += '<ul class="owl-carousel">';
    y +=  value;
    y += '</ul>';
//    y += '</div>';
//    y += '</div>';
//    y += '</div>';
    y += '</div>';
    y += '</div>';
    y += '</div>';
	y += '</div>';
	y += '</div>';

    $("#answer").append(y);
    iscard = 0;

	activateCarousel();
}

function setResponse(val) {
    x = '';
    var obj = JSON.parse(val);
    console.log(obj);

	var db_attributes = obj.result.fulfillment.speech;
    var db_attr = db_attributes.split(",");

    var answers = obj.result.fulfillment.messages;
    //$("#answer").append("<div><span class='user_say'>" + obj.result.resolvedQuery + "</span></div>");

    //console.log(obj.result.fulfillment.data);

    if(typeof obj.result.fulfillment.data != "undefined"){
        $("#answer").append("<div class='wc-message-wrapper list'><span class='bot_say >" + obj.result.fulfillment.data.facebook.text + "</span></div>");
        x = '';
        x += '<div class="wc-suggested-actions wc-hscroll-outer">';
        x += '<div class="wc-hscroll wc-quick-reply-buttons" style="margin-bottom: -17px;">';
        x += '<ul>';
        for (j = 0; j < obj.result.fulfillment.data.facebook.quick_replies.length; j++) {
            x += '<li><button value="' + obj.result.fulfillment.data.facebook.quick_replies[j].payload + '">' + obj.result.fulfillment.data.facebook.quick_replies[j].title + '</button></li>';
        }
        x += '</ul></div></div>';
        $("#answer").append(x);
		scrollToBottom();

        //console.log(x);
    } else {
        // console.log(answers);
		var answer_available=0;
        for (i = 0; i < answers.length; i++) {
            if (answers[i].type == 0) {
				answer_available = 1;
				var chatResponse = addTagToHttp(answers[i].speech);
                $("#answer").append("<div class='wc-message-wrapper list'><img class='wc-message-from-bot-avatar' src='assets/img/digi-avatar.png'><div class='wc-message wc-message-from-bot'><div class='wc-message-content'><svg class='wc-message-callout'><path class='point-left' d='m0,6 l6 6 v-12 z'></path><path class='point-right' d='m6,6 l-6 6 v-12 z'></path></svg><div><span class='format-markdown'><p><span>" + chatResponse + "</span></p></span></div></div></div>");
            } else if (answers[i].type == 1) {
				answer_available = 1;
                iscard = 1;
                x += '<li class="wc-carousel-item"><div class="wc-card hero">';
                if (answers[i].imageUrl != '') {
                    x += '<img src="' + answers[i].imageUrl + '">';
                }
                if (answers[i].title != '' && answers[i].title != undefined) {
                    x += '<h1>' + answers[i].title + '</h1>';
                }
                if (answers[i].subtitle != '' && answers[i].subtitle != undefined) {
                    x += "<p>" + answers[i].subtitle + "</p>";
                }
                if (answers[i].buttons.length > 0) {
                    x += '<ul class="wc-card-buttons">';
                    for (j = 0; j < answers[i].buttons.length; j++) {
                        x += '<li><button value="' + answers[i].buttons[j].postback + '">' + answers[i].buttons[j].text + '</button></li>';
                    }
                    x += '</ul>';
                }
                x += '</div></li>';
				
                if (i == answers.length - 1) {
                    console.log('no more message after cards');
                    wrap_cards(x);
                } else if (answers[i + 1].type != 1) {
                    console.log('got message after cards');
                    wrap_cards(x);
                }
            } else if (answers[i].type == 2) {
				answer_available = 1;
				var chatResponse = addTagToHttp(answers[i].title);
                $("#answer").append("<div class='wc-message-wrapper list'><img class='wc-message-from-bot-avatar' src='assets/img/digi-avatar.png'><div class='wc-message wc-message-from-bot'><div class='wc-message-content'><svg class='wc-message-callout'><path class='point-left' d='m0,6 l6 6 v-12 z'></path><path class='point-right' d='m6,6 l-6 6 v-12 z'></path></svg><div><span class='format-markdown'><p><span>" + chatResponse + "</span></p></span></div></div></div>");
			
			} else if (answers[i].type == 3) {
				answer_available = 1;
				var chatResponse = addTagToHttp(answers[i].title);
                $("#answer").append("<div class='wc-message-wrapper list'><img class='wc-message-from-bot-avatar' src='assets/img/digi-avatar.png'><div class='wc-message wc-message-from-bot'><div class='wc-message-content'><svg class='wc-message-callout'><path class='point-left' d='m0,6 l6 6 v-12 z'></path><path class='point-right' d='m6,6 l-6 6 v-12 z'></path></svg><div><span class='format-markdown'><p><span>" + chatResponse + "</span></p></span></div></div></div>");

			} else if (answers[i].type == 4) {
				answer_available = 1;
				var chatResponse = addTagToHttp(answers[i].payload.facebook.text);
                $("#answer").append("<div class='wc-message-wrapper list'><img class='wc-message-from-bot-avatar' src='assets/img/digi-avatar.png'><div class='wc-message wc-message-from-bot'><div class='wc-message-content'><svg class='wc-message-callout'><path class='point-left' d='m0,6 l6 6 v-12 z'></path><path class='point-right' d='m6,6 l-6 6 v-12 z'></path></svg><div><span class='format-markdown'><p><span>" + chatResponse + "</span></p></span></div></div></div>");
                $("#answer").append(x);
				
                y = '';
				y += '<div class="wc-hscroll-outer quick-reply-buttons">';
                y += '<div class="wc-hscroll wc-quick-reply-buttons" style="margin-bottom: -17px;">';
                y += '<ul class="owl-carousel2">';
                for (j = 0; j < answers[i].payload.facebook.quick_replies.length; j++) {
                    y += '<li><button value="' + answers[i].payload.facebook.quick_replies[j].payload + '">' + answers[i].payload.facebook.quick_replies[j].title + '</button></li>';
                }
                y += '</ul></div></div>';
				showQuickReplyBar();
                $("#wc-suggested-actions-id").append(y);
            } else {
				
            }
        }
		if(answer_available==0) {
			console.log('test' + obj.result.fulfillment.speech);
		}
    }

	scrollToBottom();
}

function logResponse(val) {
    var obj = JSON.parse(val);

	// log query
	command = {};
	command["command"] = "update_chat_log";
	command["auth_key"] = "a6hea2";
	command["chat_id"] = obj.sessionId;
	command["dialog_id"] = " ";
	command["dialog_state"] = " ";
	command["dialog_type"] = "Text In";
	command["dialog_input"] = " ";
	command["chat_log"] = obj.result.resolvedQuery;

	console.log("update_chat_log " + JSON.stringify(command));
	$.ajax({
		type: "POST",
		url: urlstring, data: { data: JSON.stringify(command) }, cache: false, async: true, timeout: 20000,
		success: function (data) {

		},
		error: function (data) {
		
		}
	});

	// log Response intent
	command = {};
	command["command"] = "update_chat_log";
	command["auth_key"] = "a6hea2";
	command["chat_id"] = obj.sessionId;
	command["dialog_id"] = " ";
	command["dialog_state"] = " ";
	command["dialog_type"] = "Intent";
	command["dialog_input"] = " ";
	command["chat_log"] = obj.result.metadata.intentName;

	$.ajax({
		type: "POST",
		url: urlstring, data: { data: JSON.stringify(command) }, cache: false, async: true, timeout: 20000,
		success: function (data) {

		},
		error: function (data) {
		
		}
	});

    var answers = obj.result.fulfillment.messages;
    if(typeof obj.result.fulfillment.data != "undefined"){
    } else {
		var answer_available=0;
        for (i = 0; i < answers.length; i++) {
            if (answers[i].type == 0) {
				command = {};
				command["command"] = "update_chat_log";
				command["auth_key"] = "a6hea2";
				command["chat_id"] = obj.sessionId;
				command["dialog_id"] = " ";
				command["dialog_state"] = " ";
				command["dialog_type"] = "Text Out";
				command["dialog_input"] = " ";
				command["chat_log"] = answers[i].speech;

				$.ajax({
					type: "POST",
					url: urlstring, data: { data: JSON.stringify(command) }, cache: false, async: true, timeout: 20000,
					success: function (data) {

					},
					error: function (data) {
					
					}
				});
			} else if (answers[i].type == 4) {
				command = {};
				command["command"] = "update_chat_log";
				command["auth_key"] = "a6hea2";
				command["chat_id"] = obj.sessionId;
				command["dialog_id"] = " ";
				command["dialog_state"] = " ";
				command["dialog_type"] = "Text Out";
				command["dialog_input"] = " ";
				command["chat_log"] = answers[i].payload.facebook.text;

				$.ajax({
					type: "POST",
					url: urlstring, data: { data: JSON.stringify(command) }, cache: false, async: true, timeout: 20000,
					success: function (data) {

					},
					error: function (data) {
					
					}
				});
			}
		}
	}
				
}


function addTagToHttp(val) {

	// to break the string below into 3 parts
	// "OK. I have looked up and here are the roaming rates at http://new.digi.com.my/roaming/international-roaming-rates#/plan=prepaid&country=Taiwan"
	// Part1 = "OK. I have looked up and here are the roaming rates at "
	// Part2 = "http://new.digi.com.my/roaming/international-roaming-rates#/plan=prepaid&country=Taiwan"
	// Part3 = anything after the http
	// 
	// Function will replace part2 with <a href="http://www...">http://www...</a>, and return the string Part1+Part2+Part3

	var newString = val;
	var Part2Location = val.search("http");
	
	if(Part2Location>=0) {
		var Part1 = val.substr(0,Part2Location);
		var Part2_3 = val.substr(Part2Location);
		var httpLength = Part2_3.search(" ");
		var Part2 = '';
		var Part3 = '';
		if(httpLength>=0) {
			Part2 = Part2_3.substr(0,httpLength);
			Part3 = Part2_3.substr(httpLength);
		} else {
			Part2 = Part2_3;
		}
		newString = Part1+'<a href="'+Part2+'">'+Part2+'</a>'+Part3;
	}
	return newString;

}

function scrollToBottom() {
	var objDiv = document.getElementById("message-groups-id");
	objDiv.scrollTop = objDiv.scrollHeight-40;
console.log("bottom is now "+objDiv.scrollTop);
}

function hideQuickReplyBar() {
	$("#message-groups-id").css("transform", "translateY(0px)");
	$("#wc-suggested-actions-id").css("height", "0px");
}

function showQuickReplyBar() {
	$("#message-groups-id").css("transform", "translateY(-40px)");
	$("#wc-suggested-actions-id").css("height", "40px");
}

function activateCarousel() {
	$(".owl-carousel").owlCarousel({
		nav: true,
		dots: false,
		loop:false,
		lazyLoad: true,
		autoWidth:true,
		navText: [ 
			'<button class="scroll prev"><svg><path d="M 16.5 22 L 19 19.5 L 13.5 14 L 19 8.5 L 16.5 6 L 8.5 14 L 16.5 22 Z"></path></svg></button>', 
			'<button class="scroll next"><svg><path d="M 12.5 22 L 10 19.5 L 15.5 14 L 10 8.5 L 12.5 6 L 20.5 14 L 12.5 22 Z"></path></svg></button>' ],

	});
	$(".owl-carousel2").owlCarousel({
		nav: true,
		loop:false,
		autoWidth:true,
	});
}
