// Closures

/*

Key Takeaways
  1. Closures : lexical scope + backpack
  2. Rest Operator + Spread Operator
  3. setTimeout(cbFunc, delayInMs, ...cbFuncArgs)
  4. for/in vs for/of : for/in iterating over keys of obj, for/of iterating over elems of iterable (array, str, etc.)
    4a. don't forget to use let in for/in for/of
    4b. Object.keys().forEach() vs for/in
  4. new Date().toDateString()
  5. Syntax
    5a. can return function without naming it
    5b. simple arrow functions without parenthesis/brackets (ex. n => n * 2)
  6. reduce(callbackFunc(accum, currVal), initAccum)
    6b. alt: forEach with update to str1 each time (ex. str1 = str1.replace(key, pairs[key]))
  7. str.replace(pattern, replacement)
    7a. pattern can be string or RegExp ; replacement can be string or function who's return val is replacement
*/

// Challenge 1: createFunction
{
  function createFunction() {
    function helloWorld() {
      return 'hello world';
    }
    return helloWorld;
  }

  const myFunction = createFunction();
  console.log(myFunction()); //should log: 'hello world'
}

// Challenge 2: createFunctionWithInput
{
  function createFunctionWithInput(input) {
    function innerFunction(){
      return input;
    }
    return innerFunction;
  }

  const sampleFunc = createFunctionWithInput('sample');
  console.log(sampleFunc()); // should log: 'sample'
  const helloFunc = createFunctionWithInput('hello');
  console.log(helloFunc()); // should log: 'hello'
}

// Challenge 3: Scoping
{
  function outer() {
    let counter = 0; // this variable is outside incrementCounter's scope
    function incrementCounter() {
      counter++;
      console.log('counter', counter);
    }
    return incrementCounter;
  }

  const willCounter = outer();
  const jasCounter = outer();
}

// Challenge 4: addByX
{
  function addByX(x) {
    function myFunction(input) {
      return input + x;
    }
    return myFunction;
  }

  const addByTwo = addByX(2);

  console.log(addByTwo(1));
  console.log(addByTwo(2));

  const addByThree = addByX(3);
  console.log(addByThree(1)); //should return 4
  console.log(addByThree(2)); //should return 5

  const addByFour = addByX(4);
  console.log(addByFour(4)); //should return 8
  console.log(addByFour(10)); //should return 14
}

// Challenge 5: once
{
  // Note: rest operator in func def; array of all args passed
  // Note: spread operator in func call, passes all args in array
  function once(cb) {
    let hasBeenCalled = false;
    let cachedValue;
    function cbOnceified(...args) {
      if(!hasBeenCalled) {
        cachedValue = cb(...args);
        hasBeenCalled = true;
      }
      return cachedValue;
    }
    return cbOnceified;
  }
  
  const addByTwoOnce = once(function(num) {
    return num + 2;
  });
  
  console.log(addByTwoOnce(5));  //should log 7
  console.log(addByTwoOnce(10));  //should log 7
  console.log(addByTwoOnce(9001));  //should log 7
}

// Challenge 6: after
{
  function after(x, cb) {
    let cbCalls = 0;
    function cbAfterXCalls(...args) {
      cbCalls++;
      if(cbCalls >= x) {
        return cb(...args);
      }
    }
    return cbAfterXCalls;
  }

  const called = function(string) { return('hello ' + string); };
  const afterCalled = after(3, called);

  console.log(afterCalled('world')); // -> undefined is printed
  console.log(afterCalled('world')); // -> undefined is printed
  console.log(afterCalled('world')); // -> 'hello world' is printed
}

// Challenge 7: delay
{
  function delay(cb, waitTimeInMs) {
    function delayedCb(...args) {
      setTimeout(cb, waitTimeInMs, ...args);
    }
    return delayedCb;
  }

  let count = 0;
  const delayedFunc = delay(() => count++, 1000);
  delayedFunc();
  console.log(count); 												 // should print '0'
  setTimeout(() => console.log(count), 1000); // should print '1' after 1 second
}

// Challenge 8: saveOutput
{ 
  // Note: don't be messy, declare vars if not needed
  function saveOutput(cb, pwdStr) {
    const cache = {};
    function cbWithPwdProtectedHistory(arg){
      if(arg === pwdStr) return cache;
      else {
        cache[arg] = cb(arg);
        return cache[arg];
      }
    }
    return cbWithPwdProtectedHistory;
  }

  const multiplyBy2 = function(num) { return num * 2; };
  const multBy2AndLog = saveOutput(multiplyBy2, 'boo');
  console.log(multBy2AndLog(2));  // should log: 4
  console.log(multBy2AndLog(9));  // should log: 18
  console.log(multBy2AndLog('boo')); // should log: { 2: 4, 9: 18 }
}

// Challenge 9: cycleIterator
{
  function cycleIterator(array) {
    // variables to hold array and current iteration point
    let index = 0;
    function arrayIterator() {
      if(index > array.length - 1) index = 0;
      return array[index++];
    }
    return arrayIterator;
  }

  const threeDayWeekend = ['Fri', 'Sat', 'Sun'];
  const getDay = cycleIterator(threeDayWeekend);
  console.log(getDay()); // should log: 'Fri'
  console.log(getDay()); // should log: 'Sat'
  console.log(getDay()); // should log: 'Sun'
  console.log(getDay()); // should log: 'Fri'
}

// Challenge 10: defineFirstArg
{
  function defineFirstArg(func, firstArg) {
    function funcWithDefaultFirstArg(...args) {
      return func(firstArg, ...args);
    }
    return funcWithDefaultFirstArg;
  }

  const subtract = function(big, small) { return big - small; }
  const subFrom20 = defineFirstArg(subtract, 20);
  console.log(subFrom20(5));  // should log: 15
}

// Challenge 11: hobbyTracker
{
  // Note: for/in for iterating keys of obj, for/of for iterating vals of array
  // Note: Object.keys() vs for/in
  // Note: when using for/in , make sure to use 'let', some IDEs error and some don't
  function hobbyTracker(hobbies) {
    const cache = {};
    // add all hobbies as keys with value 0
    hobbies.forEach((hobby) => cache[hobby] = 0);

    function trackHobbyHours(hobby, hours){
      if(!hobby || !hours) {
        // reset all values in cache to 0, return reset string
        for(let key in cache) { cache[key] = 0; }
        // Note: alt --> Object.keys().forEach((key) => cache[key] = 0);
        return 'tracker has been reset!';
      }
      if(!cache.hasOwnProperty(hobby)) {
        return 'invalid hobby';
      }
      cache[hobby] = cache[hobby] + hours;
      return cache;
    }

    return trackHobbyHours;
  }

  const updateHobbies = hobbyTracker(['yoga', 'baking', 'piano']);
  updateHobbies('yoga', 2);
  updateHobbies('baking', 4);
  updateHobbies('yoga', 1);
  console.log(updateHobbies('piano', 2)); // --> { yoga: 3, baking: 4, piano: 2 }
  console.log(updateHobbies()); // --> 'tracker has been reset!'
  console.log(updateHobbies('baking', 1)); // --> { yoga: 0, baking: 1, piano: 0
}

// Challenge 12: dateStamp
{
  function dateStamp(func) {

    // Note: do not need to define function name, can return directly
    return function(...args) {
      return {
        date : new Date().toDateString(),
        output: func(...args)
      };
    }
  }
  // Note: notice syntax for simple func with one arg and one exp, no parenthesis
  const stampedMultBy2 = dateStamp(n => n * 2);
  console.log(stampedMultBy2(4)); // should log: { date: (today's date), output: 8 }
  console.log(stampedMultBy2(6)); // should log: { date: (today's date), output: 12 }
}

// Challenge 13: censor
{
  // Note: reduce(callbackFunc(accum, currVal), initAccum)
  // Note: alt --> forEach with update to str1 each time (ex. str1 = str1.replace(key, pairs[key]))
  function censor() {
    const pairs = {};
    return function(str1, str2) {
      if(str1 && str2) {
        // save pair
        pairs[str1] = str2;
      } else {
        // return str1 transformed by pair obj
        return Object.keys(pairs).reduce((str, key) => str.replace(key, pairs[key]), str1);
      }
    } 
  }

  const changeScene = censor();
  changeScene('dogs', 'cats');
  changeScene('quick', 'slow');
  console.log(changeScene('The quick, brown fox jumps over the lazy dogs.'));
}