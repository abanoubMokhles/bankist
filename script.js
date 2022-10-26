'use strict';
//=========================================//
//============== BANKIST APP ==============//
//=========================================//

//============== Data ==============//
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
    '2022-10-23T23:36:17.929Z',
    '2022-10-24T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
  currency: 'EUR',
  locale: 'fr-FR',
};

const accounts = [account1, account2];

//============== Elements ==============//
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

// ============== Movements Dates ============== //
let formatMoveDates = function (date, locale) {
  // Calculate difference between now and movement date
  let dateDiffFun = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));

  let differenceInDates = dateDiffFun(new Date(), date);
  if (differenceInDates === 0) {
    return 'Today';
  } else if (differenceInDates === 1) {
    return 'Yesterday';
  } else if (differenceInDates <= 7) {
    return `${differenceInDates} days ago`;
  } else {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
};

let formatCurrency = function (locale, currency, amount) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
// ============== Display Movements ============== //
let displayMovements = function (account, sorted = false) {
  containerMovements.textContent = '';

  // Check for Sorted State variable
  let moves = sorted
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  moves.forEach(function (move, index) {
    let movementType = move > 0 ? 'deposit' : 'withdrawal';

    let movementDate = new Date(account.movementsDates[index]);
    let formatedDate = formatMoveDates(movementDate, account.locale);

    let movement = `<div class="movements__row">
    <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
    <div class="movements__date">${formatedDate}</div>
    <div class="movements__value">${formatCurrency(
      account.locale,
      account.currency,
      move
    )}</div>
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
  labelBalance.textContent = `${formatCurrency(
    account.locale,
    account.currency,
    account.balance
  )}`;
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
  labelSumIn.textContent = `${formatCurrency(
    account.locale,
    account.currency,
    income
  )}`;

  let expences = Math.abs(
    account.movements
      .filter(move => move < 0)
      .reduce((acc, move) => acc + move, 0)
  );
  labelSumOut.textContent = `${formatCurrency(
    account.locale,
    account.currency,
    expences
  )}`;

  let interest = account.movements
    .filter(move => move > 0)
    .map(move => (move * account.interestRate) / 100)
    .filter(intr => intr > 1)
    .reduce((acc, move) => acc + move, 0);
  labelSumInterest.textContent = `${formatCurrency(
    account.locale,
    account.currency,
    interest
  )}`;
};

// ============== Display UI ============== //
let displayUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
  displayUsername(account);
};
// ============== Login ============== //
let activeUser, timer;

btnLogin.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  // Find User
  activeUser = accounts.find(account => {
    return account.username === inputLoginUsername.value;
  });

  // Check Pin
  if (activeUser?.pin === +inputLoginPin.value) {
    // Remove values and Cursor from Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Display Current Date
    labelDate.textContent = new Intl.DateTimeFormat(activeUser.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    // Display UI
    containerApp.style = 'opacity: 1;visibility: visible;pointer-events: all; ';

    // Start Logout Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Display MOVEMENTS - BALANCE - SUMMARY
    displayUI(activeUser);
  }
});

// ============== Transfer Money ============== //
btnTransfer.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  let transferAmount = +inputTransferAmount.value;
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

    // Push Transfer date
    activeUser.movementsDates.push(new Date().toISOString());
    transferToUser.movementsDates.push(new Date().toISOString());

    // Remove Focus and Input Values
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

    // Update UI
    displayUI(activeUser);

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// ============== Request a Loan ============== //
btnLoan.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  // Loan Criteria
  let loanAmount = +inputLoanAmount.value;
  if (
    loanAmount > 0 &&
    activeUser.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      activeUser.movements.push(loanAmount);
      activeUser.movementsDates.push(new Date().toISOString());

      // Update UI
      displayUI(activeUser);
    }, 3000);

    // Remove values and Cursor from Input Field
    inputLoanAmount.value = '';
    inputLoanAmount.blur();

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// ============== Close Account ============== //
btnClose.addEventListener('click', function (evt) {
  // Prevent Default Reload
  evt.preventDefault();

  if (
    inputCloseUsername.value === activeUser.username &&
    +inputClosePin.value === activeUser.pin
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

// ============== Logout Timer ============== //
let startLogoutTimer = function () {
  // logout after 5 minutes
  let time = 20;

  let handleTime = function () {
    // Get Minutes and Seconds
    let minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    let seconds = String(time % 60).padStart(2, 0);

    // Output Minutes and Seconds
    labelTimer.textContent = `${minutes}:${seconds}`;

    // Chech if time == 0
    if (time === 0) {
      // Logout y hiding UI and changing Welcome message
      labelWelcome.textContent = `login to get started`;

      // Hide UI
      containerApp.style =
        'opacity: 0;visibility: hidden;pointer-events: none; ';

      // stop timer
      clearInterval(timer);
    }

    // Decrease total time by 1
    time--;
  };

  // get minutes and seconds and decrease them every 1 seconds
  handleTime();
  timer = setInterval(handleTime, 1000);
  return timer;
};
