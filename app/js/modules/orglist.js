function OrgList() {
	var self = this;
	self.create = createList;
	self.delete = deleteOrgListItems;

	function createList(node){
		fillList(node);
	}

	function fillList(node) {
		d3.select(".map-list-container h3")
			.text(node.name)

		d3.select(".scrolling ul").selectAll(".scrolling-item")
			.data(node.orgs)
			.enter()
			.append("li")
			.attr("class", "scrolling-item")
			.text(function (d) {
				return d.name;
			})
			.on("click", function (d) {
				toOrgPanel(d);
			})
	}

	function toOrgPanel(org) {
		$('.map-list').transition({ x:"-100%" }, 750, "easeInOutQuint");
		APP.ui.openOrgPanel(org, true);
	}

	function deleteOrgListItems() {
    d3.selectAll(".scrolling .scrolling-item").remove();
  }

}