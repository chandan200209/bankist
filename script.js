'use strict';

// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
//   type: 'premium'
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
//   type: 'standard'
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
//   type: 'premium'
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
//   type: 'basic'
// };

// const accounts = [account1, account2, account3, account4];

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2025-01-28T09:15:04.904Z',
    '2025-04-01T10:17:24.185Z',
    '2025-05-08T14:11:59.604Z',
    '2025-08-27T17:01:17.194Z',
    '2025-11-04T23:36:17.929Z',
    '2025-11-08T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'fr-FR',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2025-04-10T14:43:26.374Z',
    '2025-11-06T18:49:59.371Z',
    '2025-11-08T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const combinedDateMoves = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i)
  }));

  if (sort) combinedDateMoves.sort((a, b) => a.movement - b.movement);
  combinedDateMoves.forEach(function (obj, i) {
    // destructuring the object
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const wholeDate = new Date(movementDate);
    // const displayDate = formatMovementDate(wholeDate);
    const displayDate = formatMovementDate(wholeDate, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);
    const html =
      `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (accountName) {
  accountName.balance = accountName.movements.reduce((acc, mov) => acc + mov, 0);
  // labelBalance.textContent = `${accountName.balance.toFixed(2)}€`;
  labelBalance.textContent = formatCur(accountName.balance, accountName.locale, accountName.currency);
};

const calcDisplaySummary = function (accountName) {
  const incomes = accountName.movements.filter(mov => mov > 0).reduce((acc, curMov) => acc + curMov, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCur(incomes, accountName.locale, accountName.currency);
  const out = accountName.movements.filter(mov => mov < 0).reduce((acc, curMov) => acc + curMov, 0);
  // labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumOut.textContent = formatCur(out, accountName.locale, accountName.currency);
  const interest = accountName.movements.filter(mov => mov > 0).map(deposit => (deposit * accountName.interestRate / 100)).filter((intr, i, arr) => intr >= 1).reduce((acc, intr) => acc + intr, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCur(interest, accountName.locale, accountName.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join("");
  })
};
createUsernames(accounts);

const updateUI = function (accountName) {
  // display movements
  displayMovements(accountName);
  // display summary
  calcDisplaySummary(accountName);
  // display balance
  calcDisplayBalance(accountName);
}
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(timerSec / 60)).padStart(2, 0);
    const sec = String(Math.trunc(timerSec % 60)).padStart(2, 0);
    // in every call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;
    // when 0 seconds, stop timer and log out user
    if (timerSec === 0) {
      clearInterval(logOutTimer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    // decrese the time
    timerSec--;
  }
  // set time to 5 minutes
  let timerSec = 100;
  tick();
  // call the timer every second
  const logOutTimer = setInterval(tick, 1000);
  return logOutTimer;
};

let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

// Event Handlers
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if (currentAccount?.pin === +(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    // create current date and time
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      min: 'numeric',
      day: 'numeric',
      month: 'short', // other options can be 2-digit, long or numeric
      year: 'numeric',
      // weekday: 'long'
    }
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username) {
    // Doing the transfer
    currentAccount.movements.push(+(-amount));
    receiverAccount.movements.push(+(amount));
  }
  // add transfter date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAccount.movementsDates.push(new Date().toISOString());

  // Update UI
  updateUI(currentAccount);

  // Reset the timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {// grant loan
      currentAccount.movements.push(amount);
      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // update UI
      updateUI(currentAccount);
    }, 2500);
  };
  inputLoanAmount.value = '';

  // Reset the timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && +(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);

    // hides the UI
    containerApp.style.opacity = 0;
  }
  inputClosePin = inputCloseUsername = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})

// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// creating shallow copies
// console.log(arr.slice());
// console.log([...arr]);

// splice
// console.log(arr.splice(2));
// console.log(arr.splice(-1));
// deletes the last element
// console.log(arr);
// splice deletes the elements and returns the remaining ones.
// arr.splice(1, 2);
// console.log(arr);

// reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// join
// console.log(letters.join('-'));

// at method
// arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(2));

// getting the last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log(arr.at(-2));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log('---- FOR OF ----');

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} : You deposited ${movement}`);
//   }
//   else {
//     console.log(`Movement ${i + 1} : You withdrew ${Math.abs(movement)}`);

//   }
// }
// console.log('---- FOR EACH ----');
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} : You deposited ${movement}`);
//   }
//   else {
//     console.log(`Movement ${i + 1} : You withdrew ${Math.abs(movement)}`);
//   }
// })

// console.log('Map');

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// // set
// console.log('Set');

// const currenciesUnique = new Set(['USD', 'USD', 'GBP', 'EUR', 'YEN', 'EUR']);
// // console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value} : ${value}`);
// })

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsJuliaCorrected = dogsJulia.slice();
// dogsJuliaCorrected.splice(0, 1);
// dogsJuliaCorrected.splice(-2);
// const dogsKate = [4, 1, 15, 8, 3];
// const checkDogs = function (arr) {
//   arr.forEach(function (dogs, i) {
//     const adultOrPuppy = dogs >= 3 ? `an adult, and is ${dogs} years old.` : `still a puppy 🐶`;
//     const str = `Dog number ${i + 1} is ` + adultOrPuppy;
//     console.log(str);
//   });
// }
// console.log('Julia\'s dogs');
// checkDogs(dogsJuliaCorrected);
// console.log('Kate\'s dogs');
// checkDogs(dogsKate);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUSD = 1.1;
// const movementsUSD = movements.map(mov => mov * euroToUSD);
// console.log(movementsUSD);

// const movementsDescriptions = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1} : You deposited ${mov}`;
//   }
//   else {
//     return `Movement ${i + 1} : You withdrew ${Math.abs(mov)}`;
//   }
// });
// console.log(movementsDescriptions);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);

// const balance = movements.reduce(function (acc, mov, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + mov;
// }, 0);
// console.log(balance);

// maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);

// const dogsArr = [5, 2, 4, 1, 15, 8, 3];
// const humanAge = dogsArr.map(function (cur, i) {
//   if (cur <= 2) {
//     return 2 * cur;
//   }
//   else {
//     return 16 + cur * 4;
//   }
// })
// const filteredHumanAge = humanAge.filter(function (human) {
//   return human >= 18;
// })
// const sum = filteredHumanAge.reduce(function (acc, dog) {
//   return acc + dog;
// }, 0)
// const avg = sum / (filteredHumanAge.length);
// console.log(avg);

// const euroToUSD = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const totalDeposits = movements.filter(mov => mov > 0).map((mov, i, arr) => {
//   console.log(arr);
//   return mov * euroToUSD;
// }).reduce((acc, cur) => acc + cur, 0);
// console.log(totalDeposits);

// const dogsArr = [5, 2, 4, 1, 15, 8, 3];
// const avg = dogsArr.map(dogAge => dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4).filter(age => age >= 18).reduce((acc, el, i, arr) => {
//   return acc + el / arr.length;
// }, 0)
// console.log(avg);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements.findLast(mov => mov < 0));
// greater than 2000
// const index = movements.findLastIndex(mov => Math.abs(mov) >= 2000);
// const amount = movements.findLast(mov => Math.abs(mov) >= 2000);
// const str = `Your last large transaction of ${amount} was ${movements.length - index - 1} movements ago.`;
// console.log(str);

// equality
// console.log(movements.includes(-400));
// some method
// console.log(movements.some(mov => mov > 0));
// every method : each entity must satisfy the condition
// console.log(account4.movements.every(mov => mov > 0));

// separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// it will then goes two levels deep
// console.log(arrDeep.flat(2)); 

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// flat
// const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);
// flatMap : it goes only one level deep
// const overallBalance = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// Challenge 04
/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];

// const huskyWeight = breeds.find(dogBreed => dogBreed.breed === 'Husky').averageWeight;
// console.log(huskyWeight);

// const breedName = breeds.find(dogBreed => dogBreed.activities.includes('running') && dogBreed.activities.includes('fetch')).breed;
// console.log(breedName);

// const allActivities = breeds.flatMap(breed => breed.activities);
// console.log(allActivities);

// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

// const swimmingAdjacent = [...new Set(breeds.filter(dog => dog.activities.includes('swimming')).flatMap(breed => breed.activities))].filter(activity => activity !== 'swimming');
// console.log(swimmingAdjacent);

// console.log(breeds.every(breed => breed.averageWeight >= 10));

// console.log(breeds.some(breed => breed.activities.length >= 3));

// const arrayWeight = [...breeds.filter(breed => breed.activities.includes('fetch')).map(breedName => breedName.averageWeight)];
// console.log(Math.max(...arrayWeight));

// const owners = ['Martha', 'Jonas', 'Mikkel', 'Adam', 'Bartosz'];
// console.log(owners.sort());
// sort method does sorting based on strings only (by default)
// console.log(movements);

// return < 0 : A, B (no switch)
// return > 0 : B, A (switch order)
// comparator function

// ascending order
// movements.sort((a, b) => {
//   if (a < b) return -1;
//   if (a > b) return 1;
// });
// movements.sort((a, b) => a - b);
// console.log(movements);
// descending order
// movements.sort((a, b) => {
//   if (a < b) return 1;
//   if (a > b) return -1;
// });
// movements.sort((a, b) => b - a);
// console.log(movements);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const groupedMovements = Object.groupBy(movements, movement => movement > 0 ? 'deposits' : 'withdrawals');
// console.log(groupedMovements);

// const groupedByActivity = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;
//   if (movementCount >= 8) return 'vey active';
//   if (movementCount >= 4) return 'active';
//   if (movementCount >= 0) return 'regular';
//   return 'inactive';
// });
// console.log(groupedByActivity);

// const groupByTypes = Object.groupBy(accounts, account => account.type);
// const groupByTypes = Object.groupBy(accounts, ({ type }) => type);
// console.log(groupByTypes);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// const x = new Array(8);
// console.log(x);
// x.fill(4); 
// x.fill(3, 3); // beginning index
// x.fill(3, 1, 6); // beginning and ending index
// arr.fill(2); // mutating the original array
// console.log(x);
// console.log(arr);

// Array.from()
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// 100 random dice rolls
// const diceRolls = Array.from({ length: 100 }, (_, i) => i = Math.trunc((Math.random()) * 6 + 1));
// console.log(diceRolls);

// labelBalance.addEventListener('click', () => {
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => +(el.textContent.replace('€', '')));
//   console.log(movementsUI.map(el => el.textContent.replace('€', '')));
//   console.log(movementsUI);
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// })

// console.log(movements);
// const reverseMovements = movements.reverse();
// console.log(reverseMovements);
// const revMovements = movements.toReversed();
// console.log(revMovements);

// const sortMovements = movements.sort();
// console.log(sortMovements);
// const sortedMovements = movements.toSorted();
// console.log(sortedMovements);

// const splicedMovements = movements.splice(2, 3);
// const splicedMovements = movements.toSpliced(2, 3);
// console.log(splicedMovements);
// console.log(movements);

// movements[2] = 30000;
// const newArray = movements.with(2, 30000);
// console.log(newArray);
// console.log(movements);

// Exercise 01
// const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// Exercise 02
// const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
// const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => cur >= 1000 ? ++count : count, 0);
// console.log(numDeposits1000);

// Prefix increment operator
// let a = 10;
// console.log(a++);
// console.log(a);
// console.log(++a);

// Exercise 03
// const sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
//   return sums;
// },
//   { deposits: 0, withdrawals: 0 });
// console.log(sums);

// const { deposits, withdrawals } = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//   return sums;
// },
//   { deposits: 0, withdrawals: 0 });
// console.log(deposits, withdrawals);

// Exercise 04 : Title Case
// const convertTitleCase = function (title) {
//   const exceptions = ['a', 'an', 'the', 'on', 'and', 'for', 'with', 'but', 'or', 'in', 'is'];
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : capitalize(word)).join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('Javascript is the best language'));
// console.log(convertTitleCase('brendan Eich is the creator'));
// console.log(convertTitleCase('it\'s used in many applications'));

// Coding Challenge #5
/*
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose)
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
//   { weight: 18, curFood: 244, owners: ['Joe'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 01
// const calcRecommendedFood = function (weight) {
//   return weight ** 0.75 * 28;
// }
// dogs.forEach(function (dog) {
//   dog.recFood = Math.floor(calcRecommendedFood(dog.weight));
// });
// console.log(dogs);

// // 02
// dogs.find(dog => dog.owners.includes('Sarah')).curFood > dogs.find(dog => dog.owners.includes('Sarah')).recFood ? console.log('It\'s eating too much.') : console.log('It\'s eating too little.');

// // 03
// const ownersTooMuch = dogs.filter(dog => dog.curFood > dog.recFood).flatMap(dog => dog.owners);
// console.log(ownersTooMuch);
// const ownersTooLittle = dogs.filter(dog => dog.curFood < dog.recFood).flatMap(dog => dog.owners);
// console.log(ownersTooLittle);

// // 04
// console.log(`${ownersTooMuch.join(' and ')}'s dogs are eating too much.`);
// console.log(`${ownersTooLittle.join(' and ')}'s dogs are eating too little.`);

// // 05
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 06
// const checkEatingOkay = dog => dog.curFood < dog.recFood * 1.10 && dog.curFood > dog.recFood * 0.90;
// console.log(dogs.every(checkEatingOkay));

// // 07
// const dogsEatingOkay = dogs.filter(checkEatingOkay);
// console.log(dogsEatingOkay);

// // 08
// const dogsGroupedByPortion = Object.groupBy(dogs, dog => {
//   if (dog.curFood > dog.recFood) return 'too-much';
//   else if (dog.curFood < dog.recFood) return 'too-little';
//   return 'exact';
// });
// console.log(dogsGroupedByPortion);

// // 09
// const dogsGroupByNumOwners = Object.groupBy(dogs, dog => `${dog.owners.length}-owners`);
// console.log(dogsGroupByNumOwners);

// // 10
// const sortedArray = dogs.toSorted((a, b) => a.recFood - b.recFood);
// console.log(sortedArray);

// LECTURES FOR NUMBERS, DATES, INTL AND TIMERS

// console.log(23 === 23.0);
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3); // it will give false (error)

// conversion
// console.log(Number('23'));
// console.log(+'23'); // coercion (automatically done)

// parsing
// console.log(Number.parseInt('23px', 10)); // radix
// console.log(Number.parseInt('e435', 10));

// console.log(Number.parseFloat('24.7rem'));
// console.log(Number.parseInt('24.7rem'));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20xy'));
// console.log(Number.isNaN('20/0')); // gives us Infinity

// checking if the value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20xy'));
// console.log(Number.isFinite('20/0'));

// console.log(Number.isInteger(20));
// console.log(Number.isInteger(20.0));
// console.log(Number.isInteger('20/0'));

// console.log(Math.sqrt(36));
// console.log(Math.sqrt(67));
// console.log(289 ** (1 / 2));
// console.log(729 ** (1 / 3));
// console.log(Math.max(3, 5, 2, 7, 3, 9, 5));
// console.log(Math.max(3, 5, '8', '10', 2, 4, '90'));
// console.log(Math.max(3, 5, '8rem', '10px', '90'));
// console.log(Math.min(3, 2, 1));

// calculating the area of a circle
// console.log(Math.PI * parseInt('10px') ** 2);
// random die roll
// console.log(Math.floor(Math.random() * 6) + 1);
// generalized function for random numbers

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// console.log(randomInt(10, 20));
// console.log(randomInt(0, 4));

// console.log(Math.round(23.3));
// console.log(Math.trunc(54.33));
// console.log(Math.ceil(56.22));
// console.log(Math.floor(23.08));

// comparing floor, ceil and trunc for negative numbers
// console.log(Math.trunc(-23.4));
// console.log(Math.floor(-23.4));
// console.log(Math.ceil(-23.4));

// Rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.745).toFixed(2));
// console.log((2.7).toFixed(4));
// console.log(+(2.7).toFixed(4));

// const isEven = num => num % 2 === 0;
// console.log(isEven(48));
// console.log(isEven(49));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'aqua';
//     }
//   });
// });

// diameter of the sun
// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceCents = 234_90;
// console.log(priceCents);

// const PI = 3.14_15;
// const PI = 3._1415; // error
// const PI = 3_.1415; // error
// console.log(PI);

// console.log(Number('56_000')); // NaN
// console.log(parseInt('12_00'));

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 0);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4); // not giving precise result
// console.log(2 ** 53 + 5);

// console.log(238439084038403480384930n);
// console.log(BigInt(87238273927));
// console.log(Math.sqrt(16n)); // error

// Operations
// console.log(10000n + 30000n);

// const huge = 823728973927382n;
// console.log(huge + ' is really big !!');
// const num = 82734293;
// console.log(huge * BigInt(num));

// console.log(typeof 16n);
// console.log(16n === 16);
// console.log(16n == 16);
// console.log(20n > 16);

// division operation
// console.log(12n / 4n);
// console.log(13n / 4n);

// creating a date
// const now = new Date();
// console.log(now);

// console.log(new Date('24 Sept 2024 18:50:26'));
// console.log(new Date('Sept 19 2024 18:50:26'));
// console.log(new Date('January 08 2024'));
// console.log(new Date(account1.movementsDates[4]));
// console.log(new Date(2021, 10, 30, 12, 30, 9)); // months are 0 based; 10 means November
// console.log(new Date(2021, 4, 34)); // greater than 30/31 days shift to next months

// Unix Time - 01 Jan 1970
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates
// const future = new Date(2024, 8, 23, 11, 39);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getUTCFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getDate());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime()); // timestamp
// console.log(new Date(1727071740000));
// console.log(Date.now());
// future.setMonth(3);
// console.log(future);

// const futureDate = new Date(2026, 10, 19, 20, 30);
// console.log(+futureDate);
// const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
// const days1 = calcDaysPassed(new Date(2023, 9, 10), new Date(2023, 9, 25));
// console.log(days1);
// we can use JS library moment.js for all the exceptional changes like daylight savings.

// const num = 12435891.51;
// const options = {
//   style: "currency",
//   // unit: "celsius",
//   currency: "EUR",
//   // useGrouping: false
// }
// const options = {
//   style: "unit",
//   unit: "mile-per-hour"
// }
// console.log('US : ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany : ', new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Syria : ', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(navigator.language, new Intl.NumberFormat(navigator.language, options).format(num));

// const ingredients = ['olives', 'jalapeno'];
// const pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`), 3300, ...ingredients);
// console.log('Waiting for pizza..');
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);

// }, 1000);

// real-time clock
// setInterval(function () {
//   const current = new Date();
//   const hour = `${current.getHours(current)}`.padStart(2, 0);
//   const minute = `${current.getMinutes(current)}`.padStart(2, 0);
//   const seconds = `${current.getSeconds(current)}`.padStart(2, 0);
//   console.log(`${hour}:${minute}:${seconds}`);
// }, 1000);