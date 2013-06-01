$(document).ready(function(){

	var windowHeight = $(window).height();
    $('body').height(windowHeight);


	function AppViewModel() {
		var self = this;
		var apiKey = "Ix7evhXTw3uwk1gDHCvzz-uMNEhOy8ZN";
		this.loginUsername = ko.observable("");
		this.loginPassword = ko.observable("");
		this.loadedData = ko.observable("");
		this.userName = ko.observable("Lucas Severyn");
		this.loggedIn = ko.observable(false);
		this.debug= ko.observable("");

		logIn = function() {
        // self.loggedIn(true);
        // self.debug(loginUsername());
        var request = new XMLHttpRequest();
        // self.loadedData("lalala");
        self.loadedData(request.open("GET", "https://api.mongolab.com/api/1/databases/activity_recognition/collections/users?q={%22username%22:%20%22" + self.loginUsername() + "%22,%22password%22:%22" + self.loginPassword() + "%22}&apiKey=" + apiKey));
        // request.send(null);
    };
}

ko.applyBindings(new AppViewModel());

});