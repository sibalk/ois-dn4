var isProfileAddOpen=false;
var isProfileEditOpen=false;
function closeProfileAdd () {
	$("#profileAdd").animate({
		height: 0,
		borderWidth: 0
	}, 1000, function(){
		isProfileAddOpen=false
	})
}
function openProfileAdd () {
	$("#profileAdd").animate({
		height: $("#profileAdd").get(0).scrollHeight
	}, 1000, function(){
		isProfileAddOpen=true
	})
}
function ProfileAdd(){
	if (isProfileAddOpen) {
		closeProfileAdd()
	}
	else
		openProfileAdd()
}
function closeProfileEdit () {
	$("#profileEdit").animate({
		height: 0,
		borderWidth: 0
	}, 1000, function(){
		isProfileEditOpen=false
	})
}
function openProfileEdit () {
	$("#profileEdit").animate({
		height: $("#profileEdit").get(0).scrollHeight
	}, 1000, function(){
		isProfileEditOpen=true
	})
}
function ProfileEdit() {
	if (isProfileEditOpen) {
		closeProfileEdit();
	}
	else{
		openProfileEdit();
	}
}