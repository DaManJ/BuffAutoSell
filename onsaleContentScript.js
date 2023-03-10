//this variable stores the goods that if they are in our inventory, and visible on the first page (50 items) of our seller page, will be auto-adjusted in price according to these settings
var settingsForGoodsForSale = {
		"33813" : { 
			goodId : 33813, //chroma case
			minSellPriceAsPctOfSteamMarket : 0.70, //minimum price we will sell at (percentage of steam market reference price)
			alternateMinSalePrice : 6.5 //price must also be above this absolute price (absolute, not like the percentage above)
			},
		"34987" : { 
			goodId : 34987, //gamma case 2
			minSellPriceAsPctOfSteamMarket : 0.75, //minimum price we will sell at (percentage of steam market reference price)
			alternateMinSalePrice : 4.9 //price must also be above this absolute price (absolute, not like the percentage above)
			},
		"35883" : { 
			goodId : 35883, //chroma case
			minSellPriceAsPctOfSteamMarket : 0.70, //minimum price we will sell at (percentage of steam market reference price)
			alternateMinSalePrice : 5.0 //price must also be above this absolute price (absolute, not like the percentage above)
			},
		"33820" : { 
			goodId : 33820, //chroma case 3
			minSellPriceAsPctOfSteamMarket : 0.75, //minimum price we will sell at (percentage of steam market reference price)
			alternateMinSalePrice : 5.25//price must also be above this absolute price (absolute, not like the percentage above)
			},
		"36354" : { 
			goodId : 36354, //revolver case
			minSellPriceAsPctOfSteamMarket : 0.8, //minimum price we will sell at (percentage of steam market reference price)
			alternateMinSalePrice : 5.00//price must also be above this absolute price (absolute, not like the percentage above)
			},
		"35086" : { 
			goodId : 35086, //glove case
			minSellPriceAsPctOfSteamMarket : 0.8, //minimum price we will sell at (percentage of steam market reference price)
			alternateMinSalePrice : 21//price must also be above this absolute price (absolute, not like the percentage above)
			}
};

var currentSellOrders = [];

//refresh page every 5 minutes
window.setTimeout( function() {
  window.location.reload();
}, 300000);

repriceForsaleItems();

function repriceForsaleItems() {
	
	//get the first 50 on sale items in our buff account
	$(".salable").each(function() { //our items for sale come under class 'salable'
		
		var sellOrder = {};
			sellOrder.sell_order_id = this.getAttribute("data-orderid");
			sellOrder.price = Number(this.getAttribute("data-price"));
			//calculate income after commission - when submitting sell order change request this is required
			//not sure if buff actually uses it but we should send it so our data is the same as theirs to be safe
			sellOrder.income = Math.floor((sellOrder.price * 0.975 + Number.EPSILON) * 100) / 100;
			sellOrder.has_market_min_price = false;
			sellOrder.goods_id = Number(this.getAttribute("data-goodsid"));
			sellOrder.origin_price = sellOrder.price;
			sellOrder.desc = "";
			sellOrder.cdkey_id = "";
			currentSellOrders.push(sellOrder);
	});

	//these are our current working orders
	console.log(JSON.stringify(currentSellOrders));

	var goodsProcessed = {};
	for (const sellOrder of currentSellOrders) //loops through the first 50 items we have for sale and get the depth of market on buff item sale pages
	{
		if (goodsProcessed[sellOrder.goods_id.toString()] === undefined)
		{
			goodsProcessed[sellOrder.goods_id.toString()] = {};
			var currentGood = goodsProcessed[sellOrder.goods_id.toString()];
			currentGood.goodsId = sellOrder.goods_id.toString();
			currentGood.prices = {}; //to track items for sale (how much at each price)
			
			//check first 5 item pages for prices
			for (let pageNum = 1; pageNum <= 6; pageNum++){
				$.ajax({
	                url: 'https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=' + currentGood.goodsId + '&page_num=' + pageNum + '&sort_by=default&mode=&allow_tradable_cooldown=1&_=' + Date.now(),
	                type: 'GET',
	                async: false,
	                success: function (result) {
						if (result.code == "OK")
						{
							if (result.data.goods_infos.hasOwnProperty(currentGood.goodsId)) {
								currentGood.steamPriceInRMB = Number(result.data.goods_infos[currentGood.goodsId].steam_price_cny);
							}
							for (const forSaleItem of result.data.items)
							{
								if (currentGood.prices[forSaleItem.price] === undefined){
									currentGood.prices[forSaleItem.price] = 1; //tracking number of items at each price
								}
								else{
									currentGood.prices[forSaleItem.price] += 1; //tracking number of items at each price
								}
							}
						}
	                },
	                error: function (jqXHR, textStatus, errorThrown) {
	                    console.log("Problem querying prices for goodId: " + currentGood.goodsId + " Error: " + jqXHR.status + ": " + jqXHR.responseText);
	                }
	            });
				
				
				var now = Date.now();
				var sleepTo = now + 1000;
				while (Date.now() <= sleepTo) { //wait 1 second between checking each page for prices - should replace with a set-timeout but can't be f'd with the code-mess atm
					
				}
			}
		}
	}

	console.log(JSON.stringify(goodsProcessed));

	//do we have sale settings?
	for (const goodId in settingsForGoodsForSale) {
	  	//did we get some data on this good ?
	  	if (goodsProcessed.hasOwnProperty(goodId)){
	  		var processedGoodDetails = goodsProcessed[goodId];
	  		var goodSalesConfig = settingsForGoodsForSale[goodId];
	  		
	  		//find price to sell at - ignore prices that have 15 or less items for sale as they should clear fairly quickly (we don't need to front-run these)
	  		var priceToSellAt = 0.0;
	  		for (const price in processedGoodDetails.prices) {
	  			var countAtPrice = processedGoodDetails.prices[price];
	  			if (countAtPrice > 15) {
	  				priceToSellAt = Number(price); //match best price (better not front-run as too much presure will lower price)
	  				break;
	  			}
	  		}
	  		if (priceToSellAt != 0.0)
	  		{
	  			var salePriceIsValid = true;
	  			//validation - we should not sell item when buff price is 'minSellPriceAsPctOfSteamMarket' below steam market price
	  			var minPriceToSellAtBasedOnSteamMarketPrice = processedGoodDetails.steamPriceInRMB * goodSalesConfig.minSellPriceAsPctOfSteamMarket;
	  			if (priceToSellAt < minPriceToSellAtBasedOnSteamMarketPrice){
	  				console.log("minPriceToSellAtBasedOnSteamMarketPrice validation failed. PriceToSellAt: " + priceToSellAt.toString() + " below: " + minPriceToSellAtBasedOnSteamMarketPrice.toString());
	  				salePriceIsValid = false;
	  			}
	  			  			
	  			//validation - we should also not sell items below our 'alternateMinSalePrice'
	  			if (priceToSellAt < goodSalesConfig.alternateMinSalePrice){
	  				console.log("alternateMinSalePrice validation failed. PriceToSellAt: " + priceToSellAt.toString() + " below: " + goodSalesConfig.alternateMinSalePrice.toString());
	  				salePriceIsValid = false;
	  			}
	  			
	  			//prepare to update orders
	  			var changeSellOrders = {};
				changeSellOrders.game = "csgo";
				changeSellOrders.sell_orders = [];
	  			
	  			for (const sellOrder of currentSellOrders)
		  		{
		  			if (sellOrder.goods_id.toString() === goodId) {
		  				//if calced new sales price is valid, adjust orders to the new price (only if we are not already at this price)
		  				if (sellOrder.price > priceToSellAt && salePriceIsValid) {
			  				sellOrder.price = priceToSellAt; //new price to sell at
			  				sellOrder.income = Math.floor((sellOrder.price * 0.975 + Number.EPSILON) * 100) / 100; //adjust the income per the new price
			  				changeSellOrders.sell_orders.push(sellOrder);
			  				console.log("Adjusting Order: " + JSON.stringify(sellOrder));
		  				}
		  				//we shouldn't allow any order to have a price below alternateMinSalePrice
		  				else if (sellOrder.price < goodSalesConfig.alternateMinSalePrice){
		  					sellOrder.price = goodSalesConfig.alternateMinSalePrice; //new price to sell at
			  				sellOrder.income = Math.floor((sellOrder.price * 0.975 + Number.EPSILON) * 100) / 100; //adjust the income per the new price
			  				changeSellOrders.sell_orders.push(sellOrder);
			  				console.log("Adjusting Order: " + JSON.stringify(sellOrder));
		  				}
		  			}
	  			}

	  			if (changeSellOrders.sell_orders.length > 0) //we have orders to modify
	  			{
	  				console.log("Modifying: " + changeSellOrders.sell_orders.length.toString() + " orders");
	  				
	  				$.ajax({
		                url: 'https://buff.163.com/api/market/sell_order/change',
		                type: 'POST',
		                async: false,
		                data: JSON.stringify(changeSellOrders),
		                contentType: "application/json",
		                //xhrFields: { withCredentials: true },
		                beforeSend: function(xhr) {
    						xhr.setRequestHeader('X-CSRFToken', $.cookie("csrf_token"));
  						},
		                success: function (data) {
		                    console.log(JSON.stringify(data));
		                    console.log("Successfully changed items for sale for goodId: " + goodId);
		                },
		                error: function (jqXHR, textStatus, errorThrown) {
		                    console.log("Problem changing items for sale for goodId: " + goodId + " Error: " + jqXHR.status + ": " + jqXHR.responseText);
		                }
	            	});
	  			}
	  			
	  		}
		}
	}
}
