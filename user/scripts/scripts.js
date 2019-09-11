(function() {
/* globals $ */
var scriptSrc = document.currentScript.src;
var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
var packageId = re.exec(scriptSrc.toLowerCase())[1];
var customFieldPrefix = packageId.replace(/-/g, "");
const HOST = window.location.host;
var urls = window.location.href.toLowerCase();
var willCreate =  0;
var moqFieldId, moqFieldCode, packageCustomFields, statusFieldId, statusFieldCode;
var moq;
var moqItemDtl = "1";
var moqCartItem = {};
var getcurrencyCode;
var rrpStatus;
var rrpValue;
var $itemguid;
  getCurrBase();
const formatter = new Intl.NumberFormat('en-US', {
  //style: 'currency',
  //currency:  $('#currencyCode').val(), //getcurrencyCode,
  minimumFractionDigits: 2
})
function getMarketplaceCustomFields(callback) {
    var apiUrl = '/api/v2/marketplaces'
    $.ajax({
        url: apiUrl,
        method: 'GET',
        contentType: 'application/json',
        success: function(result) {
            if (result) {
                callback(result.CustomFields);
            }
        }
    });
}
function getCurrBase(){
	var settings = {
	  'async': false,
	  'crossDomain': true,
	  'url': '//' + HOST + '/api/v2/marketplaces',
	  'method': 'GET',
	  'success': function (response) {
    getcurrencyCode = response.CurrencyCode;
    console.log('currency code ' + getcurrencyCode);
	  }
	};
	$.ajax(settings);
}

function waitForElement(elementPath, callBack){
	window.setTimeout(function(){
	if($(elementPath).length){
			callBack(elementPath, $(elementPath));
	}else{
			waitForElement(elementPath, callBack);
	}
	},500)
}

function alterCustomField(cond){
	if ($('input[type=checkbox]').prop("checked") == cond){
		waitForElement('#customFields',function(){
			var rrpInputField =  $('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
			var rrpLabel = $("#customFields").find("label");
			rrpLabel.addClass('rrplabel');
			rrpLabel.addClass('itmupld-srvcs-duration-specify label-title');
			$('.itmupld-srvcs-durationlst-sec .itmupld-srvcs-duration-specify .label-title span').after(rrpLabel);
			var div1 = document.createElement("div");
			div1.setAttribute('id','cfbox');
			$('#cfbox').addClass('itmupld-srvcs-duration-specify');
			var custom = $('#customFields');
			custom.addClass('itmupld-srvcs-specify');
			custom.removeClass('item-form-group');
			$('.itmupld-srvcs-priceunit').after(div1);
			custom.prependTo(div1);
			rrpInputField.addClass('numbersOnlyD non-zero service-price-placeholder');								
		});
 	};
}

function wrap(object, method, wrapper) {
	var arr = []
	var events = $._data(object[0], 'events')
	if(events[method] && events[method].length > 0){ // add all functions to array
	  events[method].forEach(function(obj){
		arr.push(obj.handler)
	  })
	}
	
	if(arr.length){
		function processAll(){ // process all original functions in the right order
		  arr.forEach(function(func){
			func.call(object)
		  })
		}
	
		object.off(method).on(method, function(e){wrapper.call(object,processAll)}) //unregister previous events and call new method passing old methods
	}
	
}
  
$(document).ready(function () {

	getMarketplaceCustomFields(function(result) {
		$.each(result, function(index, cf) {
			if (cf.Name == 'RRP Status' && cf.Code.startsWith(customFieldPrefix)) {
				code = cf.Code;
				rrpStatus = cf.Values[0];
				if (rrpStatus == 'true') {
					if ( $('#maketplace-type').val() == 'spacetime') {
						if(urls.indexOf('user/item/upload') >= 0) {
							willCreate = 1;}
							if (document.body.className.includes('page-seller')) {		
								if (willCreate == 1 ){
									$('input[type="checkbox"]').click(function(){
										waitForElement('#customFields',function(){
											if ($('.itmupld-srvcs-duration-specify').find('#cfbox').length == 0) { 
												var rrpInputField =  $('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
												rrpInputField.addClass('rrpprice');
												var rrpLabel = $('#customFields label:contains("ORIGINAL PRICE (BEFORE DISCOUNT)")');
												rrpLabel.addClass('rrplabel');
												rrpLabel.addClass('itmupld-srvcs-duration-specify label-title');
												rrpLabel.appendTo('.itmupld-srvcs-durationlst-sec .itmupld-srvcs-duration-specify .label-title span');
												var div1 = document.createElement("div");
												div1.setAttribute('id','cfbox');
												$('#cfbox').addClass('itmupld-srvcs-duration-specify');
											    var custom = $('#customFields');
												$('.itmupld-srvcs-priceunit').after(div1);
											   	custom.clone().prependTo(div1);
											  	$('.rrplabel').text('Original Price (Before discount)');
											   
                                                 
											   $('#cfbox .col-md-6 input:not(.rrpprice)').remove();
											   $('#cfbox .col-md-6').not($('input').parent()).hide();
													
											   var rrpinputvalue = $('#cfbox .rrpprice input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val();
											   //hide the customfield in the customfield section
											  
												$('#cfbox  .rrpprice').change(function() {
													$('#add-item-area-custom-fields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val($(this).val());
													
												});

												 $('#basic_details .btn-tab-validate').click(function() {
													var rrpInputField2 =  $('#add-item-area-custom-fields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
													rrpInputField2.parent(".col-md-6").hide();
													
												});
												//validate to input only numeric in rrp textfield
												$('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').keyup(function() {
													var $input = $(this);
													$input.val($input.val().replace(/[^\d]+/g,''));
												});
											}
										});
										 
									}); 

							 }
							 else {
									waitForElement('#customFields',function(){
										var rrpInputField =  $('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
										rrpInputField.addClass('rrpprice');
										var rrpLabel = $('#customFields label:contains("ORIGINAL PRICE (BEFORE DISCOUNT)")');
										rrpLabel.addClass('rrplabel');
										rrpLabel.addClass('itmupld-srvcs-duration-specify label-title');
										rrpLabel.appendTo('.itmupld-srvcs-durationlst-sec .itmupld-srvcs-duration-specify .label-title span');
										var div1 = document.createElement("div");
										div1.setAttribute('id','cfbox');
										$('#cfbox').addClass('itmupld-srvcs-duration-specify');
									    var custom = $('#customFields');
									    $('.itmupld-srvcs-priceunit').after(div1);
									    custom.clone().prependTo(div1);
									    $('.rrplabel').text('Original Price (Before discount)');
										$('#cfbox .col-md-6 input:not(.rrpprice)').remove();
										$('#cfbox .col-md-6').not($('input').parent()).hide();
											
									   var rrpinputvalue = $('#cfbox .rrpprice input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val();
										//hide the customfield in the customfield section
										var rrpInputField2 =  $('#add-item-area-custom-fields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
										rrpInputField2.parent(".col-md-6").hide();

										$('#cfbox  .rrpprice').change(function() {
											$('#add-item-area-custom-fields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val($(this).val());
											console.log($(this).val());
										});

										 $('#tab-additional active .btn-tab-validate').click(function() {
											$('#add-item-area-custom-fields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val(rrpinputvalue);
											console.log(rrpinputvalue);

										});
										//validate to input only numeric in rrp textfield
										$('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').keyup(function() {
											var $input = $(this);
											$input.val($input.val().replace(/[^\d]+/g,''));
										});
											//parse value to 2 decimals
										$('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').blur(function() {
											if($('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val() == ''){
												console.log('null value');
											}else{
												var $input = $(this);
												var price =  $input.val();
												var pfloat = parseFloat(price).toFixed(2)
												$input.val(pfloat);
											}
										});
								   });

								}
								
							}
							//item detail page
							if (document.body.className.includes('item-details')) {
								var $this = $(this);
								var bpItemID = $("#itemGuid").val();
								getMinimumOrderQuantityValue(bpItemID, $this);
							}
							//home page
							if (document.body.className.includes('page-home')) {
						   //spacetime
								waitForElement('.section-shop .shop-box' ,function(){
									var called = [];
									var isthere; 
									var num;
									$(".page-home .section-shop .shop-box").each(function(){
										$(".page-home .section-shop .shop-box a").addClass("get-item-id");
										console.log('show box 3');
										$(".get-item-id").each(function(){
											var $this = $(this);
											num =  $this.attr("data-guid");
											isthere = called.includes(num);
											if (isthere)  {
												}
											else {
												getMinimumOrderQuantityValue(num, $this);
												called.push(num);
												}
										});
									});
								});
							};
								//SEARCH PAGE
							if($(".page-search .storefront-items").length){
									storeFrontPage3();
									//searching
								$(function(){
									$('#go-search').click(function () {  });
									var $button = $('#go-search').click(function () {  });
									wrap($button, 'click', function (click,e) {
										click()
										storeFrontPage3();
									});
								})
								$(function(){
									$('#sortby').change(function () { console.log('original function 1') });
									var $select = $('#sortby').change(function () { console.log('') });
									wrap($select, 'change', function (change,e) {
										change()
										storeFrontPage3();
									});
								})

							}
							if($(".page-search #items-list").length){
								$(function(){
									$('#item-sort').change(function () { console.log('original function 1') });
									var $select = $('#item-sort').change(function () { console.log('') });
									wrap($select, 'change', function (change,e) {
										change()
										storeFrontPage3();
									});

								})

								
								storeFrontPage3();
							}

								
					}	 

             //BESPOKE
					if($('#maketplace-type').val() == 'bespoke') {
						if (document.body.className.includes('item-detail-page')) {
							var $this = $(this);
							var bpItemID = $(".item-detail-page #itemGuid").val(); 
							getMinimumOrderQuantityValue(bpItemID, $this);
						}
						if($(".page-search .storefront-items").length){
							storeFrontPage2();
							$(function(){
								$('#go-search').click(function () { console.log('') });
								var $button = $('#go-search').click(function () { console.log('') });
									wrap($button, 'click', function (click,e) {
										click()
										storeFrontPage2();
									});
							})

							$(function(){
								$('#sortby').change(function () { console.log('original function 1') });
								var $select = $('#sortby').change(function () { console.log('') });
								wrap($select, 'change', function (change,e) {
									change()
									storeFrontPage2();
								});

							})
						}
									
						if($(".page-search #items-list").length){
							storeFrontPage2();
							$(function(){
								$('#item-sort').change(function () { console.log('') });
								var $select = $('#item-sort').change(function () { console.log('') });
								wrap($select, 'change', function (change,e) {
									change()
									storeFrontPage2();
								});

							})  
							$(function(){
								$('#apply-filter').click(function () { console.log('') });
								var $select = $('#apply-filter').click(function () { console.log('') });
								wrap($select, 'click', function (click,e) {
									click()
									storeFrontPage2();
								});

							})
								//reset button
							$(function(){
								$('#reset-filter').click(function () { console.log('') });
								var $select = $('#reset-filter').click(function () { console.log('') });
								wrap($select, 'click', function (click,e) {
									click();
									storeFrontPage2();
								});

							})
						}

							if (document.body.className.includes('page-home')) {
									$('.section-shop .container .row').attr('id', 'items-lists');
									waitForElement('.section-shop .shop-box',function(){
										var called = [];
										var isthere; 
										var num;
										$(".page-home .section-shop .shop-box").each(function(){
											$(this).parent("a").addClass("get-item-id");
											$(".get-item-id").each(function(){
												var $this = $(this);
												num =  $this.attr("data-guid");
												isthere = called.includes(num);
												if (isthere) {
												}else {
													getMinimumOrderQuantityValue(num, $this);
													called.push(num);
												}
											});
										
										});
									});
								}
								

							if (document.body.className.includes('page-seller')) {
									ready('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]', function(element) {
										if ($('.un-inputs').find('.rrp-input-cont').length == 0) { 
											var skuInputField =  $('input[id="item-sku"]');
											skuInputField.parents(".item-form-group").addClass("rrp-input-cont");
											var rrpInputField =  $('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
												if (!rrpInputField.val() == ""){
													var rrpVal = rrpInputField.val();
													var newRRPval = formatter.format(rrpVal); 
													rrpInputField.val(newRRPval);
												}
											rrpInputField.parent(".col-md-6").insertAfter(".rrp-input-cont > .col-md-6");
										}
										var rrpInputField2 =  $('#customFields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
										rrpInputField2.parent(".col-md-6").hide();
										$('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').keyup(function() {
											var $input = $(this);
											$input.val($input.val().replace(/[^0-9\.]/g, ''));
											parseFloat($input).toFixed(2);
										});
									
										$('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').blur(function() {
											if ($('input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]').val() == ''){
											}else{
											var $input = $(this);
											var price =  $input.val();
											var pfloat = parseFloat(price).toFixed(2)
											$input.val(pfloat);
											}
										});

									});
							}
					}  
				}
				else {
					if(urls.indexOf('user/item/upload') >= 0) {
						$('input[type="checkbox"]').click(function(){
						if ($('.un-inputs').find('.rrp-input-cont').length == 0) { 
						var rrpInputField2 =  $('#customFields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
						rrpInputField2.parent(".col-md-6").hide();
						}
					
					});
					}
					//spacetime
					$('input[type="checkbox"]').click(function(){	
						if ($('.itmupld-srvcs-duration-specify').find('#cfbox').length == 0) { 
						var rrpInputField2 =  $('#add-item-area-custom-fields input[data-name="ORIGINAL PRICE (BEFORE DISCOUNT)"]');
						rrpInputField2.parent(".col-md-6").hide();
						}	
					});	
				}
			}	
		})
	});

});

function storeFrontPage(){
	var targetNode = document.getElementById('items-list');
	var config = { attributes: true, childList: true };
	var callback = function(mutationsList) {
		for(var mutation of mutationsList) {
			if (mutation.type == 'childList') {
				mutation.addedNodes.forEach(function(m){
				  if (m.classList.contains('item-box')) {
						var link = $(this).attr('data-guid');
						$(this).find('.item-price a').attr("items-guid",link);
						$itemguid = $('#items-list .item-box');
					 	 $(m).each(function(){
							$(this).find(".item-price > a").addClass("get-item-id");
							$(".get-item-id").each(function(){
								$this = $(this);
								var num =  $(this).attr("items-guid");
								getMinimumOrderQuantityValue(num, $this);
							});
					   });
					} 
				}); 
				
			}
		}
	}
	var observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}

function storeFrontPage2(){ 
	waitForElement('.item-list-section #items-list .item-box',function(){
		var called = [];
		var isthere; 
		var num;
		$(".page-search #items-list .item-box").each(function(){
			$(this).find(".item-price > a").addClass("get-item-id");
			var link = $(this).attr('data-guid');
			$(this).find('.item-price a').attr("items-guid",link);
			$itemguid = $('#items-list .item-box');
			$(".get-item-id").each(function(){
				var $this = $(this);
				num =  $(this).attr("items-guid");
				isthere = called.includes(num);
					if (isthere)  {
				}else {
					getMinimumOrderQuantityValue(num, $this);
					called.push(num);
				
				}
			});
		});
	});
};


function storeFrontPage3(){
	waitForElement('.item-list-section .item-box',function(){
		var called = [];
		var isthere; 
		var num;
		$(".page-search .item-list-section .item-box").each(function(){

			$(".page-search .item-list-section .item-box a").addClass("get-item-id");

			var link = $(this).attr('data-guid');
			$(this).find('.item-price a').attr("items-guid",link);
			$itemguid = $('#items-list .item-box');
			$(".get-item-id").each(function(){
				var $this = $(this);
				num =  $(this).attr("items-guid");
				isthere = called.includes(num);
				 if (isthere)  {
				}else {
					getMinimumOrderQuantityValue(num, $this);
					called.push(num);	
				}
			});
		});
	});
};

 function getMinimumOrderQuantityValue (itemId, $this) {
    var settings = {
		'async': true,
		'crossDomain': true,
		'url': '//' + HOST + '/api/v2/items/'+itemId,
		'method': 'GET',
		'success': function (response) {
			$.each(response.CustomFields, function(index, cf) {
				if (cf.Name == 'ORIGINAL PRICE (BEFORE DISCOUNT)') {
						rrpValue = cf.Values[0];       
						if (rrpValue != null)  {
							rrpValue = cf.Values[0];  
						}else {	rrpValue = ''; 
						 }                    
					if( $('#maketplace-type').val() == 'bespoke'){
						if (document.body.className.includes('page-home')) {
								var $elementRRPContainer = document.createElement('div'); 
								$elementRRPContainer.setAttribute('class', 'rrp-container multi-currency-val'); 
								$this.find(".shopimg-preview").append($elementRRPContainer);
								getCustomFieldInfo($this, getcurrencyCode, rrpValue, response)
								
								var $elementItemPriceContainer = document.createElement('div'); 
								$elementItemPriceContainer.setAttribute('class', 'item-price-containers'); 
								$this.find(".item-price-containers, .rrp-container1").wrapAll($elementItemPriceContainer);
								$this.find(".rrp-container").appendTo($this.find(".item-price"));				 
				 	}}
						
					if( $('#maketplace-type').val() == 'spacetime'){
						if (document.body.className.includes('page-home')){
								var $elementRRPContainer = document.createElement('div'); 
								$elementRRPContainer.setAttribute('class', 'rrp-container multi-currency-val'); 
								$this.find(".shopimg-preview").append($elementRRPContainer);
								getCustomFieldInfo($this, getcurrencyCode, rrpValue, response)
								
								var $elementItemPriceContainer = document.createElement('div'); 
								$elementItemPriceContainer.setAttribute('class', 'item-price-containers'); 
								$this.find(".item-price-containers, .rrp-container").wrapAll($elementItemPriceContainer);
								$this.find(".rrp-container").prependTo($this.find(".item-price"));
								$this.find(".rrp-container").css('margin-right', 2 +'px');	
						 } 

					 //search page
						if (document.body.className.includes('page-search')) {
								var $elementRRPContainer = document.createElement('del'); 
								$elementRRPContainer.setAttribute('class', 'rrp-container multi-currency-val'); 
								$this.find(".shopimg-preview").append($elementRRPContainer);
								$this.parent(".item-price").prepend($elementRRPContainer); 	
								getCustomFieldInfo($this, getcurrencyCode, rrpValue, response)
								var $elementItemPriceContainer = document.createElement('div'); 
								$elementItemPriceContainer.setAttribute('class', 'item-price-container'); 
								$this.find(".item-price, .rrp-container").wrapAll($elementItemPriceContainer);
								$this.find(".rrp-container").insertBefore($this.find(".item-price"));
						 }

						if (document.body.className.includes('item-details')) {
								var pricecontainer =  document.createElement('div');
								pricecontainer.setAttribute('class', 'itemPrice');
								pricecontainer.setAttribute('id','pricecontainer');
								var pricelabel = document.createElement('del');
								pricelabel.setAttribute('id','beforeprice2');
								var rrpValueSet =  $('#currencyCode').val()  + ' ' + formatter.format(rrpValue); 
								pricelabel.innerText =  rrpValueSet;
								$('.itemPrice h4').before(pricelabel);
								$('#pricecontainer').css('height', 57+'px');
								$('.itemPrice h4').css('display','inline-block');
								$('.item-description .desc-sec-opt:contains("ORIGINAL PRICE (BEFORE DISCOUNT)")').css({display: "none"});
						}

					} 

					if (document.body.className.includes('item-detail-page')) {
						var pricelabel = document.createElement('del');
						pricelabel.setAttribute('id','beforeprice');
					
						if(rrpValue == null){
							pricelabel.innerText = '';
							$('.item-price-text').css('color','#000');
						}else{
							var rrpValueSet	=  formatter.format(rrpValue); 
							pricelabel.innerText =  $('#currencyCode').val()  + ' ' + formatter.format(rrpValue); 
							$('.item-price-text').css('color','red');
						}
						$('#itemDetailPrice').after(pricelabel);

						//hide the customfield
						 var rrpdesc = $('.item-description span:contains("ORIGINAL PRICE (BEFORE DISCOUNT)")');
						 rrpdesc.parent(".desc-sec-opt").hide();
						$(".item-description span:has('ORIGINAL PRICE (BEFORE DISCOUNT)') .desc-sec-opt").hide();
					}

					if( $('#maketplace-type').val() == 'bespoke'){
					
					//search page
					
					if (document.body.className.includes('page-search')) {
						var $elementRRPContainer = document.createElement('span'); 
						$elementRRPContainer.setAttribute('class', 'rrp-container multi-currency-val'); 
						$this.find(".shopimg-preview").append($elementRRPContainer);
						$this.parent(".item-price").append($elementRRPContainer);
						// $this.find(".item-price .rrp-container").css('color','#999');
						$(".item-price:has(.rrp-container)").css("color", "#999");	
						getCustomFieldInfo($this, getcurrencyCode, rrpValue, response)

						var $elementItemPriceContainer = document.createElement('div'); 
						$elementItemPriceContainer.setAttribute('class', 'item-price-container'); 
						$this.find(".item-price, .rrp-container").wrapAll($elementItemPriceContainer);
						$this.find(".rrp-container").insertBefore($this.find(".item-price"));

						$(".item-price:has(span) .get-item-id").css("color", "red");
					}
				}	
			}
		});	
     }
	};
    $.ajax(settings);
}
  
function setMOQItemDtl (value) {
	moqItemDtl = value;
}


function getCustomFieldInfo($this, getcurrencyCode, rrpValue, response){
	  var rrpValueSet	=  formatter.format(rrpValue);
	  var $elementRRPCurrency = document.createElement('span'); 
	  $elementRRPCurrency.setAttribute('class', 'p-currency'); 
	  $elementRRPCurrency.innerHTML = $('#currencyCode').val() + '  ' ;
	  $this.find(".rrp-container").append($elementRRPCurrency);  

	  if($this.parent(".item-price").find(".multi-currency-val").find(".p-currency").length == 0){
		  $this.parent(".item-price").find(".rrp-container").append($elementRRPCurrency); 	
	  }
							
	  var $elementRRPPrice = document.createElement('span'); 
	  $elementRRPPrice.setAttribute('class', 'p-price'); 
	  $elementRRPPrice.setAttribute('set-value', rrpValueSet); 
	  $elementRRPPrice.innerHTML = rrpValueSet;
	  $this.find(".rrp-container").append($elementRRPPrice);	
	  if($this.parent(".item-price").find(".multi-currency-val").find(".p-price").length == 0){
		$this.parent(".item-price").find(".rrp-container").append($elementRRPPrice); 	
	  }
	
}

function getCustomFieldInfoHomePage($this, getcurrencyCode, rrpValue, response){
	 var rrpValueSet = formatter.format(rrpValue); //parseFloat(rrpValue).toFixed(2);
	  var $elementRRPCurrency = document.createElement('span'); 
	  $elementRRPCurrency.setAttribute('class', 'p-currency'); 
	  $elementRRPCurrency.innerHTML = $('#currencyCode').val();
	  

	  if($this.find(".multi-currency-val").find(".p-currency").length == 0){
		  $this.find(".rrp-container").append($elementRRPCurrency);  
	 }
							
	  var $elementRRPPrice = document.createElement('span'); 
	  $elementRRPPrice.setAttribute('class', 'p-price'); 
	  $elementRRPPrice.setAttribute('set-value', rrpValueSet); 
	  $elementRRPPrice.innerHTML = rrpValueSet;
	  
	  
	  if($this.find(".multi-currency-val").find(".p-price").length == 0){
		$this.find(".rrp-container").append($elementRRPPrice);	
	  }
}
(function(win) {
	'use strict';
	var listeners = [], 
	doc = win.document, 
	MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
	observer;
	
	function ready(selector, fn) {
		// Store the selector and callback to be monitored
		listeners.push({
			selector: selector,
			fn: fn
		});
		if (!observer) {
			// Watch for changes in the document
			observer = new MutationObserver(check);
			observer.observe(doc.documentElement, {
				childList: true,
				subtree: true
			});
		}
		// Check if the element is currently in the DOM
		check();
	}
		
	function check() {
		// Check the DOM for elements matching a stored selector
		for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
			listener = listeners[i];
			// Query for elements matching the specified selector
			elements = doc.querySelectorAll(listener.selector);
			for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
				element = elements[j];
				// Make sure the callback isn't invoked with the 
				// same element more than once
				if (!element.ready) {
					element.ready = true;
					// Invoke the callback with the element
					listener.fn.call(element, element);
				}
			}
		}
	}

	// Expose `ready`
	win.ready = ready;
			
})(this);

})();