const Table = document.querySelector("table");

var CompanyLookup = {
    "Some Company": 0,
    "Random Cop.": 0,
    "Company 1": 0,
    "Walmart": 0,
    "Target": 0,
    "Apple": 0
};

function GetDayCount() { return Number.parseInt(document.getElementById("day-count").innerHTML); }
function GetBalance() { return Number.parseInt(document.getElementById("balance").innerHTML); }

function IncrementDayCount() { document.getElementById("day-count").innerHTML = GetDayCount() + 1; }
function SetBalance(value) { document.getElementById("balance").innerHTML = value; }

function GetRandomRange(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function GetRandomInt(maxValue) {
    return Math.floor(Math.random() * maxValue);
}

function GenerateRandomCompany() {

    for(let value in CompanyLookup) {
        Table.innerHTML += GetTableEntry(value, GetRandomRange(0, 750), CompanyLookup[value]);
    }

}

function BuyStock(htmlItem) {
    let data = GetDataFromEntry(htmlItem);
}

function SellStock(htmlItem) {

}

function GetDataFromEntry(entry) {
    let data = entry.parentElement.parentElement;
    let children = data.children;

    // for(let child : children) {

    // }
}

function GetTableEntry(name, price, stocksOwned) {
    return `
    <tr>
        <th>${name}</th>
        <th>${price}</th>
        <th>${stocksOwned}</th>
        <th>
            <button class="buy-stock" onclick="BuyStock(this)">Buy Stock</button>
            <button class="sell-stock" onclick="SellStock(this)">Sell Stock</button>
        </th>
    </tr>
    `;
}

function GenerateTable() {
    GenerateRandomCompany();
}

window.onload = function() {
    SetBalance(1000); // Starting Balance
    GenerateTable();
}