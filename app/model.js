var build = function(res) {
  	var o =  {};
  	o.id = res.id;
  	o.user = res.changeSet.items[0].user;
 	o.msg = res.changeSet.items[0].msg;
  	o.date = res.changeSet.items[0].date;
	o.result = res.result;
	return o;
}

exports.build = build;