function ClusterPanel() {
	var self = this;
	self.fillHeader = fillHeader;
	self.drawPanel = drawPanel;
	self.deleteClusterPanelItems = deleteClusterPanelItems;

	function fillHeader(selectedCluster) {
		var all_values = _.map(selectedCluster.values, function(c){
			return c.values;
		})
		var all_prjs = _.uniq([].concat.apply([], all_values))
		$(".cluster-panel-container h2").html(selectedCluster.key);
		$(".cluster-panel-container .subtitle").html(all_prjs.length+" projects");
	}

	function drawPanel(selectedCluster) {
		var maxCircle = selectedCluster.values[0].values.length; //max circle size
		var colorScale = APP.getColorScale(APP.cluster.subdivide_field);
	
		var items = d3.select(".cluster-panel-container .scrolling ul")
			.selectAll(".cluster-item")
			.data(selectedCluster.values)
				.enter()
				.append("li")
					.attr("class", "cluster-item")
					.on("click", clusterItemDetail);

		items.append("div")
			.attr("class", "line")

		var circleContainer = items.append("div")
			.attr("class", "cluster-circle-container")

		var circleContainerW = $(".cluster-circle-container").width(); //circle container size

		var circleDivScale = d3.scaleLinear()
			.domain([0, maxCircle])	
			.range([0, circleContainerW])

		circleContainer
			.append("div")
				.attr("class", "cluster-panel-circle")
				.style("width", function(d){
					return circleDivScale(d.values.length)+"px";
				})
				.style("height", function(d){
					return circleDivScale(d.values.length)+"px";
				})
				.style("background", function (d) {
					return colorScale(d.key);
				});

		var text = items.append("div")
			.attr("class", "cluster-text-container")

		text.append("div")
			.attr("class", "cluster-text")
			.text(function (d) {
				return d.key;
			})

		var cta = text.append("div")
			.attr("class", "cluster-cta")
			

		cta.append("div")
			.style("display", "inline-block")
				.append("svg")
					.attr("class", "down-icon inverted-color")
				.append("use")
					.attr("xlink:href", "#down-icon")

		cta.append("div")
			.style("display", "inline-block")
			.text(function (d) {
				return "Show "+d.values.length+" projects";
			})

		cta.each(generatePrjList)
		
		function clusterItemDetail() {
			$(this).find("ul").toggleClass("invisible");
			// if (d3.event.target == this) {
			// 	$(this).find("ul").toggleClass("invisible");
			// }
		}

		function generatePrjList(e, i) {
			d3.select(this).append("ul")
				.attr("class", "sub-list invisible")
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
		}

	}

	function deleteClusterPanelItems() {
		d3.select(".cluster-panel-container .scrolling ul").selectAll("li").remove();
	}

}