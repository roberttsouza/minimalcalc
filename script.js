
const calculatorElement = document.querySelector("#calculator");
const resultElement = document.querySelector("#result");


//calculation library [string-math, link: https://www.npmjs.com/package/string-math]
function stringMath(eq, callback) {
    try{
        if (typeof eq !== 'string') return handleCallback(new TypeError('The [String] argument is expected.'), null);
    const mulDiv = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([*/])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    const plusMin = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([+-])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    const parentheses = /(\d)?\s*\(([^()]*)\)\s*/;
    var current;
    while (eq.search(/^\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*$/) === -1) {
      eq = fParentheses(eq);
      if (eq === current) return handleCallback(new SyntaxError('The equation is invalid.'), null);
      current = eq;
    }
    return handleCallback(null, +eq);
  
    function fParentheses(eq) {
      while (eq.search(parentheses) !== -1) {
        eq = eq.replace(parentheses, function (a, b, c) {
          c = fMulDiv(c);
          c = fPlusMin(c);
          return typeof b === 'string' ? b + '*' + c : c;
        });
      }
      eq = fMulDiv(eq);
      eq = fPlusMin(eq);
      return eq;
    }
  
    function fMulDiv(eq) {
      while (eq.search(mulDiv) !== -1) {
        eq = eq.replace(mulDiv, function (a) {
          const sides = mulDiv.exec(a);
          const result = sides[2] === '*' ? sides[1] * sides[3] : sides[1] / sides[3];
          return result >= 0 ? '+' + result : result;
        });
      }
      return eq;
    }
  
    function fPlusMin(eq) {
      eq = eq.replace(/([+-])([+-])(\d|\.)/g, function (a, b, c, d) { return (b === c ? '+' : '-') + d; });
      while (eq.search(plusMin) !== -1) {
        eq = eq.replace(plusMin, function (a) {
          const sides = plusMin.exec(a);
          return sides[2] === '+' ? +sides[1] + +sides[3] : sides[1] - sides[3];
        });
      }
      return eq;
    }
  
    function handleCallback(errObject, result) {
      if (typeof callback !== 'function') {
        if (errObject !== null) throw errObject;
      } else {
        callback(errObject, result);
      }
      return result;
  
    }
    }catch(e){
      return null  
    }
  };
  
  if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports) {
    module.exports = stringMath;
  };





  
function round(value = number){
    return Math.round(value * 1000) / 1000
};


function calculate(){
    const lines = calculatorElement.value.split(/\r?\n/).map(stringMath)

    resultElement.innerHTML = `<div>${lines.map(l => `<div>${round(l)}</div>`).join('')}</div>`;


    const total = round(lines.reduce((a, b) => a+ b, 0));

    resultElement.innerHTML += `<div id="total">${total}</div>`


    document.getElementById('total').addEventListener('click', () =>{
        navigator.clipboard.writeText(total.toString());
        resultElement.innerHTML = `<div>${lines.map(l => `<div>${round(l)}</div>`).join('')}</div>`;
        resultElement.innerHTML += `<div id="total">Copiado</div>`
    });

           console.log(lines) 
    };


calculatorElement.addEventListener('input', calculate);