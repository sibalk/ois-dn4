var isProfileOpen=true;
function closeProfileAdd () {
	$("#profileAdd").animate({
		height: 0,
		borderWidth: 0
	}, 1000, function(){
		isProfileOpen=false
	})
}
function openProfileAdd () {
	$("#profileAdd").animate({
		height: $("#profileAdd").get(0).scrollHeight
	}, 1000, function(){
		isProfileOpen=true
	})
}
function ProfileAdd(){
	if (isProfileOpen) {
		closeProfileAdd()
	}
	else
		openProfileAdd()
}