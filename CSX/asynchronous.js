/*
  Asynchronous Javascript

  Key Takeaways:
    1. Review

  Overview: 
    0. slides: https://drive.google.com/file/d/1NVOGU8gI2qEJ-2cl_-ZUg1U-GGiGsQvk/view
    1. singe-threaded challenges in js
    2. how asynchronity enables modern web dev
    3. challenge w/ asynchronity in js ; how promises fix prob of inversion of control
    4. experiment: setTimeout
      - how event (ex. HTTP resp, button click), paired w/ async callbacks to update DOM to give user feedback
      - DOM: document object model
    5. mental models of async in js (ex. event loop, callback queue) not enough
      - new: native promises, async/await
    6. non-blocking vs blocking behavior when waiting for action to finish
      - ex. starting timer, reading file, requesting data from server

  Notes: 
    1. basic review 
      - function call: retrieves function code to execute in memory, not going back to that line in processing, top to bottom
      - execution context: processing power to go through code line by line + memory to store stuff we encounter
      - call stack: tracking execution context, where you're at right now (top)
    2. pure js: single threaded
      - browser: js + xhr + DOM + web rendering engine + indexDB + localStorage + timer + ...
        - js version of browser tool interactions above: fetch, document, localStorage, setTimeout, ...
        - all these done outside js engine in web browser
        - 'fascade' functions / 'APIs'
    3. setTimeout(cbFunc, delayInMS) : not actually running in js, using browser Timer, eventually placing cbFunc in 'Task Queue / Callback Queue'
      - Task Queue: uses "Event Loop" to determine if functions on queue can run
      - Event Loop: fundamental condition check on call stack --> no funcs on stack and all global code finished executing
    4. Promises: hold placeholder values populated with return value once fascade function completed and cbFunc to trigger on completion
      - props: value, onFulfilled (hidden property, array)
      - value: populated on completion --> triggers all funcs onFulfilled to be run
      - diff from single-pronged fascade like setTimeout() - not placing func in Task Queue and then Call Stack
      - onFulfilled hidden property, use .then(cbFunc) to add func to onFulfilled array
      - futureDataPromise.then(func) : only adding func to tha array, not executing func after completion on that line
      - mult cb functions: do .then one at a time.
      - .then() with 2 args: first arg = cbFuncOnCompletion, second arg = cbFuncOnRejected (added to onRejected func array)
      - .catch()
      - on promise completion (status = resolved), funcs to exec added to 'Microtask Queue', not 'Task Queue'
      - Microtask Queue: executed with priority over Task Queue
      - Promise.resolve(x) ?
    4. two-pronged fascade functions: initiate browser work + immediately return Promise
    5. js: synchronous execution, asynchronous input/output
    6. 3 rules of execution with asynch delayed code
      i. hold promise-deferred funcs in 'microtask queue' and non-promise deferred funcs in 'task queue' when API 'completes'
      ii. add func to call stack (aka. exec func) ONLY when call stack totally empty
        - 'Event Loop' checks this condition
      iii. Prioritize tasks (callbacks) in microtask queue over regular task queue
*/

// Challenge 1: setTimeout
{
  // Note: even if the async function finishes quickly, cbFunc not called until after call stack empty (global exec context done running)
  const cbFunc = () => console.log('I am in the setTimeout callback function');
  console.log('I am at the beginning of the code');
  setTimeout(cbFunc, 600); // even if 0, executes last because func exec after call stack empty
  console.log('I am at the end of the code');
}

// Challenge 2: forEach
{
  // Note: avoid passing cbFunc with args to setTimeout if already able to pass info in cbFunc exec
  function forEach(arr, cb) {
    for(let idx = 0; idx < arr.length; idx++) {
      cb(arr[idx], idx);
    }
  }

  const delays = [ 200, 500, 0, 350 ];

  function delayLog(delayTime, i) {
    // const cbFunc = (idx) => console.log('printing element ' + idx);
    // setTimeout(cbFunc, delayTime, i);

    setTimeout(() => console.log(`printing element ${i}`), delayTime);
  }

  forEach(delays, delayLog); // ==> 'printing element 2' 'printing element 0' 'printing element 3' 'printing element 1'
}

// Challenge 3: ajaxSimulate
{
  let dataReceived;

  function ajaxSimulate(id, callback) {
    const database = ['Aaron', 'Barbara', 'Chris'];

    // set timer to call cbFunc with func arg: db element at idx = id ; after 0 ms
    setTimeout(callback, 0, database[id]);

    // Note: alt way to use setTimeout w/ callbackFunc w/ args
    // setTimeout(() => { callback(database[id]) }, 0);
  }

  function storeData(data){
    dataReceived = data;
    console.log(dataReceived); // expectation: actual value
  }

  ajaxSimulate(1, storeData);
  console.log(dataReceived);  // expectation: undefined right after; call stack must be empty before cbFunc runs
}

// Challenge 4: limitedInterval
{
  // Note: tricky, understand problem and expected output
  function limitedInterval(callback, wait, limit) {
    // run cb once every wait ms, up to limit ms
    while(limit >= wait){
      setTimeout(callback, wait);
      limit -= wait;
    }
  }

  limitedInterval(() => console.log('repeating'), 100, 550); // should log 'repeating' once per 100 ms, five times
}

// Challenge 5: runInOrder
{
  /* should log: 'hi' (after 300 ms) 'bye' (600 ms after 'hi') 'howdy' (200 ms after 'bye') */
  function runInOrder(funcArr, waitTimeInMsArr, idx = 0) {
    // exec funcs in order w/ ms wait time b/w invocations (BETWEEN)

    // for(let i = 0; i < funcArr.length; i++) {
    //   setTimeout(funcArr[i], waitTimeInMsArr[i]);
    // }

    // if(idx === funcArr.length) return;
    // setTimeout(funcArr[idx], waitTimeInMsArr[idx]);
    // setTimeout(runInOrder, waitTimeInMsArr[idx], funcArr, waitTimeInMsArr, idx+1);

    let time = 0;
    for(let i = 0; i < funcArr.length; ++i) {
      time += waitTimeInMsArr[i];
      setTimeout(funcArr[i], time);
    }
  }

  function sayHi() {
    console.log('hi');
  }
  function sayBye() {
    console.log('bye');
  }
  function sayHowdy() {
    console.log('howdy');
  }
  
  runInOrder([sayHi, sayBye, sayHowdy], [200, 100, 300]);
}