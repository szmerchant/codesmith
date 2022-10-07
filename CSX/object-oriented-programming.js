/*
  Object Oriented Programming

  Key Takeaways:

    1. Refer to notes
    2. New Object Creation Ways: {} --> Object.create(prototypeObject) --> 'new' --> 'class'
    3. 'this', 'new', 'constructor', function object's 'prototype', '__proto__' bond
    4. extends, super

  Notes:

    1. Overview: Object.create(), constructor functions, ES6 class syntax, prototype chain
      1a. MDN Intheritance and Prototype Chain: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
      1b. Object.create(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
      1c. constructor functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#using_a_constructor_function
      1d. ES6 class syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
    2. Workshop
      2a. 4 approaches to OOP in js
        i. Gen objs using func ; 'factory function' generates + returns new obj everytime
        ii. Object.create() ; using prototype chain
          - Object.create(prototypeObj) ; creates new empty object with 'bond' to prototypeObj elements
          - Pro: one copy of common obj functions vs a copy per obj
          - Method: function attached to an object
            - When object's method runs, all instances of 'this' keyword within method refer to object
          - 'bond' === 'dunder proto' === __proto__ ; (dunder like double underscore)
          - Con: global variables bad practice, dangerous having all functions exposed like that, repetitive pattern
          - Not used much anymore, older practice before ES 2015 version introduced 'new' keyword
        iii. 'new' keyword
          - Automates two parts of above: no need to return obj, no need to initialize obj
            - so, new obj always named 'this' by default in local mem ; 'this' returned at end of function
            - sets '__proto__' of new 'this' object to point to 'prototype' object inside function in its object form
              - functions are objects with keys like 'prototype' and '[[call]]' which contains function code to execute
              - myFunction() vs myFunction.param
              - 'prototype' object itself has a '__proto__' variable linking to the 'prototype' object of the next object up 
                - ex. Object which contains 'hasOwnProperty' method
          - pattern: these functions conventionally capitalized, like a class
          - Pros
            - faster to write, still common practice
            - functions protected inside 'prototype' object
            - automating two parts wtih 'new' keyword
          - Cons
            - most devs don't know how to use it
            - have to uppercase function to know it requires 'new' to work
          - (2016, ES6, ES2015) came out, 'class' keyword, syntactical sugar, combine 'constructor' function and shared 'prototype' methods in one code construct
        iv. 'class' keyword
          - reserved 'constructor' keyword for object instantiation code
          - everything outside of 'constructor' --> stick in prototype
          - still the same under the hood! just syntax pref
          - Pros: new standard, similar to other langs like Java/Pythong
      2b. Prototype, __proto__, prototype chain
      2c. Factories, constructors, classes
      2d. ES5 / ES6 approaches
    3. Object.create()
      3a. Object.create(null) --> empty object, always empty object, params can populate
*/

// 4 Approaches to OOP in JS
{ // 1. Simple factory functions
  function userCreator(name, score) {
    const newUser = {};
    newUser.name = name;
    newUser.score = score;
    newUser.increment = function() {
      newUser.score++;
    };
    return newUser;
  }

    const user1 = userCreator('Will', 3);
    const user2 = userCreator('Tim', 5);
    user1.increment();
}
{ // 2. Object.create() w/ optional prototype object parameter
  function userCreator(name, score) {
    const newUser = Object.create(userFunctionStore);
    newUser.name = name;
    newUser.score = score;
    return newUser;
  }

  const userFunctionStore = {
    increment: function() { this.score++; },
    login: function() { console.log("Logged in"); }
  };

  const user1 = userCreator('Will', 3);
  const user2 = userCreator('Tim', 5);
  user1.increment();
}
{ // 3. 'new' keyword : automate obj creation and return, capitalized func name, new 'this' object, shared funcs saved as methods of 'prototype' obj in func obj
  function UserCreator(name, score) {
    this.name = name;
    this.score = score;
  }

  UserCreator.prototype.increment = function() {
    this.score++;
  };
  UserCreator.prototype.login = function() {
    console.log("login");
  };

  const user1 = new UserCreator('Eva', 9);

  user1.increment();
}
{ // 4. 'class' keyword : same as 3, new syntax grouping 'constructor' function and other shared functions/objects in 'prototype' obj of func obj
  class UserCreator {

    constructor(name, score) {
      this.name = name;
      this.score = score;
    }

    increment() {
      this.score++;
    }

    login() {
      console.log("login");
    }
  }

  const user1 = new UserCreator('Eva', 9);

  user1.increment();
}

// Challenge 1, 2, 3, 4: makePerson, personStore, personFromPersonStore, introduce
{
  // 1
  function makePerson(name, age) {
    const newPerson = {};
    newPerson.name = name;
    newPerson.age = age;
    return newPerson;
  }
  const vicky = makePerson('Vicky', 24);
  console.log(vicky.name); // -> Logs 'Vicky'
  console.log(vicky.age); // -> Logs 24

  // 2, 4
  const personStore = {
    greet: function() { console.log('hello'); },
    introduce: function() { console.log('Hi, my name is ' + this.name); }
  }
  personStore.greet();

  // 3
  function personFromPersonStore(name, age) {
    const newPerson = Object.create(personStore);
    newPerson.name = name;
    newPerson.age = age;
    return newPerson;
  }
  const sandra = personFromPersonStore('Sandra', 26);
  console.log(sandra.name); // -> Logs 'Sandra'
  console.log(sandra.age); // -> Logs 26
  sandra.greet(); // -> Logs 'hello'
}

// Challenge 5, 6, 7: PersonConstructor, personFromConstructor, introduce(cont.)
{
    // 5
    function PersonConstructor() {
      this.greet = function() { console.log('hello'); };
      // 7
      this.introduce = function() { console.log('Hi, my name is ' + this.name); };
    }
    const simon = new PersonConstructor();
    simon.greet();
  
    // 6
    function personFromConstructor(name, age) {
      const newPerson =  new PersonConstructor();
      newPerson.name = name;
      newPerson.age = age;
      return newPerson;
    }
    const mike = personFromConstructor('Mike', 30);
    console.log(mike.name); // -> Logs 'Mike'
    console.log(mike.age); // -> Logs 30
    mike.greet(); // -> Logs 'hello'

    // 7
    mike.introduce(); // -> Logs 'Hi, my name is Mike'
}

// Challenge 8, 9: PersonClass, DeveloperClass
{
  class PersonClass {
    constructor(name) {
      this.name = name;
    }
    greet() {
      console.log('hello');
    }
  }

  const george = new PersonClass('George');
  george.greet();

  class DeveloperClass extends PersonClass {
    constructor(name) {
      super(name);
    }
    introduce() {
      console.log('Hello World, my name is ' + this.name);
    }
  }

  const thai = new DeveloperClass('Thai', 32);

  console.log(thai.name); // -> Logs 'Thai'
  thai.introduce(); // -> Logs 'Hello World, my name is Thai'
}