import { Script } from "vm";

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = 'BAEOO';

  return element;
}

document.body.appendChild(component());

console.log("HELLO WORLD"); 


console.log("AK")

