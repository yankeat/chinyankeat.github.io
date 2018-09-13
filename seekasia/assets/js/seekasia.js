
var urlstring = 'https://yankeat-digital.azurewebsites.net/seek/';

var get_products = 'seek_get_product_list.php';
var insert_product = 'seek_insert_product.php';
var delete_product = 'seek_delete_product.php';

var get_promotion = 'seek_get_promotion_list.php';
var insert_promotion = 'seek_insert_promotion.php';
var delete_promotion = 'seek_delete_promotion.php';

var get_shopping_cart_list = 'seek_get_shopping_cart_list';
var add_product_to_cart = 'seek_add_product_to_cart';
var delete_product_from_cart = 'seek_delete_product_from_cart';
var calculate_shopping_cart_sum = 'seek_calculate_shopping_cart_sum';

var get_customer_list_php = 'seek_get_customer_list.php';
var get_shopping_cart_list_php = 'seek_get_shopping_cart_list.php';
var add_order_php = 'seek_add_order.php';

var company_selected = 0;

$(document).ready(function () {

    $("#add_product_button").on("click", function (event) {
        $('#add_product_id').find("input").val("");
        $('#add_product_name').find("input").val("");
        $('#add_price').find("input").val("");
        $('#addProduct').modal('show');
    });

	$("#add_bundle_button").on("click", function (event) {
        $('#add_bundle_customer_name').find("input").val("");
        $('#add_bundle_product_id').find("input").val("");
        $('#add_bundle_order_qty').find("input").val("");
        $('#add_bundle_charge_qty').find("input").val("");
        $('#addBundle').modal('show');
    });

	$("#add_discount_button").on("click", function (event) {
        $('#add_discount_customer_name').find("input").val("");
        $('#add_discount_product_id').find("input").val("");
        $('#add_discount_minimum_qty').find("input").val("");
        $('#add_discount_price').find("input").val("");
        $('#addDiscount').modal('show');
	});

	$("#add_order_button").on("click", function (event) {
		if(company_selected) {
			$('#add_order_customer_name').val(company_selected);
		} else {
			$('#add_order_customer_name').find("input").val("");			
		}
		get_product_to_order_form($('#add_order_product_id'));
		// $('#add_order_product_id').find("input").val("");
        $('#add_order_quantity').find("input").val("");
        $('#addOrder').modal('show');
	});


    $("#submit_add_product").on("click", function (event) {
        add_product_to_db();
    });

    $("#submit_add_bundle").on("click", function (event) {
        add_bundle_to_db();
    });

    $("#submit_add_discount").on("click", function (event) {
        add_discount_to_db();
	});
	
    $("#submit_add_order").on("click", function (event) {
		add_order_to_db();
		
		if(company_selected){
			get_order_list(company_selected);
		}
	});



    $(document).on("click", ".edit_product", function () {
        var temp = $(this).parent().parent();

        $("#editProduct .modal-body #s_product_id").val($(temp).find(".single_product_id").text());
        $("#editProduct .modal-body #s_product_name").val($(temp).find(".single_product_name").text());
		$("#editProduct .modal-body #s_price").val($(temp).find(".single_price").text());
        $('#editProduct').modal('show');
    });


    $(document).on("click", ".edit_bundle", function () {
        var temp = $(this).parent().parent();

        $("#editBundle .modal-body #s_bundle_customer_name").val($(temp).find(".bundle_customer_name").text());
        $("#editBundle .modal-body #s_bundle_product_id").val($(temp).find(".bundle_product_id").text());
		$("#editBundle .modal-body #s_bundle_qty").val($(temp).find(".bundle_order_qty").text());
		$("#editBundle .modal-body #s_bundle_charge_qty").val($(temp).find(".bundle_charge_qty").text());
        $('#editBundle').modal('show');
    });	

    $(document).on("click", ".edit_discount", function () {
        var temp = $(this).parent().parent();

        $("#s_discount_customer_name").val($(temp).find(".discount_customer_name").text());
        $("#s_discount_product_id").val($(temp).find(".discount_product_id").text());
		$("#s_discount_minimum_qty").val($(temp).find(".discount_minimum_qty").text());
		$("#s_discount_price").val($(temp).find(".discount_price").text());
        $('#editDiscount').modal('show');
    });	

    $(document).on("click", ".edit_order", function () {
        var temp = $(this).parent().parent();

        $("#s_order_customer_name").val($(temp).find(".order_customer_name").text());		
		$('#s_order_product_id').attr($(temp).find(".order_product_id").text(), $(temp).find(".order_product_id").text());
		$("#s_order_quantity").val($(temp).find(".order_quantity").text());
        $('#editOrder').modal('show');
    });	
	
    $("#submit_save_product").on("click", function (event) {
        update_product_to_db();
    });

    $("#submit_save_bundle").on("click", function (event) {
        update_bundle_to_db();
    });

    $("#submit_save_discount").on("click", function (event) {
        update_discount_to_db();
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

	$("#order_company_dropdown").change(function(){
		if ($("#order_company_dropdown").prop('selectedIndex')) {
			// company selected
			company_selected = $("#order_company_dropdown").val();
			get_order_list($("#order_company_dropdown").val());	
			get_product_to_order_form($('#s_order_product_id'));
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
			message = message + "<td> Price </td>";
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
                message = message + "<td class='single_price'>" + this["price"] + "</td>"
                message = message + "<td><span class='edit_product'>Edit</span> | <span class='delete_product'>Delete</span></td>"
                message = message + "</tr>"
                $("#product_list").append(message);
            })
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

				$(result_holder).append('<option val="' + this["product_name"] + '">'+ this["product_name"] +'</option>');
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
    command["product_id"]   = $("#addProduct .modal-body #add_product_id").val();
    command["product_name"] = $("#addProduct .modal-body #add_product_name").val();
	command["price"]        = $("#addProduct .modal-body #add_price").val();

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			
			$('#addProduct').modal('hide');
			get_product_list();
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}

function add_bundle_to_db() {
	var php_command = urlstring + insert_promotion;
	var command = {};
    command["customer_name"]	= $("#addBundle .modal-body #add_bundle_customer_name").val();
    command["product_id"]		= $("#addBundle .modal-body #add_bundle_product_id").val();
    command["promo_type"]		= 'bundle';
    command["minimum_qty"]		= 0;
    command["promo_price"]		= 0;
    command["bundle_order_qty"]	= $("#addBundle .modal-body #add_bundle_qty").val();
    command["bundle_charge_qty"]= $("#addBundle .modal-body #add_bundle_charge_qty").val();
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
    command["customer_name"]	= $("#addDiscount .modal-body #add_discount_customer_name").val();
    command["product_id"]		= $("#addDiscount .modal-body #add_discount_product_id").val();
    command["promo_type"]		= 'discount';
    command["minimum_qty"]		= $("#addDiscount .modal-body #add_discount_minimum_qty").val();
    command["promo_price"]		= $("#addDiscount .modal-body #add_discount_price").val();
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
    command["customer_name"]	= $("#addOrder .modal-body #add_order_customer_name").val();
    command["product_id"]		= $("#addOrder .modal-body #add_order_product_id").val();
    command["quantity"]			= $("#addOrder .modal-body #add_order_quantity").val();

    $.ajax({
		type: "POST",
		url: php_command, data: JSON.stringify(command), cache: false, async: true, timeout: 10000,
		success: function (data) {
			// console.log(JSON.stringify(data));
			
			$('#addOrder').modal('hide');
			company_selected = $("#addOrder .modal-body #add_order_customer_name").val();
			get_customer_list();
			get_order_list(company_selected);
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
    command["price"]        = $("#editProduct .modal-body #s_price").val();

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
			message = message + "<td> Discounted Price </td>"
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
					message = message + "<td class='discount_price'>" + this["promo_price"] + "</td>"
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
			$('#order_company_dropdown').append('<option val="All">Done, Select Customer</option>');

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
			
        },
		error: function (data) {
			console.log("error [" + data + "]");
		}
    });
}
