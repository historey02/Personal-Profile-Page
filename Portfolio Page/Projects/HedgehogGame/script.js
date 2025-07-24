let money = 10;
let myHogs = [];
let hogCount = 0;
let hedgehogList = [
    {
        name: "normal hedgehog",
        id: "normal-hedgehog-card",
        price: 10,
        rate: 1,
        owned: 0,
        html: '<div class="normal-hedgehog hedgehog"><img src="./NormalHedgehog.png" alt="Normal Hedgehog"></div>',
    },
    {
        name: "cool hedgehog",
        id: "cool-hedgehog-card",
        price: 50,
        rate: 7,
        owned: 0,
        html: '<div class="cool-hedgehog hedgehog"><img src="./CoolHedgehog.png" alt="Cool Hedgehog"></div>'
    },
    {
        name: "blue hedgehog",
        id: "blue-hedgehog-card",
        price: 5000,
        rate: 100,
        owned: 0,
        html: '<div class="blue-hedgehog hedgehog"><img src="./BlueHedgehog.png" alt="Blue Hedgehog"></div>'
    }
];

const pasture = document.getElementById("pasture");
const hegdehogCounter = document.getElementById("hedgehog-count");

const moneyDisplay = document.getElementById("money-display");
function updateMoneyDisplay(amount) {
    money += amount;
    moneyDisplay.innerText = "Money: $" + money;
}
updateMoneyDisplay(0);

function increasePrice(index) {
    const interestRate = 1.01;
    const exponenet = hedgehogList[index].owned;
    const multiplier = interestRate ** exponenet;
    const newPrice = Math.floor(hedgehogList[index].price * multiplier);
    hedgehogList[index].price = newPrice;
}

function moveHedgehog(hog) {
    const pastureRect = pasture.getBoundingClientRect();

    const maxX = pasture.clientWidth - 100;
    const maxY = pasture.clientHeight - 100;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    hog.style.left = randomX + 'px';
    hog.style.top = randomY + 'px';

    const randomTime = Math.floor((Math.random() * 9500) + 500);
    setTimeout(() => moveHedgehog(hog), randomTime);
}

function moveDemHogs() {
    const hogs = document.querySelectorAll(".hedgehog");
    hogs.forEach(hog => {
        setTimeout(() => moveHedgehog(hog), 0);
    })
}

function addIncome() {
    let income = 0;
    for (let i = 0; i < hedgehogList.length; i++) {
        income += (hedgehogList[i].rate * hedgehogList[i].owned);
    }
    updateMoneyDisplay(income);
}
setInterval(addIncome, 1000);

const normalHedgehogCard = document.getElementById("normal-hedgehog-card");
const normalHedgehogCardOwned = normalHedgehogCard.querySelector("#normal-hedgehogs-owned");
const normalHedgehogCardEarningRate = normalHedgehogCard.querySelector("#earning-rate");
const normalHedgehogPrice = normalHedgehogCard.querySelector("#hedgehog-price");
normalHedgehogCard.addEventListener('click', (e) => {
    const cardId = e.currentTarget.id;
    const index = hedgehogList.findIndex(hog => hog.id === cardId);
    console.log(index);
    buy(index);
    normalHedgehogCardOwned.innerText = "Owned: " + hedgehogList[index].owned;
    normalHedgehogCardEarningRate.innerText = "\$" + (hedgehogList[index].rate * hedgehogList[index].owned) + "/second";
    normalHedgehogPrice.innerText = "Price: $" + hedgehogList[index].price;
});

const coolHedgehogCard = document.getElementById("cool-hedgehog-card");
const coolHedgehogCardOwned = coolHedgehogCard.querySelector("#cool-hedgehogs-owned");
const coolHedgehogCardEarningRate = coolHedgehogCard.querySelector("#earning-rate");
const coolHedgehogPrice = coolHedgehogCard.querySelector("#hedgehog-price");
coolHedgehogCard.addEventListener('click', (e) => {
    const cardId = e.currentTarget.id;
    const index = hedgehogList.findIndex(hog => hog.id === cardId);
    console.log(index);
    buy(index);
    coolHedgehogCardOwned.innerText = "Owned: " + hedgehogList[index].owned;
    coolHedgehogCardEarningRate.innerText = "\$" + (hedgehogList[index].rate * hedgehogList[index].owned) + "/second";
    coolHedgehogPrice.innerText = "Price: $" + hedgehogList[index].price;
});

const blueHedgehogCard = document.getElementById("blue-hedgehog-card");
const blueHedgehogCardOwned = blueHedgehogCard.querySelector("#blue-hedgehogs-owned");
const blueHedgehogCardEarningRate = blueHedgehogCard.querySelector("#earning-rate");
const blueHedgehogPrice = blueHedgehogCard.querySelector("#hedgehog-price");
blueHedgehogCard.addEventListener('click', (e) => {
    const cardId = e.currentTarget.id;
    const index = hedgehogList.findIndex(hog => hog.id === cardId);
    console.log(index);
    buy(index);
    blueHedgehogCardOwned.innerText = "Owned: " + hedgehogList[index].owned;
    blueHedgehogCardEarningRate.innerText = "\$" + (hedgehogList[index].rate * hedgehogList[index].owned) + "/second";
    blueHedgehogPrice.innerText = "Price: $" + hedgehogList[index].price;
});

function buy(index) {
    console.log(index);
    if (money >= hedgehogList[index].price && hogCount < 100) {
        updateMoneyDisplay(-hedgehogList[index].price);
        hedgehogList[index].owned++;
        pasture.innerHTML += hedgehogList[index].html;
        moveDemHogs();
        increasePrice(index);
        hogCount++;
        hegdehogCounter.innerText = "Hedgehog Capacity " + hogCount + "/100";
    }

}

//TODO: Local Storage
//TODO: Hedgehog Sumersalt
//TODO: Hedgehog Ball
//TODO: Hedgehog Obstacle
//TODO: Arm the hogs
//TODO: Thanos
//TODO: Rainbow hog with trail
//TODO: Add karate hog