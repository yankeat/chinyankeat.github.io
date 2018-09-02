var accessToken = "bf7047a7e5334a84a4380da98f68331e";
var staging_accessToken = "38734e707aa64511858bd5773671d9bb";
var baseUrl = "https://api.api.ai/v1/";
var server = "production";

var urlstring = 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json';
//var urlstring = 'http://35.201.218.38/action.php';

var insert_answer = 'webhook_admin_insert_answer';
var staging_insert_answer = 'webhook_staging_admin_insert_answer';

var insert_answer_multiple = 'webhook_admin_insert_answer_multiple';
var staging_insert_answer_multiple = 'webhook_staging_admin_insert_answer_multiple';

var update_answer = 'webhook_admin_update_answer';
var staging_update_answer = 'webhook_staging_admin_update_answer';

var delete_answer = 'webhook_admin_delete_answer';
var staging_delete_answer = 'webhook_staging_admin_delete_answer';

var update_answer_multiple = 'webhook_admin_update_answer_multiple';
var staging_update_answer_multiple = 'webhook_staging_admin_update_answer_multiple';

var get_answer = 'webhook_admin_get_answer';
var staging_get_answer = 'webhook_staging_admin_get_answer';

var get_answer_multiple = 'webhook_admin_get_answer_multiple';
var staging_get_answer_multiple = 'webhook_staging_admin_get_answer_multiple';

var get_idd_rates = 'webhook_get_idd_table';

var add_idd_rates = 'webhook_insert_idd133';
var edit_idd_rates = 'webhook_insert_idd133';
var delete_idd_rates = 'webhook_delete_idd133';

phpusername = 'digibot';
phppassword = 'akl23kl!1l2kj9od13lkjsd';


$(document).ready(function () {
    $("#input").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            send("",$("#input").val());
        }
    });
	
    $("#server").on("change", function () {
        server = $(this).val();
        //if (server == 'staging') {
        //    $("#add_single_answer").prop("disabled", true);
        //    $("#add_multiple_answer").prop("disabled", true);
        //} else {
        //    $("#add_single_answer").prop("disabled", false);
        //    $("#add_multiple_answer").prop("disabled", false);
        //}
        //console.log(server);
    });

    $("#submit").on("click",function (event) {
        event.preventDefault();
        send("",$("#input").val());
    });
    $(document).on("click", ".wc-card-buttons li button", function () {
        //alert("test button");
        send($(this).text(),$(this).val());
    });
    $(document).on("click", ".wc-quick-reply-buttons ul li button", function () {
        //alert("test button2");
        send($(this).text(),$(this).val());
    });
    $(document).on("click", ".view_multiple_answer", function () {
        get_answers_multiple($(this).text());
    });

    $(document).on("click", ".edit_single_answer", function () {
        var temp = $(this).parent().parent();
        $("#editSingleAnswer .modal-title .id").text($(temp).attr("rel"));
        $("#editSingleAnswer .modal-body #s_intent").val($(temp).find(".intent").text());
        $("#editSingleAnswer .modal-body #s_entity").val($(temp).find(".entity").text());
        $("#editSingleAnswer .modal-body #s_entity1").val($(temp).find(".entity1").text());
        $("#editSingleAnswer .modal-body #s_entity2").val($(temp).find(".entity2").text());
        $("#editSingleAnswer .modal-body #s_answer").val($(temp).find(".answer").text());
        $("#editSingleAnswer .modal-body #s_quick_reply").val($(temp).find(".quick_reply").text());
        $("#editSingleAnswer .modal-body #s_quick_reply_value").val($(temp).find(".quick_reply_value").text());
        $('#editSingleAnswer').modal('show');
    });

    $("#add_single_answer").on("click", function (event) {
        $('#addSingleAnswer').find("input").val("");
        $('#addSingleAnswer').find("textarea").val("");
        $('#addSingleAnswer').modal('show');
    });

    $("#submit_single_answer").on("click", function (event) {
        add_answers();
    });

    $("#save_single_answer").on("click", function (event) {
        update_answers();
    });

    $(document).on("click", ".delete_single_answer", function () {
        //console.log($(this).parent().parent().attr("rel"));
        delete_answers($(this).parent().parent().attr("rel"));
    });

    $("#add_multiple_answer").on("click", function (event) {
        $('#addMultipleAnswer').modal('show');
    });

    $("#submit_multiple_answer").on("click", function (event) {
        add_answers_multiple();
    });

    $("#save_multiple_answer").on("click", function (event) {
        update_answers_multiple();
    });

    $("#search_answer").on("click", function (event) {
        var intent = '';
        if ($("#check_intent").prop('checked') === true) {
            intent = $("#search_intent").val();
        }
        var topic = '';
        if ($("#check_topic").prop('checked') === true) {
            topic = $("#search_topic").val();
        }
        var subtopic = '';
        if ($("#check_subtopic").prop('checked') === true) {
            subtopic = $("#search_subtopic").val();
        }
        var details = '';
        if ($("#check_details").prop('checked') === true) {
            details = $("#search_details").val();
        }
        get_answers(intent, topic, subtopic, details);
    });

    $(document).on("click", ".edit_multiple_answer", function () {
        var temp = $(this).parent().parent();
        $("#editMultipleAnswer .modal-title .intent").text($(temp).find(".intent").text());
        $("#editMultipleAnswer .modal-title .id").text($(temp).attr("rel"));

        $("#editMultipleAnswer .modal-body #m_intent").val($(temp).find(".intent").text());
        $("#editMultipleAnswer .modal-body #m_type").val($(temp).find(".type").text());
        $("#editMultipleAnswer .modal-body #m_image").val($(temp).find(".image").text());
        $("#editMultipleAnswer .modal-body #m_answer").val($(temp).find(".answer").text());
        $("#editMultipleAnswer .modal-body #m_subtitle").val($(temp).find(".subtitle").text());
        $("#editMultipleAnswer .modal-body #m_quick_reply").val($(temp).find(".quick_reply").text());
        $("#editMultipleAnswer .modal-body #m_quick_reply_value").val($(temp).find(".quick_reply_value").text());

        $('#editMultipleAnswer').modal('show');
    });

    $(document).on("click", ".edit_idd_rates", function () {
        var temp = $(this).parent().parent();
        $("#editIddRates .modal-title .id").text($(temp).attr("rel"));
        $("#editIddRates .modal-body #s_user_type").val($(temp).find(".user_type").text());
        $("#editIddRates .modal-body #s_country_name_display").val($(temp).find(".country_name_display").text());
        $("#editIddRates .modal-body #s_country_name_url").val($(temp).find(".country_name_url").text());
        $("#editIddRates .modal-body #s_country_code").val($(temp).find(".country_code").text());
        $("#editIddRates .modal-body #s_rate_133_mobile").val($(temp).find(".rate_133_mobile").text());
        $("#editIddRates .modal-body #s_rate_133_fixed_line").val($(temp).find(".rate_133_fixed_line").text());
        $("#editIddRates .modal-body #s_voice_mobile").val($(temp).find(".rate_voice_mobile").text());
        $("#editIddRates .modal-body #s_voice_fixed").val($(temp).find(".rate_voice_fixed").text());
        $('#editIddRates').modal('show');
    });

    $("#add_idd_rates").on("click", function (event) {
        $('#addIddRates').find("input").val("");
        $('#addIddRates').find("textarea").val("");
        $('#addIddRates').modal('show');
    });

    $("#submit_idd_rates").on("click", function (event) {
        add_idd_rates_function();
		get_idd_rates_function();
    });

    $("#save_idd_rates").on("click", function (event) {
        update_idd_rates_function();
		get_idd_rates_function();
    });

    $(document).on("click", ".delete_idd_rate", function () {
        delete_idd_rate_function($(this).parent().parent().attr("rel"));
        $("#rates").empty();
		get_idd_rates_function();
    });


    $("#rec").click(function (event) {
        switchRecognition();
    });
});

var recognition;

function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function (event) {
        updateRec();
    };
    recognition.onresult = function (event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function () {
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
    $("#input").val(text);
    send("",text);
}

function updateRec() {
    $("#rec").text(recognition ? "Stop" : "Speak");
}

function send(text, value) {
    //alert("test");
    if (value.substring(0, 4) == 'http') {
        window.open(value, '_blank', '');
    } else {
        $("#answer").append("<div><span class='user_say'>" + ((text != "") ? text : value) + "</span></div>");
        $("#answer").append(loading);
        var objDiv = document.getElementById("answer");
        objDiv.scrollTop = objDiv.scrollHeight;

        $.ajax({
            type: "POST",
            async: true,
            url: baseUrl + "query?v=20170810",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + ((server == 'production') ? accessToken : staging_accessToken)
            },
            data: JSON.stringify({ query: value, lang: "en", sessionId: "botadmin" }),
            success: function (data) {
                $(".loading").remove();
                setResponse(JSON.stringify(data, undefined, 2));
            },
			error: function (data_php) {
				console.log("error [" + data_php + "]");
			}
        });
        //setResponse("Loading...");
    }
}

function add_answers() {
    command = {};
    command["command"] = ((server == 'production') ? insert_answer : staging_insert_answer);
	command["no_of_params"] = 7;
    command["param1"] = $("#addSingleAnswer .modal-body #add_s_intent").val();
    command["param2"] = $("#addSingleAnswer .modal-body #add_s_entity").val();
    command["param3"] = $("#addSingleAnswer .modal-body #add_s_entity1").val();
    command["param4"] = $("#addSingleAnswer .modal-body #add_s_entity2").val();
    command["param5"] = $("#addSingleAnswer .modal-body #add_s_answer").val();
    command["param6"] = $("#addSingleAnswer .modal-body #add_s_quick_reply").val();
    command["param7"] = $("#addSingleAnswer .modal-body #add_s_quick_reply_value").val();
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			data = JSON.parse(data_php);
			
			if (data.status == "0") {
                alert("Added successfully.");
                $('#addSingleAnswer').modal('hide');
            } else {
                alert(data.remarks);
            }
            $("#answers").empty();
            $("#answers_multiple").empty();
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

function update_answers() {
    command = {};
    command["command"] = ((server == 'production') ? update_answer : staging_update_answer);
	command["no_of_params"] = 8;
    command["param1"] = $("#editSingleAnswer .modal-title .id").text();
    command["param2"] = $("#editSingleAnswer .modal-body #s_intent").val();
    command["param3"] = $("#editSingleAnswer .modal-body #s_entity").val();
    command["param4"] = $("#editSingleAnswer .modal-body #s_entity1").val();
    command["param5"] = $("#editSingleAnswer .modal-body #s_entity2").val();
    command["param6"] = $("#editSingleAnswer .modal-body #s_answer").val();
    command["param7"] = $("#editSingleAnswer .modal-body #s_quick_reply").val();
    command["param8"] = $("#editSingleAnswer .modal-body #s_quick_reply_value").val();
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
            //console.log(data_php);
			data = JSON.parse(data_php);
            alert("Saved");
            $('#editSingleAnswer').modal('hide');
            $("#answers").empty();
            $("#answers_multiple").empty();
        },
        error: function (data_php) {
            console.log("error [" + data_php + "]");
        }
    });
}

function delete_answers(answer_id) {
    var r = confirm("Press a button!");
    if (r == true) {
        command = {};
        command["command"] = ((server == 'production') ? delete_answer : staging_delete_answer);
		command["no_of_params"] = 1;
        command["param1"] = answer_id;
		$.ajax({
			type: "POST",
			url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//			crossDomain: true,
//			beforeSend: function(xhr) {
//				xhr.setRequestHeader("Authorization", "Basic "
//					+ btoa(phpusername + ":" + phppassword));
//			},
			success: function (data_php) {
				data = JSON.parse(data_php);
                //console.log(data);
                alert("Deleted");
                $("#answers").empty();
                $("#answers_multiple").empty();
            },
			error: function (data_php) {
				console.log("error [" + data_php + "]");
			}
        });
    } 
}

function get_answers(intent, entity, entity1, entity2) {
    $("#answers").empty();
    $("#answers_multiple").empty();
    command = {};
    command["command"] = ((server == 'production') ? get_answer : staging_get_answer);
	command["no_of_params"] = 4;
    command["param1"] = intent;
    command["param2"] = entity;
    command["param3"] = entity1;
    command["param4"] = entity2;
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			//console.log(data_php);
			data = JSON.parse(data_php);

            if (data.status == "1") {
                alert(data.remarks);
            } else {
            //console.log(data);
            $.each(data.results, function (index) {
                message = "";
                message = message + "<tr rel='" + this["id"] + "' class='answer'>"
                message = message + "<td>" + (index + 1) + "</td>"
                message = message + "<td class='intent'>" + this["intent"] + "</td>"
                message = message + "<td class='entity'>" + this["entity"] + "</td>"
                message = message + "<td class='entity1'>" + this["entity1"] + "</td>"
                message = message + "<td class='entity2'>" + this["entity2"] + "</td>"
                message = message + "<td class='response'>";
                if (this["answer"].substring(0, 6).toLowerCase() == 'custom') {
                    message = message + "<span class='answer view_multiple_answer'>" + this["answer"] + "</span>";
                } else {
                    message = message + "<span class='answer'>" + this["answer"] + "</span>";
                }
                if (this["quick_reply"] != "") {
                    message = message + "<br><br>" + "<span class='quick_reply'>" + this["quick_reply"] + "</span>";
                }
                if (this["quick_reply_value"] != "") {
                    message = message + "<br><br>" + "<span class='quick_reply_value'>" + this["quick_reply_value"] + "</span>";
                }
                message = message + "</td>";
                message = message + "<td><span class='edit_single_answer'>Edit</span> | <span class='delete_single_answer'>Delete</span></td>"
                message = message + "</tr>"
                $("#answers").append(message);
            })
            }
            //console.log("success");
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

function add_answers_multiple() {
    command = {};
    command["command"] = ((server == 'production') ? insert_answer_multiple : staging_insert_answer_multiple);
	command["no_of_params"] = 7;
    command["param1"] = $("#addMultipleAnswer .modal-body #add_m_intent").val();
    command["param2"] = $("#addMultipleAnswer .modal-body #add_m_type").val();
    command["param3"] = $("#addMultipleAnswer .modal-body #add_m_image").val();
    command["param4"] = $("#addMultipleAnswer .modal-body #add_m_answer").val();
    command["param5"] = $("#addMultipleAnswer .modal-body #add_m_subtitle").val();
    command["param6"] = $("#addMultipleAnswer .modal-body #add_m_quick_reply").val();
    command["param7"] = $("#addMultipleAnswer .modal-body #add_m_quick_reply_value").val();
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			data = JSON.parse(data_php);
            if (data.status == "0") {
                alert("Added successfully.");
                $('#addMultipleAnswer').modal('hide');
            } else {
                alert(data.remarks);
            }
            $("#answers").empty();
            $("#answers_multiple").empty();
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

function update_answers_multiple() {
    command = {};
    command["command"] = ((server == 'production') ? update_answer_multiple : staging_update_answer_multiple);
	command["no_of_params"] = 8;
    command["param1"] = $("#editMultipleAnswer .modal-title .id").text();
    command["param2"] = $("#editMultipleAnswer .modal-body #m_intent").val();
    command["param3"] = $("#editMultipleAnswer .modal-body #m_type").val();
    command["param4"] = $("#editMultipleAnswer .modal-body #m_image").val();
    command["param5"] = $("#editMultipleAnswer .modal-body #m_answer").val();
    command["param6"] = $("#editMultipleAnswer .modal-body #m_subtitle").val();
    command["param7"] = $("#editMultipleAnswer .modal-body #m_quick_reply").val();
    command["param8"] = $("#editMultipleAnswer .modal-body #m_quick_reply_value").val();
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			data = JSON.parse(data_php);
            //console.log(data);
            alert("Saved");
            $('#editMultipleAnswer').modal('hide');
            $("#answers").empty();
            $("#answers_multiple").empty();
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

function get_answers_multiple(intent) {
    $("#answers_multiple").empty();
    command = {};
    command["command"] = ((server == 'production') ? get_answer_multiple : staging_get_answer_multiple);
	command["no_of_params"] = 1;
    command["param1"] = intent;
	
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
            //console.log(data_php);
			data = JSON.parse(data_php);
            $.each(data.results, function (index) {
                message = "";
                message = message + "<tr rel='" + this["id"] + "' class='answer'>"
                message = message + "<td>" + (index + 1) + "</td>"
                message = message + "<td class='intent'>" + this["intent"] + "</td>"
                message = message + "<td class='type'>" + this["type"] + "</td>"
                message = message + "<td class='image'>" + this["image"] + "</td>"
                message = message + "<td class='response'>";
                message = message + "<span class='answer'>" + this["answer"] + "</span>";
                if (this["subtitle"] != ""){
                    message = message + "<br><br>" + "<span class='subtitle'>" + this["subtitle"] + "</span>";
                }
                if (this["quick_reply"] != "") {
                    message = message + "<br><br>" + "<span class='quick_reply'>" + this["quick_reply"] + "</span>";
                }
                if (this["quick_reply_value"] != "") {
                    message = message + "<br><br>" + "<span class='quick_reply_value'>" + this["quick_reply_value"] + "</span>";
                }
                message = message + "</td>"
                message = message + "<td><span class='edit_multiple_answer'>Edit</span> | <span class='delete_multiple_answer'>Delete</span></td>"
                message = message + "</tr>"
                $("#answers_multiple").append(message);
            })
            //console.log("success");
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

var x = '';
var iscard = 0;
var loading = '<div class="loading"><span>Loading ...</span></div>';

function wrap_cards(value) {
    var y = '';
    y += '<div class="wc-carousel">';
    y += '<div>';
    y += '<button class="scroll previous" disabled=""><svg><path d="M 16.5 22 L 19 19.5 L 13.5 14 L 19 8.5 L 16.5 6 L 8.5 14 L 16.5 22 Z"></path></svg></button>';
    y += '<div class="wc-hscroll-outer">';
    y += '<div class="wc-hscroll" style="margin-bottom: -17px;">';
    y += '<ul>';
    y +=  value;
    y += '</ul>';
    y += '<button class="scroll next"><svg><path d="M 12.5 22 L 10 19.5 L 15.5 14 L 10 8.5 L 12.5 6 L 20.5 14 L 12.5 22 Z"></path></svg></button>';
    y += '</div>';
    y += '</div>';
    y += '</div>';
    y += '</div>';

    $("#answer").append(y);
    iscard = 0;
    var objDiv = document.getElementById("answer");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function setResponse(val) {
    x = '';
    $(".response").text(val);
    var obj = JSON.parse(val);
    console.log(obj);
    $("#intent").text(obj.result.metadata.intentName);
    $("#topic").text(obj.result.parameters.topic);
    $("#subtopic").text(obj.result.parameters.subtopic);
    $("#details").text(obj.result.parameters.details);

    var db_attributes = obj.result.fulfillment.speech;
    var db_attr = db_attributes.split(",");
    console.log(db_attr);
    $("#db_intent").text(db_attr[0]);
    $("#db_topic").text(db_attr[1]);
    $("#db_subtopic").text(db_attr[2]);
    $("#db_details").text(db_attr[3]);

    $(".search_check").prop('checked', false);
    $(".search_input").val('');
    if (db_attr[0].length > 1) {
        $("#search_intent").val(db_attr[0]);
        $("#check_intent").prop('checked', true);
    }
    if (db_attr[1]) {
        if (db_attr[1].length > 1) {
            $("#search_topic").val(db_attr[1]);
            $("#check_topic").prop('checked', true);
        }
    }
    if (db_attr[2]) {
        if (db_attr[2].length > 1) {
            $("#search_subtopic").val(db_attr[2]);
            $("#check_subtopic").prop('checked', true);
        }
    }
    if (db_attr[3]) {
        if (db_attr[3].length > 1) {
            $("#search_details").val(db_attr[3]);
            $("#check_details").prop('checked', true);
        }
    }

    get_answers(db_attr[0], db_attr[1], db_attr[2], db_attr[3]);

    var answers = obj.result.fulfillment.messages;
    //$("#answer").append("<div><span class='user_say'>" + obj.result.resolvedQuery + "</span></div>");

    //console.log(obj.result.fulfillment.data);

    if(typeof obj.result.fulfillment.data != "undefined"){
        $("#answer").append("<div><span class='bot_say'>" + obj.result.fulfillment.data.facebook.text + "</span></div>");
        x = '';
        x += '<div class="wc-suggested-actions wc-hscroll-outer">';
        x += '<div class="wc-hscroll wc-quick-reply-buttons" style="margin-bottom: -17px;">';
        x += '<ul>';
        for (j = 0; j < obj.result.fulfillment.data.facebook.quick_replies.length; j++) {
            x += '<li><button value="' + obj.result.fulfillment.data.facebook.quick_replies[j].payload + '">' + obj.result.fulfillment.data.facebook.quick_replies[j].title + '</button></li>';
        }
        x += '</ul></div></div>';
        $("#answer").append(x);
        var objDiv = document.getElementById("answer");
        objDiv.scrollTop = objDiv.scrollHeight;
        //console.log(x);
    } else {
        //console.log(answers);
        for (i = 0; i < answers.length; i++) {
            if (answers[i].type == 0) {
                $("#answer").append("<div><span class='bot_say'>" + answers[i].speech + "</span></div>");
            } else if (answers[i].type == 1) {
                iscard = 1;
                //$("#answer").append("<span class='bot_say'>" + answers[i].title + "</span><br><br>");
                x += '<li class="wc-carousel-item"><div class="wc-card hero">';
                if (answers[i].imageUrl != '') {
                    x += '<img src="' + answers[i].imageUrl + '">';
                }
                if (answers[i].title != '') {
                    x += '<h1>' + answers[i].title + '</h1>';
                }
                if (answers[i].subtitle != '') {
                    x += "<div><span class='bot_say'>" + answers[i].subtitle + "</span></div>";
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
                $("#answer").append("<div><span class='bot_say'>" + answers[i].title + "</span></div>");
            } else if (answers[i].type == 3) {
                $("#answer").append("<div><span class='bot_say'>" + answers[i].title + "</span></div>");
            } else if (answers[i].type == 4) {
                $("#answer").append("<div><span class='bot_say'>" + answers[i].payload.facebook.text + "</span></div>");
                x = '';
                x += '<div class="wc-suggested-actions wc-hscroll-outer">';
                x += '<div class="wc-hscroll wc-quick-reply-buttons" style="margin-bottom: -17px;">';
                x += '<ul>';
                for (j = 0; j < answers[i].payload.facebook.quick_replies.length; j++) {
                    x += '<li><button value="' + answers[i].payload.facebook.quick_replies[j].payload + '">' + answers[i].payload.facebook.quick_replies[j].title + '</button></li>';
                }
                x += '</ul></div></div>';
                $("#answer").append(x);
            } else {

            }
        }


    }


    //console.log(x);

    //$("#answer").append(x);
    //$("#answer").append("<hr>");
    var objDiv = document.getElementById("answer");
    objDiv.scrollTop = objDiv.scrollHeight;

}

function get_idd_rates_function() {
    $("#rates").empty();
    command = {};
    command["command"] = get_idd_rates;
	command["no_of_params"] = 0;
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			data = JSON.parse(data_php);

            if (data.status == "1") {
                alert(data.remarks);
            } else {
            //console.log(data);
			message = "<tr class='answer'><td>ID</td><td class='user_type'>User Type</td><td>Country Name</td><td>Country Name(URL)</td><td>Country Code</td><td>IDD 133 Mobile</td><td>IDD 133 Fixed Line</td><td></td></tr>";
			$("#rates").append(message);
            $.each(data.results, function (index) {
				message = "";
                message = message + "<tr rel='" + this["id"] + "' class='answer'>"
                message = message + "<td>" + (index + 1) + "</td>"
                message = message + "<td class='user_type'>" + this["user_type"] + "</td>"
                message = message + "<td class='country_name_display'>" + this["country_name_display"] + "</td>"
                message = message + "<td class='country_name_url'>" + this["country_name_url"] + "</td>"
                message = message + "<td class='country_code'>" + this["country_code"] + "</td>"
                message = message + "<td class='rate_133_mobile'>" + this["rate_133_mobile"] + "</td>"
                message = message + "<td class='rate_133_fixed_line'>" + this["rate_133_fixed_line"] + "</td>"
                message = message + "<td><span class='edit_idd_rates'>Edit</span> | <span class='delete_idd_rate'>Delete</span></td>"
                message = message + "</tr>"
                $("#rates").append(message);
            })
            }
            //console.log("success");
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
};


function add_idd_rates_function() {
    command = {};
    command["command"] = add_idd_rates;
	command["no_of_params"] = 6;
    command["param1"] = $("#addIddRates .modal-body #s_user_type").val();
    command["param2"] = $("#addIddRates .modal-body #s_country_name_display").val();
    command["param3"] = $("#addIddRates .modal-body #s_country_name_url").val();
    command["param4"] = $("#addIddRates .modal-body #s_country_code").val();
    command["param5"] = $("#addIddRates .modal-body #s_rate_133_fixed_line").val();
    command["param6"] = $("#addIddRates .modal-body #s_rate_133_mobile").val();
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			data = JSON.parse(data_php);
            //console.log(data);
            alert("Added");
            $('#editIddRates').modal('hide');
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

function update_idd_rates_function() {
    command = {};
    command["command"] = edit_idd_rates;
	command["no_of_params"] = 6;
    command["param1"] = $("#editIddRates .modal-body #s_user_type").val();
    command["param2"] = $("#editIddRates .modal-body #s_country_name_display").val();
    command["param3"] = $("#editIddRates .modal-body #s_country_name_url").val();
    command["param4"] = $("#editIddRates .modal-body #s_country_code").val();
    command["param5"] = $("#editIddRates .modal-body #s_rate_133_fixed_line").val();
    command["param6"] = $("#editIddRates .modal-body #s_rate_133_mobile").val();
	$.ajax({
		type: "POST",
		url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//		crossDomain: true,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
		success: function (data_php) {
			data = JSON.parse(data_php);
            //console.log(data);
            alert("Saved");
            $('#editIddRates').modal('hide');
        },
		error: function (data_php) {
			console.log("error [" + data_php + "]");
		}
    });
}

function delete_idd_rate_function(answer_id) {
    var r = confirm("Confirm to Delete Answer!");
    if (r == true) {
        command = {};
        command["command"] = delete_idd_rates ;
		command["no_of_params"] = 1;
        command["param1"] = answer_id;
		$.ajax({
			type: "POST",
			url: urlstring, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
//			crossDomain: true,
//			beforeSend: function(xhr) {
//				xhr.setRequestHeader("Authorization", "Basic "
//					+ btoa(phpusername + ":" + phppassword));
//			},
			success: function (data_php) {
				data = JSON.parse(data_php);
                //console.log(data);
                alert("Deleted");
            },
			error: function (data_php) {
				console.log("error [" + data_php + "]");
			}
        });
    } 
}