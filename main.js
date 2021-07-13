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

function BuyStock(htmlItem) {
    let data = GetDataFromEntry(htmlItem);

    if(data.price > GetBalance()) {
        alert("Insufficient Funds");
        return;
    }

    if(!confirm(`Are you sure you want to buy a stock in ${data.name}?`))
        return;

    CompanyLookup[data.name]++;
    SetBalance(GetBalance() - data.price);

    GenerateTable();
}

function SellStock(htmlItem) {
    let data = GetDataFromEntry(htmlItem);

    if(CompanyLookup[data.name] <= 0) {
        alert("You do not have any stocks!");
        return;
    }

    if(!confirm(`Are you sure you want to sell a stock in ${data.name}`))
        return;
    
    CompanyLookup[data.name]--;
    SetBalance(GetBalance() + data.price);

    GenerateTable();
}

function GetDataFromEntry(entry) {
    let data = entry.parentElement.parentElement;
    let childElements = data.children;

    let name = childElements[0].innerHTML;
    let price = Number.parseInt(childElements[1].innerHTML);
    let stocksOwned = Number.parseInt(childElements[2].innerHTML);

    return { name, price, stocksOwned };
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
    Table.innerHTML = `
    <tr id="main-header">
        <th>Company Name</th>
        <th>Current Selling Price</th>
        <th>Stocks Owned</th>
        <th>Controls</th>
    </tr>
    `;

    for(let value in CompanyLookup) {
        Table.innerHTML += GetTableEntry(value, GetRandomRange(0, 750), CompanyLookup[value]);
    }
}

function BindButtonCallbacks() {
    document.getElementById("increment").onclick = function() {
        IncrementDayCount();
        GenerateTable();
    }
}

window.onload = function() {
    BindButtonCallbacks();
    SetBalance(1000); // Starting Balance
    GenerateTable();
}