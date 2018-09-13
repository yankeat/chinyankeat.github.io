
var urlstring = 'https://yankeat-digital.azurewebsites.net/seek/';

var get_products = 'seek_get_product_list.php';
var insert_product = 'seek_insert_product.php';
var delete_product = 'seek_delete_product.php';

var get_promotion = 'seek_get_promotion_list.php';
var insert_promotion = 'seek_insert_promotion.php';
var delete_promotion = 'seek_delete_promotion.php';

var calculate_price = 'seek_calculate_price.php';

var get_customer_list_php = 'seek_get_customer_list.php';
var get_shopping_cart_list_php = 'seek_get_shopping_cart_list.php';
var add_order_php = 'seek_add_order.php';
var update_order_php = 'seek_update_order.php';
var delete_order_php = 'seek_delete_order.php';

var company_selected = 0;
var currency_patt = /^\d+(\.\d{2})?$/;
var number_patt = /^\d+$/;

$(document).ready(function () {


    $("#add_product_button").on("click", function (event) {
		$('#addProduct_Submit_warning').text("");
		
        $('#add_product_id').find("input").val("");
        $('#add_product_name').find("input").val("");
        $('#add_price').find("input").val("");
        $('#addProduct').modal('show');
    });

	$("#add_bundle_button").on("click", function (event) {
		$('#addBundle_Submit_warning').text("");

		$('#add_bundle_customer_name').find("input").val("");
        $('#add_bundle_product_id').find("input").val("");
        $('#add_bundle_order_qty').find("input").val("");
        $('#add_bundle_charge_qty').find("input").val("");
        $('#addBundle').modal('show');
    });

	$("#add_discount_button").on("click", function (event) {
		$('#addDiscount_Submit_warning').text("");

		$('#add_discount_customer_name').find("input").val("");
        $('#add_discount_product_id').find("input").val("");
        $('#add_discount_minimum_qty').find("input").val("");
        $('#add_discount_price').find("input").val("");
        $('#addDiscount').modal('show');
	});

	$("#add_order_button").on("click", function (event) {
		$('#addOrder_Submit_warning').text("");
		if(company_selected) {
			$('#add_order_customer_name').val(company_selected);
		} else {
			$('#add_order_customer_name').find("input").val("");			
		}
		get_product_to_order_form($('#add_order_product_id'));
        $('#add_order_quantity').find("input").val("");
        $('#addOrder').modal('show');
	});


    $("#submit_add_product").on("click", function (event) {

		var product_id_valid = $('#add_product_id').val().length;
		var product_name_valid = $('#add_product_name').val().length;
		var price_valid = currency_patt.test($('#add_price').val());

		if (product_id_valid && product_name_valid && price_valid && parseFloat($('#add_price').val())>0) {
			// correct format
			add_product_to_db();
		} else {
			$('#addProduct_submit_warning').text("");
			if (!product_id_valid) {
				$('#addProduct_submit_warning').text("Please Enter Product ID. ");
			}
			if (!product_name_valid){
				$('#addProduct_submit_warning').text($('#addProduct_submit_warning').text() + "Please Product Name ");
			}
			if (!price_valid ||  parseFloat($('#add_price').val())<=0) {
				$('#addProduct_submit_warning').text($('#addProduct_submit_warning').text() + "Please Enter Valid Price");
			}
		}
    });

    $("#submit_add_bundle").on("click", function (event) {

		var customer_name = $("#add_bundle_customer_name").val().length;
		var amount_valid = number_patt.test($('#add_bundle_qty').val())
		var charge_qty_valid = number_patt.test($('#add_bundle_charge_qty').val());

		if (customer_name && product_id && amount_valid && charge_qty_valid && parseInt($('#add_bundle_qty').val())>0 
		&& parseInt($('#add_bundle_charge_qty').val())) {
			// correct format
			add_bundle_to_db();
		} else {
			$('#addBundle_submit_warning').text("");
			if (!customer_name) {
				$('#addBundle_submit_warning').text("Please Enter Customer Name ");
			}
			if (!amount_valid || parseInt($('#add_bundle_qty').val())<=0) {
				$('#addBundle_submit_warning').text($('#addBundle_submit_warning').text() + "Please Enter Valid Quantity ");
			}
			if (!charge_qty_valid || parseInt($('#add_bundle_charge_qty').val())<=0) {
				$('#addBundle_submit_warning').text($('#addBundle_submit_warning').text() + "Please Enter Charge Quantity");
			}
		}

    });

    $("#submit_add_discount").on("click", function (event) {

		var customer_name = $("#add_discount_customer_name").val().length;
		var minimum_qty_valid = number_patt.test($('#add_discount_minimum_qty').val())
		var discount_price_valid = currency_patt.test($('#add_discount_price').val());


		if (customer_name && minimum_qty_valid && discount_price_valid && parseInt($('#add_discount_minimum_qty').val())>0 
		&& parseFloat($('#add_discount_price').val())>0) {
			// correct format
			add_discount_to_db();
		} else {
			$('#addDiscount_submit_warning').text("");
			if (!customer_name) {
				$('#addDiscount_submit_warning').text("Please Enter Customer Name ");
			}
			if (!minimum_qty_valid || parseInt($('#add_discount_minimum_qty').val())<=0) {
				$('#addDiscount_submit_warning').text($('#addDiscount_submit_warning').text() + "Please Enter Valid Quantity ");
			}
			if (!discount_price_valid || parseFloat($('#add_discount_price').val())<=0) {
				$('#addDiscount_submit_warning').text($('#addDiscount_submit_warning').text() + "Please Enter Price");
			}
		}
	});
	
    $("#submit_add_order").on("click", function (event) {
		
		var amount_valid = number_patt.test($('#add_order_quantity').val())
		var text_valid = $('#add_order_customer_name').val().length;

		if (amount_valid && text_valid) {
			// correct format
			add_order_to_db();
			
			if(company_selected){
				get_order_list(company_selected);
			}
		} else {
			$('#addOrder_Submit_warning').text("");
			if (!text_valid)
				$('#addOrder_Submit_warning').text("Please Enter Company Name. ");
			if (!amount_valid)
				$('#addOrder_Submit_warning').text($('#addOrder_Submit_warning').text() + "Please Enter Quantity");
		}
	});



    $(document).on("click", ".edit_product", function () {
        var temp = $(this).parent().parent();
		$("#editProduct_submit_warning").text("");

        $("#s_product_id").val($(temp).find(".single_product_id").text());
        $("#s_product_name").val($(temp).find(".single_product_name").text());
		$("#s_price").val($(temp).find(".single_price").text());
        $('#editProduct').modal('show');
    });


    $(document).on("click", ".edit_bundle", function () {
		var temp = $(this).parent().parent();
		$("#editBundle_submit_warning").text("");

        $("#s_bundle_customer_name").val($(temp).find(".bundle_customer_name").text());
        $("#s_bundle_product_id").val($(temp).find(".bundle_product_id").text());
		$("#s_bundle_qty").val($(temp).find(".bundle_order_qty").text());
		$("#s_bundle_charge_qty").val($(temp).find(".bundle_charge_qty").text());
        $('#editBundle').modal('show');
    });	

    $(document).on("click", ".edit_discount", function () {
        var temp = $(this).parent().parent();
		$("#editDiscount_submit_warning").text("");

        $("#s_discount_customer_name").val($(temp).find(".discount_customer_name").text());
        $("#s_discount_product_id").val($(temp).find(".discount_product_id").text());
		$("#s_discount_minimum_qty").val($(temp).find(".discount_minimum_qty").text());
		$("#s_discount_price").val($(temp).find(".discount_price").text());
        $('#editDiscount').modal('show');
    });	

    $(document).on("click", ".edit_order", function () {
		var temp = $(this).parent().parent();
		// empty the submit warning
		$('#editOrder_Submit_warning').text("");

        $("#s_order_customer_name").val($(temp).find(".order_customer_name").text());
		$('#s_order_product_id').val($(temp).find(".order_product_id").text());
		$("#s_order_quantity").val($(temp).find(".order_quantity").text());
        $('#editOrder').modal('show');
    });	
	
    $("#submit_save_product").on("click", function (event) {

		var product_id_valid = $('#s_product_id').val().length;
		var product_name_valid = $('#s_product_name').val().length;
		var price_valid = currency_patt.test($('#s_price').val());

		if (product_id_valid && product_name_valid && price_valid) {
			// correct format
			update_product_to_db();
		} else {
			$('#editProduct_submit_warning').text("");
			if (!product_id_valid)
				$('#editProduct_submit_warning').text("Please Enter Product ID. ");
			if (!product_name_valid)
				$('#editProduct_submit_warning').text($('#editProduct_submit_warning').text() + "Please Product Name ");
			if (!price_valid)
				$('#editProduct_submit_warning').text($('#editProduct_submit_warning').text() + "Please Enter Valid Price");
		}
    });

    $("#submit_save_bundle").on("click", function (event) {

		var amount_valid = number_patt.test($('#s_bundle_qty').val())
		var charge_qty_valid = number_patt.test($('#s_bundle_charge_qty').val());

		if (amount_valid && charge_qty_valid) {
			// correct format
			update_bundle_to_db();
		} else {
			$('#editBundle_submit_warning').text("");
			if (!amount_valid) {
				$('#editBundle_submit_warning').text("Please Enter Valid Quantity ");
			}
			if (!charge_qty_valid) {
				$('#editBundle_submit_warning').text($('#editBundle_submit_warning').text() + "Please Enter Charge Quantity");
			}
		}
    });

    $("#submit_save_discount").on("click", function (event) {
        update_discount_to_db();
    });

	$("#submit_save_order").on("click", function (event) {
		var amount_valid = number_patt.test($('#s_order_quantity').val())

		if (amount_valid) {
			// correct format
			update_order_to_db();
			
			if(company_selected){
				get_order_list(company_selected);
			}

		} else {
			$('#editOrder_Submit_warning').text("");
			if (!amount_valid)
				$('#editOrder_Submit_warning').text($('#addOrder_Submit_warning').text() + "Please Enter Quantity");
		}
    });



    $(document).on("click", ".delete_product", function () {
        var temp = $(this).parent().parent();
        delete_product_from_db($(temp).find(".single_product_id").text());
	});

	$(document).on("click", ".delete_bundle", function () {
        var temp = $(this).parent().parent();
        delete_promotion_from_db($(temp).find(".bundle_id").text());
	});

    $(document).on("click", ".delete_discount", function () {
        var temp = $(this).parent().parent();
        delete_promotion_from_db($(temp).find(".discount_id").text());
	});

    $(document).on("click", ".delete_order", function () {
		var temp = $(this).parent().parent();
		
		delete_order_from_db($(temp).find(".order_customer_name").text(), $(temp).find(".order_product_id").text());
	});

	$("#order_company_dropdown").change(function(){
		if ($("#order_company_dropdown").prop('selectedIndex')) {
			// company selected
			company_selected = $("#order_company_dropdown").val();
			get_order_list(company_selected);	
			get_product_to_order_form($('#s_order_product_id'));

			calculate_checkout_price(company_selected);
			
		} else {
			// no company selected (index 0 selected)
			company_selected = 0;
			$("#order_list").empty();
		}
	});


});

function get_product_list() {

	var php_command = urlstring + get_products;
	command = {};

    $.ajax({
		type: "POST",
		url: php_command, data: { data: JSON.stringify(command) }, cache: false, async: true, timeout: 10000,
		success: function (data) {
            // console.log(data);
			message = "";
			message = message + "<tr>";
			message = message + "<td>  </td>";
			message = message + "<td> Product ID </td>";
			message = message + "<td> Product Name </td>";
			message = message + "<td> Price (RM)</td>";
			message = message + "<td> Action </td>"
			message = message + "</tr>"
			$("#product_list").empty();
			$("#product_list").append(message);

			json_data = JSON.parse(data);
			$.each(json_data.results, function (index) {
                message = "";
				message = message + "<tr>"
                message = message + "<td>" + (index + 1) + "</td>"
                message = message + "<td class='single_product_id' >" + this["product_id"] + "</td>"
                message = message + "<td class='single_product_name'>" + this["product_name"] + "</td>"
                message = message + "<td class='single_price'>" + parseInt(this["price"])/100 + "</td>"
                message = message + "<td><span class='edit_product'>Edit</span> | <span class='delete_product'>Delete</span></td>"
                message = message + "</tr>"
                $("#product_list").append(message);
            })

			get_product_to_order_form($('#add_bundle_product_id'));
			get_product_to_order_form($('#add_discount_product_id'));

		},
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function get_product_to_order_form(result_holder) {

	var php_command = urlstring + get_products;
	command = {};

    $.ajax({
		type: "POST",
		url: php_command, data: { data: JSON.stringify(command) }, cache: false, async: true, timeout: 10000,
		success: function (data) {
            // console.log(data);
			$(result_holder).empty();
			json_data = JSON.parse(data);
			$.each(json_data.results, function (index) {

				$(result_holder).append('<option value="' + this["product_id"] + '">'+ this["product_name"] +'</option>');
            })
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}


function add_product_to_db() {
	var php_command = urlstring + insert_product;
	var command = {};
    command["product_id"]   = $("#add_product_id").val();
    command["product_name"] = $("#add_product_name").val();
	command["price"]        = parseFloat($("#add_price").val())*100;

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			
			$('#addProduct').modal('hide');
			get_product_list();

			// load dropdown
			get_product_to_order_form($('#add_bundle_product_id'));
			get_product_to_order_form($('#add_discount_product_id'));
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function add_bundle_to_db() {
	var php_command = urlstring + insert_promotion;
	var command = {};
    command["customer_name"]	= $("#add_bundle_customer_name").val();
    command["product_id"]		= $("#add_bundle_product_id").val();
    command["promo_type"]		= 'bundle';
    command["minimum_qty"]		= 0;
    command["promo_price"]		= 0;
    command["bundle_order_qty"]	= $("#add_bundle_qty").val();
    command["bundle_charge_qty"]= $("#add_bundle_charge_qty").val();
    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(data);

			$('#addBundle').modal('hide');
			get_promotion_list();
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function add_discount_to_db() {
	var php_command = urlstring + insert_promotion;
	var command = {};
    command["customer_name"]	= $("#add_discount_customer_name").val();
    command["product_id"]		= $("#add_discount_product_id").val();
    command["promo_type"]		= 'discount';
    command["minimum_qty"]		= $("#add_discount_minimum_qty").val();
    command["promo_price"]		= $("#add_discount_price").val();
    command["bundle_order_qty"]	= 0;
    command["bundle_charge_qty"]= 0;

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
		// console.log(data);
			
			$('#addDiscount').modal('hide');
			get_promotion_list();
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function add_order_to_db() {
	var php_command = urlstring + add_order_php;
	var command = {};

    command["customer_name"]	= $("#add_order_customer_name").val();
    command["product_id"]		= $("#add_order_product_id :selected").val();
    command["quantity"]			= $("#add_order_quantity").val();

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(JSON.stringify(data));
			
			$('#addOrder').modal('hide');
			company_selected = $("#addOrder .modal-body #add_order_customer_name").val();
			get_customer_list();
			get_order_list(company_selected);
			calculate_checkout_price(company_selected);
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}


function update_product_to_db() {
	var php_command = urlstring + insert_product;
	var command = {};
    command["product_id"]   = $("#editProduct .modal-body #s_product_id").val();
    command["product_name"] = $("#editProduct .modal-body #s_product_name").val();
    command["price"]        = parseFloat($("#editProduct .modal-body #s_price").val())*100;

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
            $('#editProduct').modal('hide');
			get_product_list();
        },
        error: function (data) {
            console.log("error [" + data + "]");
        }
    });
}

function update_bundle_to_db() {
	var php_command = urlstring + insert_promotion;
	var command = {};
    command["customer_name"]	= $("#editBundle .modal-body #s_bundle_customer_name").val();
    command["product_id"]		= $("#editBundle .modal-body #s_bundle_product_id").val();
    command["promo_type"]		= 'bundle';
    command["minimum_qty"]		= 0;
    command["promo_price"]		= 0;
    command["bundle_order_qty"]	= $("#editBundle .modal-body #s_bundle_qty").val();
	command["bundle_charge_qty"]= $("#editBundle .modal-body #s_bundle_charge_qty").val();
	
    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(data);

			$('#editBundle').modal('hide');
			get_promotion_list();
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function update_discount_to_db() {
	var php_command = urlstring + insert_promotion;
	var command = {};
    command["customer_name"]	= $("#editDiscount .modal-body #s_discount_customer_name").val();
    command["product_id"]		= $("#editDiscount .modal-body #s_discount_product_id").val();
    command["promo_type"]		= 'discount';
    command["minimum_qty"]		= $("#editDiscount .modal-body #s_discount_minimum_qty").val();
    command["promo_price"]		= $("#editDiscount .modal-body #s_discount_price").val();
    command["bundle_order_qty"]	= 0;
    command["bundle_charge_qty"]= 0;

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
		// console.log(data);
			
			$('#editDiscount').modal('hide');
			get_promotion_list();
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function update_order_to_db() {
	var php_command = urlstring + update_order_php;
	var command = {};
    command["customer_name"]	= $("#s_order_customer_name").val();
    command["product_id"]		= $("#s_order_product_id").val();
    command["quantity"]			= $("#s_order_quantity").val();

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(JSON.stringify(data));
			
			$('#editOrder').modal('hide');
			company_selected = $("#s_order_customer_name").val();
			get_customer_list();
			get_order_list(company_selected);
			calculate_checkout_price(company_selected);
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function delete_product_from_db(product_id) {
    var r = confirm("Confirm Delete " + product_id + "?");
	var php_command = urlstring + delete_product;
	var command = {};

	if (r == true) {
        command = {};
        command["product_id"] = product_id;
		$.ajax({
			type: "POST",
			url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
			success: function (data) {
				get_product_list();
            },
			error: function (data) {
				console.log("error [" + data + "]");
			}
        });
    } 
}

function delete_promotion_from_db(promotion_id) {
    var r = confirm("Confirm Delete Promotion " + promotion_id + "?");
	var php_command = urlstring + delete_promotion;
	var command = {};

	if (r == true) {
        command = {};
        command["id"] = promotion_id;
		$.ajax({
			type: "POST",
			url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
			success: function (data) {
				get_promotion_list();
            },
			error: function (data) {
				console.log("error [" + data + "]");
			}
        });
    } 
}

function delete_order_from_db(customer_name, product_id) {
    var r = confirm("Confirm Delete Order for " + customer_name + ', ' + product_id + "?");
	var php_command = urlstring + delete_order_php;
	var command = {};

	if (r == true) {
        command = {};
        command["customer_name"] = customer_name;
        command["product_id"] = product_id;
		$.ajax({
			type: "POST",
			url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
			success: function (data) {
				get_customer_list();
				get_order_list(company_selected);
				calculate_checkout_price(company_selected);
            },
			error: function (data) {
				console.log("error [" + data + "]");
			}
        });
    } 
}



function get_promotion_list() {
	var php_command = urlstring + get_promotion;
	command = {};

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(data);
			json_data = JSON.parse(data);
			
			// Build Bundle Table
			message = "";
			message = message + "<tr>";
			message = message + "<td>  </td>";
			message = message + "<td> Customer </td>";
			message = message + "<td> Product ID </td>";
			message = message + "<td> Bundle Qty </td>"
			message = message + "<td> Qty Charged </td>"
			message = message + "<td> Action </td>"
			message = message + "</tr>"
			$("#bundle_list").empty();
			$("#bundle_list").append(message);

			$.each(json_data.results, function (index) {
				if(this["promo_type"]=="bundle") {
					message = "";
					message = message + "<tr>"
					message = message + "<td class='bundle_id' >" + this["id"] + "</td>"
					message = message + "<td class='bundle_customer_name' >" + this["customer_name"] + "</td>"
					message = message + "<td class='bundle_product_id'>" + this["product_id"] + "</td>"
					message = message + "<td class='bundle_order_qty'>" + this["bundle_order_qty"] + "</td>"
					message = message + "<td class='bundle_charge_qty'>" + this["bundle_charge_qty"] + "</td>"
					message = message + "<td><span class='edit_bundle'>Edit</span> | <span class='delete_bundle'>Delete</span></td>"
					message = message + "</tr>"
					$("#bundle_list").append(message);
				}
			})
			
			// Build Discount Table
			message = "";
			message = message + "<tr>";
			message = message + "<td>  </td>";
			message = message + "<td> Customer </td>";
			message = message + "<td> Product ID </td>";
			message = message + "<td> Min Qty </td>"
			message = message + "<td> Discounted Price (RM)</td>"
			message = message + "<td> Action </td>"
			message = message + "</tr>"
			$("#discount_list").empty();
			$("#discount_list").append(message);

			$.each(json_data.results, function (index) {
				if(this["promo_type"]=="discount") {
					message = "";
					message = message + "<tr>"
					message = message + "<td class='discount_id' >" + this["id"] + "</td>"
					message = message + "<td class='discount_customer_name' >" + this["customer_name"] + "</td>"
					message = message + "<td class='discount_product_id'>" + this["product_id"] + "</td>"
					message = message + "<td class='discount_minimum_qty'>" + this["minimum_qty"] + "</td>"
					message = message + "<td class='discount_price'>" + parseInt(this["promo_price"])/100 + "</td>"
					message = message + "<td><span class='edit_discount'>Edit</span> | <span class='delete_discount'>Delete</span></td>"
					message = message + "</tr>"
					$("#discount_list").append(message);
				}
			})

        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function get_customer_list() {
	var php_command = urlstring + get_customer_list_php;
	command = {};
    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(data);
			json_data = JSON.parse(data);

			$('#order_company_dropdown').empty();
			$('#order_company_dropdown').append('<option value="All">Done, Select Customer</option>');

			$.each(json_data.results, function (index) {
				$('#order_company_dropdown').append('<option value="'+this["customer_name"]+'">' + this["customer_name"] +'</option>');
			})

			if(company_selected) {
				$('#order_company_dropdown').val(company_selected);
			}

        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function get_order_list(customer_name_selected) {
	var php_command = urlstring + get_shopping_cart_list_php;
	command = {};
    command["customer_name"]	= customer_name_selected;

	
    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(data);

			if(data) {
				json_data = JSON.parse(data);
			
				// Build Bundle Table
				message = "";
				message = message + "<tr>";
				message = message + "<td> Customer </td>";
				message = message + "<td> Product ID </td>";
				message = message + "<td> Quantity </td>"
				message = message + "<td> Action </td>"
				message = message + "</tr>"
				$("#order_list").empty();
				$("#order_list").append(message);
	
				$.each(json_data.results, function (index) {
					message = "";
					message = message + "<tr>"
					message = message + "<td class='order_customer_name' >" + this["customer_name"] + "</td>"
					message = message + "<td class='order_product_id'>" + this["product_id"] + "</td>"
					message = message + "<td class='order_quantity'>" + this["quantity"] + "</td>"
					message = message + "<td><span class='edit_order'>Edit</span> | <span class='delete_order'>Delete</span></td>"
					message = message + "</tr>"
					$("#order_list").append(message);
				})
	
			} else {
				$("#order_list").empty();				
			}
			
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}


function calculate_checkout_price(customer_name_selected) {
	var php_command = urlstring + calculate_price;
	command = {};
    command["customer_name"]	= customer_name_selected;

	
    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(data);
			json_data = JSON.parse(data);
			$("#total_price").text("Total Checkout Price is RM "+json_data.price/100);
			
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}
