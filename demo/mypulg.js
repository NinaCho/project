function foo(){
	console.error(this.fruit);
}

var fruit = 'aa';

foo(); //aa

var pack = {
	fruit:'oo',
	foo:foo
}


var packgo = {
	fruit:"cc"
}
pack.foo();//oo

foo.apply(window);//'aa'
foo.apply(packgo);//cc

function Person(name){
	this.name = name;
}

Person.prototype = {
	getName: function(){
		return this.name;
	}
}

var hao = new Person("name");
console.error(hao.getName());

//数组扩展min获取
Array.prototype.min = function(){
	var min = this[0];
	for(var i = 1; i < this.length; i++){
		if(this[i] < min){
			min = this[i];
		}
	}

	return min;
}


