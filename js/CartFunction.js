var cart = [];
var template;

$(document).ready(function(){
	template = $("#template").clone();
	//Check Session Storage and if there is something called item then create the list
	if (sessionStorage.getItem("items") === null) {
		$("#cart").append($("<p class='empty'>Your cart is empty</p>").html(item));
	} else {
		$("#cartTable").css('display', 'table');
		var storedItems = JSON.parse(sessionStorage.getItem("items"));
		for(var i=0; i<storedItems.length;i++){
			var newEntry = $("#template").clone();
			var item = storedItems[i];
			var ClassName = item['product'].replace(/\s/g, '');
			newEntry.find('.product_title').text(item['product']);
			newEntry.find('.product_quantity').text(item['quantity']);
			newEntry.find('.product_price').text(item['singlePrice']);
			newEntry.find('.sub_price').text(item['price']);
			newEntry.find('.product_image').attr("src",item['image']);
			newEntry.removeAttr('id');
			newEntry.addClass(ClassName);
			$("#CartContainer").append(newEntry);
			cart.push(item);
		}
	}
	CartCount();
	PriceCount();

	//Empty your entire cart and your Local Storage
	$('#clear').click(function(){
		sessionStorage.clear();
		$("#cart").empty();
		cart = [];
		$("#cart").append($("<p class='empty'>Your cart is empty</p>"));
		CartCount();
		PriceCount();
	});

});

//Adding new Items into your Cart
//It will check to see if there is already something in your cart.
//If there isn't then it will create a new entry
//If there is it will add the new quantity
$(document).on('click', '.add', function(e) {
	$("#cartTable").show();
	var image = $(this).closest(".product").find('.product_image')[0].src;
	var value = $(this).closest(".product").find('.product_title').text();
	var price = parseFloat($(this).closest(".product").find('.product_price').text()).toFixed(2);
	var quantity = 1;
	var CartItemFound = false;
	var fullprice = parseFloat(price * quantity).toFixed(2);
	
	if(cart.length !== 0){
		for(var i=0; i<cart.length; i++){
			if(cart[i]['product'] === value){
				CartItemFound = true;
				break;
			}
		}
	}

	var ClassName = value.replace(/\s/g, '');

	if(CartItemFound === true){
		//There is an exsisting entry in the array
		for(var i=0; i<cart.length; i++){
			if(cart[i]['product'] === value){
				var OldQuant = Number(cart[i]['quantity']);
				var OldPrice = parseFloat(cart[i]['price']).toFixed(2);
				var NewQuant = parseInt(OldQuant) + quantity;
				var NewPrice = Number(OldPrice) + Number(fullprice);
				var NewPrice = parseFloat(NewPrice).toFixed(2);
				cart[i]['price'] = NewPrice;
				cart[i]['quantity'] = NewQuant;
				$('.'+ClassName).find(".sub_price").text(NewPrice);
				$('.'+ClassName).find(".product_quantity").text(NewQuant);
				break;
			}
		};
		sessionStorage.setItem("items", JSON.stringify(cart));
	} else {
		//There is a new entry in the array
		cart.push({
			"product" : value ,
			"quantity" : quantity,
			"singlePrice": price,
			"price" : fullprice,
			"image": image
		});
		sessionStorage.setItem("items", JSON.stringify(cart));
		$(".empty").remove();
		var newEntry = $("#template").clone();
		newEntry.find('.product_title').text(value);
		newEntry.find('.product_quantity').text(1);
		newEntry.find('.product_price').text(price);
		newEntry.find('.sub_price').text(price);
		newEntry.removeAttr('id');
		newEntry.addClass(ClassName);
		$("#CartContainer").append(newEntry);		
	}
	CartCount();
	PriceCount();
});

//When removing a item quantity from cart
$(document).on('click', '.remove', function(e) {
	var value = $(this).closest(".product").find('.product_title').text();
	var price = parseFloat($(this).closest(".product").find('.product_price').text()).toFixed(2);
	var quantity = 1;
	var CartItemFound = false;

	//Check to see if there is an exsisting entry in sessionStorage
	if(cart.length !== 0){
		for(var i=0; i<cart.length; i++){
			if(cart[i]['product'] === value){
				CartItemFound = true;
				break;
			}
		}
	}

	if(CartItemFound === true){
		for(var i=0; i<cart.length; i++){
			if(cart[i]['product'] === value){
				var NewQuant = parseInt(cart[i]['quantity']) - quantity;
				var ClassName = cart[i]['product'].replace(/\s/g, '');
				var OldPrice = parseFloat(cart[i]['price']).toFixed(2);
				var NewPrice = Number(OldPrice) - Number(price);
				var NewPrice = parseFloat(NewPrice).toFixed(2);
				if(NewQuant > 0){
					cart[i]['quantity'] = NewQuant;
					cart[i]['price'] = NewPrice;
					
					$('.'+ClassName).find(".sub_price").text(NewPrice);
					$('.'+ClassName).find(".product_quantity").text(NewQuant);				} else {
					cart.splice(i, 1);
					$('.' + ClassName).remove();
				}
			}
		}
		sessionStorage.setItem("items", JSON.stringify(cart));
	}

	if((cart.length === 0) && ($(".empty").length == 0) ){
		sessionStorage.clear();
		$("#cartTable").hide();
		$("#CartContainer").hide();
		$("#cart").append($("<p class='empty'>Your cart is empty</p>"));
	}
	CartCount();
	PriceCount();
});

function CartCount(){
	$('.cartCount').empty();
	var Count = 0;
	var Quant;
	if(cart != null){
		for (var i = 0; i < cart.length; i++) {
			Quant = parseInt(cart[i]['quantity']);
			Count = Count += Quant;
		};
	} else {
		Count = 0;
	}
	$('.cartCount').text(Count);
}

function PriceCount(){
	$('.priceCount').empty();
	var Count = 0;
	var price;
	if(cart != null){
		for (var i = 0; i < cart.length; i++) {
			var CartPrice = parseFloat(cart[i]['price']);
			var Count = Count += CartPrice;
		};
	} else {
		Count = 0;
	}
	$('.priceCount').text(Count.toFixed(2));
}
