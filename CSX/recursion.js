/*
  Recursion

  Key Takeaways:
  
    1. Gotchas
      1a. Careful: using ! to check undefined, defined values could be booleans
      1b. Careful: modifying passed parameter that isn't prim, esp. obj vals and array elems
      1c. Can modify func def adding default param; func still works with orig input; can still pass additional values needed in recursive calls
      1d. Careful: check for undefined/null input (or other invalid input) ; esp because undefined when no args passed ; undefined !== null
    2. String: array like access to chars (ex. str[3])
    3. Arrays
      3a. arr.pop() / array.shift() vs. arr.slice(1): modify orig array vs not
      3b. arr.push() vs. arr.concat(): modify orig array vs not
      3c. arr.push(): returns new length, not array ; takes indiv. elemes as args ; can use w. array(s) and spread operator (...)
      3d. arr.concat(): new result array ; variable input w/ values/objs + arrays(expanded out w/elems)
    4. Integer/String conversions: Number(str), String(number), parseInt(), number.toString()
    5. Math
      5a. Division: div with integers, float value possible, not integer w/o remainder like java
      5b. Math.floor() for division while keeping only whole part
*/

// Challenge 1: Repeater
{
  // function repeater(char) {
  //   return repeat('', 0, char);
  // }

  // function repeat(str, count, char) {
  //   if(count >= 5) return str;

  //   return repeat(str + char, ++count, char);
  // }
  function repeater(char) {
    if(char.length === 5) return char;
    return repeater(char + char[0]);
  }

  console.log(repeater('g'));
  console.log(repeater('j'));
}

// Challenge 2: factorial
{
  function factorial(n) {
    if(n === 1) return 1;

    return n * factorial(n - 1);
  }

  console.log(factorial(4)); // -> 24
  console.log(factorial(6)); // -> 720
}

// Challenge 3: getLength
{
  // Note: careful about using ! to check undefined, values could be booleans
  // Note: can change function definition adding default param, func still works with one value, but can keep passing additional values needed in recursion
  // Note: arr.pop() vs arr.slice(1) 
    // Note: modifying passed parameter that isn't prim!!

  // function getLength(array) {
  //   return getArrayLength(array, 0);
  // }

  // function getArrayLength(array, count){
  //   if(!array.pop()) return count; 
  //   return getArrayLength(array, ++count);
  // }

  function getLength(array, length = 0) {
    if(array[0] === undefined) return length;
    return getLength(array.slice(1), ++length);
  }

  console.log(getLength([1])); // -> 1
  console.log(getLength([1, 2])); // -> 2
  console.log(getLength([1, 2, 3, 4, 5])); // -> 5
  console.log(getLength([])); // -> 0
}

// Challenge 4: POW
{
  function pow(base, exponent) {
    if(exponent === 0) return 1;
    return base * pow(base, exponent - 1);
  }

  console.log(pow(2, 4)); // -> 16
  console.log(pow(3, 5)); // -> 243
}

// Challenge 5: flow
{
  // Note: .slice(1) vs. .shift() on array better to get array minus first elem; slice does not modify array
  function flow(input, funcArray) {
    if(funcArray.length === 0) return input;
    
    // const func = funcArray.shift();
    // const output = func(input);

    const output = funcArray[0](input);
    return flow(output, funcArray.slice(1));
  }

  function multiplyBy2(num) { return num * 2; }
  function add7(num) { return num + 7; }
  function modulo4(num) { return num % 4; }
  function subtract10(num) { return num - 10; }
  const arrayOfFunctions = [ multiplyBy2, add7, modulo4, subtract10 ];
  console.log(flow(2, arrayOfFunctions)); // -> -7
}

// Challenge 6: shuffleCards
{
  // Note: arr.concat vs arr.push: push modifies array ; concat no arrays modified, new result array, variable input w/ values/objs/arrays
  // Note. arr.push returns new length, not array; takes individual elems as arg; can use w/ array(s) and spread operator (...)
  
  function shuffleCards(topHalf, bottomHalf, shuffledCards = []) {
    /* Pseudocode 
        0. Expected order: topHalf[0], bottomHalf[0], topHalf[1], bottomHalf[2], 
          ... , remaining elems of array with longer length , ... until both no elems left
        
        1. base case: one or both decks empty
          if one not empty, append remaining elems to result array and return
          if both empty, return result array

        2. recursive case: both decks have cards left
          add topHalf[0], bottomHalf[0], to end of result array ; recursive cal with remaining decks w/o first elem
    */

    /* First Attempt: until realized, can push empty array w/ no issues, push variable args

        if(topHalf.length === 0 && bottomHalf.length === 0) {
          return shuffledCards;
        } else if (topHalf.length !== 0 && bottomHalf.length === 0) {
          return shuffledCards.push(topHalf);
        } else if (topHalf.length === 0 && bottomHalf.length !== 0) {
          return shuffledCards.push(bottomHalf);
        } else {
          shuffledCards.push(topHalf[0], bottomHalf[0]); // check for error
          return shuffleCards(topHalf.slice(1), bottomHalf.slice(1), shuffledCards);
        } */

    if(topHalf.length === 0 || bottomHalf.length === 0) {
      shuffledCards.push(...topHalf, ...bottomHalf);
      return shuffledCards;
    } else {
      shuffledCards.push(topHalf[0], bottomHalf[0]); // check for error
      return shuffleCards(topHalf.slice(1), bottomHalf.slice(1), shuffledCards);
    }
  }

  const topHalf = ['Queen of Diamonds', 'Five of Hearts', 'Ace of Spades', 'Eight of Clubs'];
  const bottomHalf = ['Jack of Hearts', 'Ten of Spades'];
  console.log(shuffleCards(topHalf, bottomHalf));
  /*-> [
        'Queen of Diamonds,
        'Jack of Hearts',
        'Five of Hearts',
        'Ten of Spades',
        'Ace of Spades',
        'Eight of Clubs'
      ]
  */
}

// Challenge 7: cascade (challenging)
{
  // Note: integer/string conversions - Number(str), String(number), parseInt(), number.toString()
  // Note: extract elem w/ math + module or string manipulation
  // Note: division with integers, float value, not integer w/o remainder like java
    // Note: Math.floor(number) for division while keeping only whole part
  // Note: check for undefined/null input (or other invalid input) ; esp because undefined when no args passed
    // null !== undefined

  /* cascade(12345) should print
  12345
  1234
  12
  1
  12
  ...
  12345 */

  function cascade(integer) {
    // print integer passed
    // if (integer.toString().length === 1) return
    // else recursive call cascade w/ integer w/o last element
      // then, print integer passed again, return

    // corner cases: negative (not included), 0, single digit

    // base case: one digit integer

    // Note: check for invalid / missing input -- match below won't catch it and then stack error
    if(integer === undefined) return;

    console.log(integer);

    // Note: girl what on earth, keep it simple
    // if((integer / 10) < 1 ) return;
    if(integer < 10) return;
   
    // recursive case: more than one digit integer

    // Note: alternative without using Math.floor()
    // const onesDigit = integer % 10;
    // cascade((integer - onesDigit) / 10);
    cascade(Math.floor(integer / 10));

    console.log(integer);
    return; // implicit return without this, return undefined
  }

  console.log(cascade(111));
}