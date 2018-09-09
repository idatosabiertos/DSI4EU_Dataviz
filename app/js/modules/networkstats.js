function NetworkStats() {
	var self = this;
	self.create = createStats;
	self.delete = deleteStats;


	function createStats() {
		var connections = APP.dataset.getNetworkStats();
		var orgConnRatio = Math.round((connections.totalLinkedOrgs/APP.dataset.orgs.length)*100);
		var prjShareRatio = Math.round((connections.totalSharedPrjs/APP.dataset.prjs.length)*100);
		$(".network-stats-orgs .stats-caption span").html(orgConnRatio+"%");
		$(".network-stats-orgs .stats-paragraph").html(orgConnRatio+"% de las organizaciones en la red DSI están conectadas con al menos otra organización en la red.");
		$(".network-stats-orgs .stats-bar .color").transition({width: orgConnRatio+"%"}, 2000);
		$(".network-stats-prjs .stats-caption span").html(prjShareRatio+"%");
		$(".network-stats-prjs .stats-paragraph").html(prjShareRatio+"% de los proyectos están vinculados a dos o más organizaciones en la red.");
		$(".network-stats-prjs .stats-bar .color").transition({width: prjShareRatio+"%"}, 2000);

	}


	function deleteStats() {
		
	}

}