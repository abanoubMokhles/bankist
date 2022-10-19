'use strict';

/**********************BANKIST APP**********************/

/*  Data
===========*/
const account1 = {
  owner: 'Abanoub Mokhles',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/*  App Elements
==================*/
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

/*  Track current User
========================*/
let currentUser;

/*  App Functions
====================*/

// Make usernames
let usernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
usernames(accounts);

// Display Balance
let displayBalance = function (foundUser) {
  foundUser.balance = foundUser.movements.reduce((acc, cval) => acc + cval, 0);
  labelBalance.textContent = `${foundUser.balance} €`;
};

// Display Movements
let displayMovements = function (foundUser, sort = false) {
  containerMovements.innerHTML = '';

  // Adabting to sorting
  let movs = sort
    ? foundUser.movements.slice().sort((a, b) => a - b)
    : foundUser.movements;

  movs.forEach(function (movement, index) {
    let type = movement > 0 ? 'deposit' : 'withdrawal';
    let movementElement = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__value">${movement} €</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', movementElement);
  });
};

// Display Summary
let displaySummary = function (account) {
  let income = account.movements
    .filter(cval => cval > 0)
    .reduce((acc, cval) => acc + cval, 0);
  labelSumIn.textContent = `${income} €`;

  let expences = account.movements
    .filter(cval => cval < 0)
    .reduce((acc, cval) => acc + cval, 0);
  labelSumOut.textContent = `${Math.abs(expences)} €`;

  let interest = account.movements
    .filter(cval => cval > 0)
    .map(cval => (cval * account.interestRate) / 100)
    .filter(cval => cval >= 1)
    .reduce((acc, cval) => acc + cval, 0);
  labelSumInterest.textContent = `${interest} €`;
};

let updateUI = function (foundUser) {
  // Display Balance
  displayBalance(foundUser);
  // Display Movements
  displayMovements(foundUser);
  // Display Summary
  displaySummary(foundUser);
};
/*  Login User
====================*/
btnLogin.addEventListener('click', function (e) {
  // Prevent default submitting
  e.preventDefault();

  // 1. Check if user exists
  currentUser = accounts.find(function (user) {
    return user.username === inputLoginUsername.value;
  });

  // 2. Check if pin number is correct
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Display UI + Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style =
      'opacity: 1; visibility: visible; pointer-events: all;';

    // Empty input elements
    inputLoginUsername.value = inputLoginPin.value = '';

    // Lose focus
    inputLoginPin.blur();

    // Update UI
    updateUI(currentUser);
  }
});

/*  Transfer Money to Other Users
====================================*/
btnTransfer.addEventListener('click', function (e) {
  // Prevent Default loading on submit
  e.preventDefault();

  // Step.1 Storing recipient & amount
  let transferAmount = Number(inputTransferAmount.value);
  let recipient = accounts.find(function (account) {
    return account.username === inputTransferTo.value;
  });

  // Step.2 Validate operation
  if (
    recipient &&
    recipient.username !== currentUser.username &&
    currentUser.balance >= transferAmount &&
    transferAmount > 0
  ) {
    // Step.3 Add amount to Recipient - Remove amount from Current
    currentUser.movements.push(-transferAmount);
    recipient.movements.push(transferAmount);

    // Step.4 Update UI
    updateUI(currentUser);
  }
  // remove values from input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

/*  Close an account
======================*/
btnClose.addEventListener('click', function (e) {
  // Prevent Default Reloading
  e.preventDefault();

  // Check if entered user equals current user
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    // find current user index in the accounts array
    let cIndex = accounts.findIndex(function (acc) {
      return acc.username === currentUser.username;
    });

    // Delete that account
    accounts.splice(cIndex, 1);

    // Hide the layout
    containerApp.style =
      'opacity: 0; visibility: hidden; pointer-events: none;';

    // remove values from input fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

/*  Request a Loan
======================*/
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let loan = Number(inputLoanAmount.value);

  if (loan > 0 && currentUser.movements.some(mv => mv >= loan * 0.1)) {
    currentUser.movements.push(loan);
    // Update UI
    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
});

/*  Sorting Movements
=======================*/
let sorted = false; // a state variable
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentUser, !sorted);
  sorted = !sorted; // flipping the current state
});

// 1. add all deposites together
let allDepos = accounts
  .flatMap(acc => acc.movements)
  .filter(cur => cur > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(allDepos);

// 2. how many depos > 1000
let depos10001 = accounts
  .flatMap(acc => acc.movements)
  .filter(cur => cur >= 1000).length;
let depos10002 = accounts
  .flatMap(acc => acc.movements)
  .reduce((counter, cur) => (cur >= 1000 ? ++counter : counter), 0);
console.log(depos10001);

// 3. calculate all deposites and withdrawals
let { deposites, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      sum[cur > 0 ? 'deposites' : 'withdrawals'] += cur;
      return sum;
    },
    { deposites: 0, withdrawals: 0 }
  );
console.log(deposites, withdrawals);
