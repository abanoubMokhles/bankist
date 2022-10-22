'use strict';

/*********************************************************/
/********************** BANKIST APP **********************/
/*********************************************************/

/*  Data
===========*/
const account1 = {
  owner: 'Abanoub Mokhles',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'John Duo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// ============== Elements ============== //
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

// ============== Display Movements ============== //
let displayMovements = function (account, sorted = false) {
  containerMovements.textContent = '';

  // Check for Sorted State variable
  let moves = sorted
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  moves.forEach(function (move, index) {
    let movementType = move > 0 ? 'deposit' : 'withdrawal';

    let movement = `<div class="movements__row">
    <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
    <div class="movements__value">${move} €</div>
  </div>`;

    // Insert the movement into the movements container from top to bottom ⏬
    containerMovements.insertAdjacentHTML('afterbegin', movement);
  });
};

// ============== Make Usernames ============== //
let makeUsernames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => {
        return word[0];
      })
      .join('');
  });
};
makeUsernames(accounts);

// ============== Calculate and Display Balance ============== //
let calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, move, i) => {
    return acc + move;
  }, 0);
  labelBalance.textContent = `${account.balance} €`;
};
// ============== Display Username ============== //
let displayUsername = function (account) {
  labelWelcome.textContent = `Welcome Back, ${account.owner.split(' ')[0]}`;
};

// ============== Calculate and Display Summary ============== //
let calcDisplaySummary = function (account) {
  let income = account.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${income} €`;

  let expences = Math.abs(
    account.movements
      .filter(move => move < 0)
      .reduce((acc, move) => acc + move, 0)
  );
  labelSumOut.textContent = `${expences} €`;

  let interest = account.movements
    .filter(move => move > 0)
    .map(move => (move * account.interestRate) / 100)
    .filter(intr => intr > 1)
    .reduce((acc, move) => acc + move, 0);
  labelSumInterest.textContent = `${interest} €`;
};

// ============== Display UI ============== //
let displayUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
  displayUsername(account);
};
// ============== Login ============== //
let activeUser;

btnLogin.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  // Find User
  activeUser = accounts.find(account => {
    return account.username === inputLoginUsername.value;
  });

  // Check Pin
  if (activeUser?.pin === Number(inputLoginPin.value)) {
    // Remove values and Cursor from Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Display UI
    containerApp.style = 'opacity: 1;visibility: visible;pointer-events: all; ';

    // Display MOVEMENTS - BALANCE - SUMMARY
    displayUI(activeUser);
  }
});

// ============== Transfer Money ============== //
btnTransfer.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  let transferAmount = Number(inputTransferAmount.value);
  let transferToUser = accounts.find(account => {
    return account.username === inputTransferTo.value;
  });

  // Check Transfer Criteria
  if (
    transferAmount > 0 &&
    transferToUser &&
    activeUser.balance >= transferAmount &&
    transferToUser !== activeUser.username
  ) {
    // Add & Remove Amount
    activeUser.movements.push(-transferAmount);
    transferToUser.movements.push(transferAmount);

    // Remove Focus and Input Values
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

    // Update UI
    displayUI(activeUser);
  }
});

// ============== Request a Loan ============== //
btnLoan.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  // Loan Criteria
  let loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    activeUser.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    activeUser.movements.push(loanAmount);

    // Update UI
    displayUI(activeUser);
  }
});

// ============== Close Account ============== //
btnClose.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  if (
    inputCloseUsername.value === activeUser.username &&
    Number(inputClosePin.value) === activeUser.pin
  ) {
    // Find Index of Current Account
    let accIndex = accounts.findIndex(acc => {
      return acc.username === inputCloseUsername.value;
    });

    // Delete Account
    accounts.splice(accIndex, 1);

    // Remove Focus and Input Values
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();

    // Hide UI
    containerApp.style = 'opacity: 0;visibility: hidden;pointer-events: none; ';
  }
});

// ============== Sort Movements ============== //
let sorted = false;
btnSort.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  // Call Display Movements with sorted optional Parameter
  displayMovements(activeUser, !sorted);

  // Reverse Sorted option
  sorted = !sorted;
});
