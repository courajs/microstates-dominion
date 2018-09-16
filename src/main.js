import {create} from "microstates";

function Person() {
  this.name = String;
  this.married = Boolean;
}

var p = create(Person);

var p2 = p.married.toggle();
console.log(p.state);
console.log(p2.state);
