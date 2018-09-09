function ClusterPanel() {
	var self = this;
	self.initPanel = initPanel;
	self.fillHeader = fillHeader;
	self.drawPanel = drawPanel;
	self.deleteClusterPanelItems = deleteClusterPanelItems;

	function initPanel (selectedCluster) {
		//console.log(selectedCluster)
		if(selectedCluster.values[0].hasOwnProperty("key")){ //subdivided by something
			fillHeader(selectedCluster)
			drawPanel(selectedCluster)
		} else { //subdivided by NONE
			fillHeaderNoSub(selectedCluster)
			drawPanelNoSub(selectedCluster)
		}
	}

	function fillHeader(selectedCluster) {
		var all_values = _.map(selectedCluster.values, function(c){
			return c.values;
		})
		var all_prjs = _.uniq([].concat.apply([], all_values))
		$(".cluster-panel-container h2").html(selectedCluster.key);
		$(".cluster-panel-container .subtitle").html(all_prjs.length+" proyectos");
	}

	function fillHeaderNoSub(selectedCluster) {
		var all_values = _.map(selectedCluster.values, function(c){
			return c;
		})
		var all_prjs = _.uniq(all_values)
		$(".cluster-panel-container h2").html(selectedCluster.key);
		$(".cluster-panel-container .subtitle").html(all_prjs.length+" proyectos");
	}

	function drawPanel(selectedCluster) {

		//var subListH = [];	//for drop-down animation

		var maxCircle = selectedCluster.values[0].values.length; //max circle size
		var colorScale = APP.getColorScale(APP.cluster.subdivide_field);
	
		var items = d3.select(".cluster-panel-container .scrolling ul")
			.selectAll(".cluster-item")
			.data(selectedCluster.values)
				.enter()
				.append("li")
					.attr("class", "cluster-item")
					.on("click", function (d, i) {
						clusterItemDetail(this, i);
					});

		var itemHeader = items.append("div")
			.attr("class", "cluster-item-header")

		var circleContainer = itemHeader.append("div")
			.attr("class", "cluster-circle-container")

		var circleContainerW = $(".cluster-circle-container").width(); //circle container size

		var circleDivScale = d3.scaleLinear()
			.domain([0, maxCircle])	
			.range([2, circleContainerW])

		circleContainer
			.append("div")
				.attr("class", "cluster-panel-circle")
				.style("background", function (d) {
					return colorScale(d.key);
				})
				.style("width", 0)
				.style("height", 0)
				.transition()
				.duration(500)
				.delay(function (d, i) {
					return 100*i;
				})
				.style("width", function(d){
					return circleDivScale(d.values.length)+"px";
				})
				.style("height", function(d){
					return circleDivScale(d.values.length)+"px";
				})

		var text = itemHeader.append("div")
			.attr("class", "cluster-text-container")

		text.append("div")
			.attr("class", "cluster-text")
			.text(function (d) {
				return d.key;
			})

		var cta = text.append("div")
			.attr("class", "cluster-cta")

		cta.append("div")
			.attr("class", "cta-text")
			.style("display", "inline-block")
			.text(function (d) {
				return "Show "+d.values.length+_.pluralize(" proyectos", d.values.length);
			})
		
		cta.append("div")
			.attr("class", "cta-arrow")
			.style("display", "inline-block")
				.append("svg")
					.attr("class", "down-icon inverted-color")
				.append("use")
					.attr("xlink:href", "#down-icon")

		items.each(generatePrjList)
		
		function clusterItemDetail(list, index) {
			var list = $(list);
			var el = list.find("ul");
			//var elH = subListH[index];

			el.toggleClass("invisible");
			if (el.hasClass("invisible")) {
				//el.transition({height: 0}, 1000, "easeInQuint");
				list.find(".down-icon").transition({scale: 1});
				list.find(".cta-text").text(function () {
			    return $(this).text().replace("Hide", "Show");
				})
			} else {
				//el.height(0);
				//el.transition({height: elH+"px"}, 1000, "easeOutQuint");
				list.find(".down-icon").transition({scale: -1});
				list.find(".cta-text").text(function () {
			    return $(this).text().replace("Show", "Hide");
				})
			}
		}

		function generatePrjList(e, i) {
			d3.select(this).append("div")
				.attr("class", "item-content")
					.append("ul")
					.attr("class", "sub-list")
						.selectAll("sub-list-items")
						.data(e.values)
						.enter()
						.append("li")
							.attr("class", "sub-list-items")
							.append("a")
								.attr("href", function (d) {
									return d.url;
								})
								.attr("target", "_blank")
								.text(function (f) {
									return f.name;
								})
			//computed height of the list just generated, for drop-down list animation
			// subListH[i] = $(this).find("ul").outerHeight();
			$(".sub-list").addClass("invisible")
		}

	}

	function drawPanelNoSub(selectedCluster) {
		
	}

	function deleteClusterPanelItems() {
		d3.select(".cluster-panel-container .scrolling ul").selectAll("li").remove();
	}

}