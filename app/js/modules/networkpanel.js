function NetworkPanel() {
	var self = this;
	self.fillPanel = fillPanel;
	self.deleteNetworkPanelItems = deleteNetworkPanelItems;

	function fillPanel(selectedOrg) {
		//console.log(selectedOrg);

		$(".network-panel-title h2").text(selectedOrg.name);
		$(".subtitle").text(selectedOrg.shared_prjs.length+_.pluralize(" proyecto compartido", selectedOrg.shared_prjs.length));

		//max number of linked ORGs of all the PRJ listed in the network panel
		var maxBar = d3.max(selectedOrg.shared_prjs, function (d) {
			return d.linked_orgs.length;
		})

		var barScale = d3.scaleLinear()
			.domain([0, maxBar])
			.range([0, 100])

		//removing selectedOrg from the linked_orgs field of selectedOrg's shared prjs
		var _shared_prjs = _.cloneDeep(selectedOrg.shared_prjs);
		_shared_prjs.forEach(function (f) {
			_.remove(f.linked_orgs, function (e) {
				return e.name == selectedOrg.name;
			})
		});

		_shared_prjs.sort(function (a, b) {
			return b.linked_orgs.length - a.linked_orgs.length;
		})

		_shared_prjs.forEach(function (o) {

			var list = $(".network-panel-container .scrolling ul").get(0)
			var li = $("<li></li>")
				.addClass("network-panel-item")
			list.append(li.get(0));

			var titleDiv = $("<div></div>")
				.addClass("network-panel-item-title")
			li.get(0).append(titleDiv.get(0));

			var titleLink = $("<a></a>")
				.attr("href", o.url)
				.attr("target", "_blank")
				.text(o.name)
			titleDiv.get(0).append(titleLink.get(0));

			var barDiv = $("<div></div>")
				.addClass("network-panel-item-bar")
				//.css("width", barScale(o.linked_orgs.length)+"%")
				.css("width", 0)
			li.get(0).append(barDiv.get(0));

			barDiv.transition({width: barScale(o.linked_orgs.length)+"%"}, 1000)

			var orgsDiv = $("<div></div>")
				.addClass("network-panel-item-org")
				.text(createOrgList(o))
			li.get(0).append(orgsDiv.get(0));
		})
		
		function createOrgList(d) {
			var orglist = "Compartido con "+d.linked_orgs.length+_.pluralize(" organización", d.linked_orgs.length)+": ";
			d.linked_orgs.forEach(function (l, i) {
				orglist = orglist.concat(l.name);
				if (i != d.linked_orgs.length-1) orglist = orglist.concat(", ");
			})
			return orglist;
		}

	}


	function deleteNetworkPanelItems() {
		d3.select(".network-panel-container .scrolling ul").selectAll("li").remove();
	}

}