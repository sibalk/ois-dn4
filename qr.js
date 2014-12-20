function getQR (url) {
	$.ajax({
		url: "https://mutationevent-qr-code-generator.p.mashape.com/generate.php?content=" + url + "&type=url",
		type: "GET",
		headers: {"X-Mashape-Key": "xJpSIdzgi6mshyKkjLFSNHJhGTVDp13gZ5DjsnJGyXolTwRI5x"},


		success: function(res) {
			console.log(res);
			res = jQuery.parseJSON(res);
			$("#QRimage").attr("src", res.image_url);
			$("#QRimage").animate({opacity:1, height:120, width:120},1000)
			$("#QRimage").delay(10000).animate({opacity:0, height:0, width:0},1000)
		}
	})
}