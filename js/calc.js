var sort_pops = false;
var sort_price = false;

function show_cdn_plan_notes(cdn_name, plan_name, extra, lastline ) {
	lastline = (typeof lastline === "undefined") ? '' : lastline;
	$("#traffic_info tr:contains("+cdn_name+") td").eq(3).html(plan_name + ((extra > 0) ? (' + extra $' + extra + ' ') : '') + lastline);
}
function plan_calc(trange, cdn_name) {
	var traf = $("#traffic_volume").val();
	var result = 0;
	var last_excessPrice = 0;
	/*var recomm_html = ' <span id="recommended">Recommended!</span>';*/
	var recomm_html = '';
	$.each(trange, function(index) {
		if (traf <= this.included) {
			result = this.price ;
			$("#traffic_info tr:contains("+cdn_name+") td").eq(3).html(this.name + ((cdn_name == 'MaxCDN') ? recomm_html : ''));
			return false;
		}
		else {
			$("#traffic_info tr:contains("+cdn_name+") td").eq(3).html(this.name + ((cdn_name == 'MaxCDN') ?recomm_html : ''));
			var traf_excess = traf - this.included;
			var next_plan = trange[index+1];
			if (typeof next_plan !== "undefined" 
					&& traf < next_plan.included 
					&& traf_excess * this.excessPrice + this.price < next_plan.price) {
				result = traf_excess * this.excessPrice + this.price ;
				 
				show_cdn_plan_notes(cdn_name,this.name,Math.round(traf_excess * this.excessPrice) 
					, (cdn_name == 'MaxCDN') ? recomm_html : '' );
				return false;
			}
			else {
				result = traf_excess * this.excessPrice + this.price;
				show_cdn_plan_notes(cdn_name,this.name,Math.round(traf_excess * this.excessPrice)
				, (cdn_name == 'MaxCDN') ? recomm_html : '' ); 
			}
		}
		last_excessPrice = this.excessPrice;
	});
	result = result ? result : Math.round(traf * last_excessPrice);
	$("#traffic_info tr:contains("+cdn_name+") td:last").html('$' + Math.round(result));
}

function calculate_total() {
	var total = 0;
	var continents = [ {name:'US'},{name:'SA'},{name:'EU'},{name:'AU'},{name:'AS'},{name:'AF'},{name:'RU'}];
			$.each(continents, function () {
				$('#traff'+this.name).val($('#traff'+this.name).val().replace(/\D+/g,''));
				if ($('#traff'+this.name).val() == '') $('#traff'+this.name).val(0);
				total += parseInt($('#traff'+this.name).val());
			});
			if (total != 100) {
				$.each(continents, function () {
					$('#traff'+this.name).parent().removeClass('has-success');
					$('#traff'+this.name).parent().addClass('has-error');
				});
			}
			else {
				$.each(continents, function () {
					$('#traff'+this.name).parent().removeClass('has-error');
					$('#traff'+this.name).parent().addClass('has-success');
				});
			}
	return total;		
}
var 
	continents_codes = {'US':'USA','SA':'South America','EU':'Europe','AU':'Australia','AS':'Asia','AF':'Africa'};
var 
	plans = {
		Cachefly: function () {
			var trange = [ 
				{name:'Plus',     price:  99, included:  256, excessPrice: 0.37 },
				{name:'Premium',  price: 299, included: 1200, excessPrice: 0.25 }, 
				{name:'Platinum', price: 409, included: 2048, excessPrice: 0.20 } ];
			plan_calc(trange, "CacheFly");
		},
		BandwidthHog: function (){
			var trange = [ 
				{name:'100TB',   price:  989, included:  100000, excessPrice: 0.01 },
				{name:'1PB',  price: 7999, included: 1000000, excessPrice: 0.007 }, 
				{name:'5PB', price: 24980, included: 5000000, excessPrice: 0.005 } ];
			plan_calc(trange, "BandwidthHog");
		},
		MaxCDN: function () {
			var trange = [ 
				{name:'100GB', price:9, included:   100, excessPrice: 0.08 },
				{name:'500GB', price:39, included:   500, excessPrice: 0.07 }, 
				{name:'1TB',  price:79, included:  1000, excessPrice: 0.06 },
				{name:'5TB',  price:299, included: 5000, excessPrice: 0.055 },
				{name:'10TB', price:499, included: 10000, excessPrice: 0.05 },
				{name:'50TB', price:2560, included: 50000, excessPrice: 0.045 },
				{name:'150TB', price:6144, included: 150000, excessPrice: 0.04 },
				{name:'350TB',price:12544, included: 350000, excessPrice: 0.035 } ];
			plan_calc(trange, "MaxCDN");
		},

        CDNNOW: function () {
            var us, eu, note;
            var traf = $("#traffic_volume").val();
			var result = 0;
            switch( true )
            {
                case traf < 10240:
                    eu = Math.ceil(traf * 0.089);
                    us = Math.ceil(traf * 0.105);
                    note = 'Europe, Asia - ' + eu + '$' + '<br>' +
                        'USA, South America - ' + us + '$';
                    break;

                case traf >= 10240 && traf < 51200:
                    eu = Math.ceil(traf * 0.072);
                    us = Math.ceil(traf * 0.089);
                    note = 'Europe, Asia - ' + eu + '$' + '<br>' +
                        'USA, South America - ' + us + '$';
                    break;

                case traf >= 51200 && traf < 102400:
                    eu = Math.ceil(traf * 0.064);
                    us = Math.ceil(traf * 0.080);
                    note = 'Europe, Asia - ' + eu + '$' + '<br>' +
                        'USA, South America - ' + us + '$';
                    break;

                case traf >= 102400:
                    eu = Math.ceil(traf * 0.056);
                    us = Math.ceil(traf * 0.072);
                    note = 'Europe, Asia - ' + eu + '$' + '<br>' +
                        'USA, South America - ' + us + '$';
                    break;

            }

			result = us + eu;
            show_cdn_plan_notes("CDNNOW", note);
            $("#traffic_info tr:contains(CDNNOW) td:last").html('$' + result);
        },
		
		MtProCDN: function () {
			var traf = $("#traffic_volume").val();
			var result = 0;
			if (traf <= 200) {
				result = 20;
				show_cdn_plan_notes("ProCDN","Default Plan");
			}
			else if(traf <= 10240) {
				result = 20 + (traf-200)*0.15;
				show_cdn_plan_notes("ProCDN","Default Plan",Math.round((traf-200)*0.15));
			}
			else {
				result = 20 + (traf-200)*0.10;
				show_cdn_plan_notes("ProCDN","Default Plan",Math.round((traf-200)*0.15));
			}
			result = Math.round(result);
			$("#traffic_info tr:contains(ProCDN) td:last").html('$' + result);
		},
		
		KeyCDN: function () {
			var traf = $("#traffic_volume").val();
			var result = 0; 
			var total = 0;
			total = calculate_total();
			var matrix = [
                {traffic: 0, volume: 10000, prices:[{continents:['US','EU'],price: 0.04},{continents:['AU','AS'],price: 0.04}]},
                {traffic: 10000, volume: 40000, prices:[{continents:['US','EU'],price: 0.036},{continents:['AU','AS'],price: 0.04}]},
                {traffic: 50000, volume: 100000, prices:[{continents:['US','EU'],price: 0.032},{continents:['AU','AS'],price: 0.04}]},
                {traffic: 150000, volume: 350000, prices:[{continents:['US','EU'],price: 0.028},{continents:['AU','AS'],price: 0.04}]},
                {traffic: 500000, volume: 350000, prices:[{continents:['US','EU'],price: 0.02},{continents:['AU','AS'],price: 0.04}]},
                {traffic: 1000000, volume: 20000000, prices:[{continents:['US','EU'],price: 0.01},{continents:['AU','AS'],price: 0.04}]},
			];
			
			$.each(matrix, function (index) {
                var vtraffic = 0;
				if (traf > this.traffic) {
                    if (traf <= (this.traffic+this.volume)) {
                        vtraffic = traf-this.traffic;
                    } else {
                        vtraffic = this.volume;
                    }
					$.each(this.prices, function (){
						var vprice = this.price;
						$.each(this.continents, function (){
							result += vtraffic * ($('#traff'+this ).val()) * vprice / total ;
						});
					});
				}
			});
			show_cdn_plan_notes("KeyCDN","Default Plan");
			result = Math.ceil(result);
			$("#traffic_info tr:contains(KeyCDN) td:last").html('$' + result);
		},
        
		CDNify: function () {
			var trange = [ 
				{name:'Micro', price:10, included:   150, excessPrice: 0.07 },
				{name:'Developer', price:30, included:   500, excessPrice: 0.06 }, 
				{name:'Startup',  price:60, included:  1000, excessPrice: 0.05 },
				{name:'Agency',  price:100, included: 2000, excessPrice: 0.05 },
				{name:'Enterprise', price:250, included: 5000, excessPrice: 0.05 },
				{name:'Enterprise 10', price:500, included: 10000, excessPrice: 0.05 },
				{name:'Enterprise 20', price:1000, included: 20000, excessPrice: 0.04 },
				{name:'Enterprise 50',price:2000, included: 50000, excessPrice: 0.04 } ];
			plan_calc(trange, "CDNify");
		},
		
		Akamai: function () {
			var traf = $("#traffic_volume").val();
			var result = Math.ceil(traf * 0.15);
			$.each([ [1000, 100], [2500, 250], [5000, 500], [10000, 900], [100000, 8000] ], function(index) {
				if (traf <=  this[0]) {
					result = this[1];
					return false;
				}
			});
			$("#traffic_info tr:contains(Akamai) td:last").html('$' + result);
		},
		
		SoftlayerCDN: function () {
			var traf = $("#traffic_volume").val();
			var result = Math.ceil(  ($("#traffProtocolHTTP:checked").val() ? (traf * 0.12) : 0) +  ($("#traffProtocolHTTPS:checked").val() ? (traf * 0.15) : 0) );
			$("#traffic_info tr:contains(Layer) td:last").html('$' + result);
			show_cdn_plan_notes("Layer","Origin Pull Solution");
		},
		
		GoGridCDN: function () {
			var traf = $("#traffic_volume").val();
			var result = 0; 
			var total = 0;
			total = calculate_total();
			var continents = [ {name:'US',price:0.3},{name:'SA',price:0.3},{name:'EU',price:0.3},{name:'AU',price:0.8},{name:'AS',price:0.8} ];
			var note = '', us_cost=0, as_cost=0;
			$.each(continents, function () {
				result += traf * ($('#traff'+this.name).val()) * this.price / total;
				if ($.inArray(this.name, ['US','SA','EU']) != -1) {
					us_cost += (traf * $('#traff'+this.name).val() * this.price) / total;
				}
				if ($.inArray(this.name, ['AS','AU']) != -1) {
					as_cost += (traf * $('#traff'+this.name).val() * this.price) / total;
				}
			});
			note += 'Global $' + Math.ceil(us_cost) + '<br>';
			note += 'Asia+Australia $' + Math.ceil(as_cost)+'';
			result = Math.ceil(result);
			$("#traffic_info tr:contains(GoGrid) td:last").html('$' + result);
			show_cdn_plan_notes("GoGrid",note);
		},
		
		CDN77: function () {
			var traf = $("#traffic_volume").val();
			var result = 0; 
			var  note = '', total = 0;
			total = calculate_total();
			var matrix = [
				{traffic:   30000, prices: [{continents: ['US','EU'], price: 0.049}, {continents: ['AS','AF'], price: 0.125}, {continents: ['SA'], price: 0.185}]},
				{traffic:  100000, prices: [{continents: ['US','EU'], price: 0.045}, {continents: ['AS','AF'], price: 0.120}, {continents: ['SA'], price: 0.160}]},
				{traffic:  400000, prices: [{continents: ['US','EU'], price: 0.030}, {continents: ['AS','AF'], price: 0.100}, {continents: ['SA'], price: 0.135}]},
				{traffic: 1000000, prices: [{continents: ['US','EU'], price: 0.025}, {continents: ['AS','AF'], price: 0.085}, {continents: ['SA'], price: 0.110}]},
				{traffic:      -1, prices: [{continents: ['US','EU'], price: 0.019}, {continents: ['AS','AF'], price: 0.070}, {continents: ['SA'], price: 0.095}]}
			];
			$.each(matrix, function (index) {
				if (traf <= this.traffic || index == matrix.length-1) {
					$.each(this.prices, function (){
						var cprice = this.price;
						var group_money = 0;
						var group_note = '';
						var this_continents = this.continents;
						$.each(this.continents, function (ci){
							result += traf * ($('#traff'+this ).val()) * cprice / total;
							group_money += traf * ($('#traff'+this ).val()) * cprice / total;
							group_note += continents_codes[this] + ((ci < this_continents.length - 1) ? ', ':'');  
						});
						if(group_money > 0)
						note += group_note + ' - $' + Math.ceil(group_money) + '<br>';
					});
					return false;
				}
			});
			show_cdn_plan_notes("CDN77",note);
			result = Math.ceil(result);
			$("#traffic_info tr:contains(CDN77) td:last").html('$' + result);
		},
		
		CloudFront: function () {
			var traf = $("#traffic_volume").val();
			var reqs = $("#inputHttpRequest").val();
			var reqs_s = $("#inputHttpSRequest").val();
			var result = 0; 
			var  note = '', total = 0;
			total = calculate_total();
			var matrix = [
				{traffic:   10000, prices: [{continents:['US','EU'],price: 0.12},{continents:['AS','AU'],price: 0.19},{continents:['SA'],price:0.25},{continents:['JP'],price:0.201},{continents:['IN'],price:0.17}]},
				{traffic:   40000, prices: [{continents:['US','EU'],price: 0.08},{continents:['AS','AU'],price: 0.14},{continents:['SA'],price:0.20},{continents:['JP'],price:0.148},{continents:['IN'],price:0.13}]},
				{traffic:  100000, prices: [{continents:['US','EU'],price: 0.06},{continents:['AS','AU'],price: 0.12},{continents:['SA'],price:0.18},{continents:['JP'],price:0.127},{continents:['IN'],price:0.11}]},
				{traffic:  350000, prices: [{continents:['US','EU'],price: 0.04},{continents:['AS','AU'],price: 0.10},{continents:['SA'],price:0.16},{continents:['JP'],price:0.106},{continents:['IN'],price:0.1}]},
				{traffic:  524000, prices: [{continents:['US','EU'],price: 0.03},{continents:['AS'],price: 0.08},{continents:['SA'],price:0.140},{continents:['AU'],price:0.095},{continents:['JP'],price:0.085},{continents:['IN'],price:0.1}]},
				{traffic: 4000000, prices: [{continents:['US','EU'],price:0.025},{continents:['AS'],price: 0.07},{continents:['SA'],price:0.130},{continents:['AU'],price:0.090},{continents:['JP'],price:0.075},{continents:['IN'],price:0.1}]},
				{traffic:      -1, prices: [{continents:['US','EU'],price: 0.02},{continents:['AS'],price: 0.06},{continents:['SA'],price:0.125},{continents:['AU'],price:0.085},{continents:['JP'],price:0.065},{continents:['IN'],price:0.1}]}
			];
			var requests=[{continents:['US'],price: 0.00000075,price_s:0.000001},{continents:['EU','AS'],price:0.0000009,price_s:0.0000012},{continents:['AU'],price:0.0000009,price_s:0.00000125},{continents:['SA'],price:0.0000016,price_s:0.0000022}];               
			$.each(matrix, function (index) {
				if (traf <= this.traffic || index == matrix.length-1) {
					$.each(this.prices, function (){
						var cprice = this.price;
						var group_money = 0;
						var group_note = '';
						var this_continents = this.continents;
						$.each(this.continents, function (ci){
							result += traf * ($('#traff'+this).length > 0 ? $('#traff'+this).val() : 0) * cprice / total;
							group_money += traf * ($('#traff'+this).length > 0 ? $('#traff'+this).val() : 0) * cprice / total;
							group_note += continents_codes[this] + ((ci < this_continents.length - 1) ? ', ':'');  
						});
						if(group_money > 0)
						note += group_note + ' - $' + Math.ceil(group_money) + '<br>';
					});
					return false;
				}
			});
			show_cdn_plan_notes("CloudFront",note);
			$.each(requests, function (index) {
				var cprice = this.price;
						var cprice_s = this.price_s;
				$.each(this.continents, function (ci){
						result += ($("#traffProtocolHTTP:checked").val() ? (reqs*($('#traff'+this).val())*cprice/total):0) + ($("#traffProtocolHTTPS:checked").val() ? (reqs_s*($('#traff'+this).val())*cprice_s/total) : 0)  
					});
				});	
			
			
			result = Math.ceil(result);
			$("#traffic_info tr:contains(CloudFront) td:last").html('$' + result);
		},
		
		Fastly: function () {
			var traf = $("#traffic_volume").val();
			var reqs = $("#inputHttpRequest").val();
			var reqs_s = $("#inputHttpSRequest").val();
			var result = 0; 
			var  note = '', total = 0;
			total = calculate_total();
			var matrix = [
		{traffic:   10000,prices:[{continents:['US','EU'],price: 0.12},{continents:['AU','AS'],price: 0.19}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]},
		{traffic:   40000,prices:[{continents:['US','EU'],price: 0.08},{continents:['AU','AS'],price: 0.14}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]},
		{traffic:  100000,prices:[{continents:['US','EU'],price: 0.06},{continents:['AU','AS'],price: 0.12}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]},
		{traffic:  350000,prices:[{continents:['US','EU'],price: 0.04},{continents:['AU','AS'],price: 0.10}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]},
		{traffic:  500000,prices:[{continents:['US','EU'],price: 0.03},{continents:['AU','AS'],price:0.095}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]},
		{traffic: 4000000,prices:[{continents:['US','EU'],price:0.025},{continents:['AU','AS'],price: 0.09}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]},
		{traffic:      -1,prices:[{continents:['US','EU'],price: 0.02},{continents:['AU','AS'],price:0.085}],requests:[{continents:['US'],price: 0.0075,price_s:0.01},{continents:['AU','EU','AS'],price:0.009,price_s:0.012}]}
			];
			
			$.each(matrix, function (index) {
				if (traf <= this.traffic || index == matrix.length-1) {
					$.each(this.prices, function (){
						var cprice = this.price;
						var group_money = 0;
						var group_note = '';
						var this_continents = this.continents;
						$.each(this.continents, function (ci){
							result += traf * ($('#traff'+this ).val()) * cprice / total ;
							group_money += traf * ($('#traff'+this ).val()) * cprice / total ;
							group_note += continents_codes[this] + ((ci < this_continents.length - 1) ? ', ':'');  
						});
						if(group_money > 0)
						note += group_note + ' - $' + Math.ceil(group_money) + '<br>';
					});
					$.each(this.requests, function (){
						var cprice = this.price;
						var cprice_s = this.price_s;
						$.each(this.continents, function (ci){
							result += ($("#traffProtocolHTTP:checked").val() ? (reqs*($('#traff'+this).val())*cprice/total):0) + ($("#traffProtocolHTTPS:checked").val() ? (reqs_s*($('#traff'+this).val())*cprice_s/total) : 0);
						});
					});
					return false;
				}
			});
			show_cdn_plan_notes("Fastly",note);
			result = Math.ceil(result);
			$("#traffic_info tr:contains(Fastly) td:last").html('$' + result);
		},
		
		JoDiHost: function () {
			var traf = $("#traffic_volume").val();
			switch( true )
			  { 
     			    case traf < 1000: 
			    result = result = Math.ceil(traf * 0.07);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 
			 
		            case traf >= 1000 && traf < 5000:
			    result = result = Math.ceil(traf * 0.06);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 5000 && traf < 10000:
			    result = result = Math.ceil(traf * 0.05);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 10000 && traf < 25000:
			    result = result = Math.ceil(traf * 0.0425);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 25000 && traf < 50000:
			    result = result = Math.ceil(traf * 0.04);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 50000 && traf < 100000:
			    result = result = Math.ceil(traf * 0.035);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 100000 && traf < 200000:
			    result = result = Math.ceil(traf * 0.03);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 200000 && traf < 500000:
			    result = result = Math.ceil(traf * 0.025);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 500000 && traf < 1000000:
			    result = result = Math.ceil(traf * 0.0225);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 

		            case traf >= 1000000:
			    result = result = Math.ceil(traf * 0.02);
 			    show_cdn_plan_notes("JoDiHost","EdgeCast Global Premium");
 	  		    break; 
  	 		  }
			$("#traffic_info tr:contains(JoDiHost) td:last").html('$' + result);
		},

		SkyparkCDN: function () {
			var currency_usd = 66;
			var traf = $("#traffic_volume").val();
			var note = '', total = 0;
			total = calculate_total();
			continents_codes = {
				'RU': 'Russia',
				'US': 'USA',
				'SA': 'South America',
				'EU': 'Europe',
				'AU': 'Australia',
				'AS': 'Asia',
				'AF': 'Africa'
			};
			var price1 = {continents: ['EU', 'US', 'SA'], price: 5};
			var price2 = {continents: ['AU', 'AS', 'AF'], price: 8};
			var matrix = [
				{traffic: 1, prices: [price1, price2, {continents: ['RU'], price: 45}]},
				{traffic: 5, prices: [price1, price2, {continents: ['RU'], price: 15}]},
				{traffic: 50, prices: [price1, price2, {continents: ['RU'], price: 5}]},
				{traffic: 100, prices: [price1, price2, {continents: ['RU'], price: 2.5}]},
				{traffic: 500, prices: [price1, price2, {continents: ['RU'], price: 2}]},
				{traffic: 3000, prices: [price1, price2, {continents: ['RU'], price: 1.7}]},
				{traffic: 7000, prices: [price1, price2, {continents: ['RU'], price: 1.5}]},
				{traffic: 15000, prices: [price1, price2, {continents: ['RU'], price: 1.2}]},
				{traffic: 30000, prices: [price1, price2, {continents: ['RU'], price: 1}]}
			];

			var m2 = matrix,
				t2 = traf,
				s = 0,
				result = 0,
				group = {};
			$.each(matrix, function (index) {

				var nextEl = null;
				if (index < matrix.length - 1) {
					nextEl = matrix[index + 1];
				} else {
					nextEl = matrix[index];
				}

				var traffic = 0;
				if (t2 >= this.traffic && t2 <= nextEl.traffic) {
					var t3 = t2;
					if (s > 0) {
						t3 = t3 - this.traffic;
					}
					traffic = t3;
				} else {
					traffic = nextEl.traffic;
				}

				if (t2 >= this.traffic) {

					$.each(this.prices, function () {
						var cprice = this.price;
						var group_money = 0;
						var group_note = '';
						var this_continents = this.continents;
						$.each(this_continents, function (ci) {
							result += traffic * ($('#traff' + this).val()) * cprice / total;
							group_money += traffic * ($('#traff' + this).val()) * cprice / total;
							group_note += continents_codes[this] + ((ci < this_continents.length - 1) ? ', ' : '');
						});
						if( typeof group[group_note] == "undefined" )
							group[group_note] = group_money;
						else
							group[group_note] += group_money;
					});

				}
				s += traffic;
			});

			note = '';
			$.each(group, function (i, v) {
				if (v > 0) {
					var p = v / currency_usd;
					p = p < 1 ? 1 : p.toFixed(0);
					note += i + ' - $' + p + '<br>';
				}
			});

			show_cdn_plan_notes("SkyparkCDN", note);
			result = result / currency_usd;
			result = result < 1 ? 1 : result.toFixed(0);
			$("#traffic_info tr:contains(SkyparkCDN) td:last").html('$' + result);
		}
	};
if (!Array.min) { Array.min = function( array ){return Math.min.apply( Math, array )} };	
function highlight_cheapest() {
	$('#traffic_info tbody tr.success').removeClass('success');
	var mins = new Array();
	 $('#traffic_info tbody tr td:nth-child(5)').each(function (i){
	 	
	 	mins[i] = $(this).text().replace(/\$/,'');
	
	 });
	var minValue = Array.min(mins );
	
	$('#traffic_info tbody tr td:nth-child(5):contains(\'$'+minValue+'\')').each(function (i){
		if ($(this).text() == ('$'+minValue)) {
			$(this).parent().addClass('success');
		}
	
	});
	
	
}	
function highlight_recommended() {/*
	$('#traffic_info tr').removeClass('warning');
	$('#traffic_info tr:contains(MaxCDN)').addClass('warning');*/
}	

function recalculate() {
	$("#traffic_volume").val($("#traffic_volume").val().replace(/\D+/g,''));

	if ($('#traffic_info').find(':animated').length > 0) {
		var to = window.setTimeout(function () {recalculate();}, 300);	
		return;
	}
	if ( $("#traffic_volume").val() >= 0) {
		$.each(plans, function (){
			this();
		});
		$('#traffic_info').sortTable({onCol: 5, keepRelationships: true, sortType: 'numeric', sortDesc:sort_price});
	}
}
$(document).ready( function(){
	$("input").keyup(function(){
		recalculate();
	});
	$("input").change(function(){
		recalculate();
		if ($("#traffProtocolHTTP:checked").val()) {
			$("#inputHttpRequest").attr('disabled',false);
		}
		else {
			$("#inputHttpRequest").attr('disabled','1');
		};
		if ($("#traffProtocolHTTPS:checked").val()) {
			$("#inputHttpSRequest").attr('disabled',false);
		}
		else {
			$("#inputHttpSRequest").attr('disabled','1');
		}
	});

});

