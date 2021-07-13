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

function IsAutomaticEnabled() { return document.getElementById("automatic").classList.contains("enabled"); }

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

    CompanyLookup[data.name]++;
    SetBalance(GetBalance() - data.price);

    RegenerateTable(false);
}

function SellStock(htmlItem) {
    let data = GetDataFromEntry(htmlItem);

    if(CompanyLookup[data.name] <= 0) {
        alert("You do not have any stocks!");
        return;
    }

    CompanyLookup[data.name]--;
    SetBalance(GetBalance() + data.price);

    RegenerateTable(false);
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

function RegenerateTable(shouldUpdate, high = 1, low = -0.5) {

    var values = [];

    for(let i = 1; i < Table.children.length; i++) {
        let price = Table.children[i].children[0].children[1]; // TODO: Find safer way
        values.push(price.innerHTML);
    }

    Table.innerHTML = `
    <tr id="main-header">
        <th>Company Name</th>
        <th>Current Selling Price</th>
        <th>Stocks Owned</th>
        <th>Controls</th>
    </tr>
    `;

    let i = 0;

    for(let value in CompanyLookup) {
        let newValue = Number.parseFloat(values[i]);

        if(shouldUpdate) {
            // Generate Percent Change
            let percentChange = GetRandomRange(low, high);
            newValue += newValue * (percentChange / 100);
            newValue = Math.round(100 * newValue) / 100; // Round to nearest cent
        }

        Table.innerHTML += GetTableEntry(value, newValue, CompanyLookup[value]);
        i++;
    }
}

function BindButtonCallbacks() {
    document.getElementById("increment").onclick = function() {
        IncrementDayCount();
        RegenerateTable(true);
    }

    document.getElementById("automatic").onclick = function() {
        document.getElementById("automatic").classList.toggle("enabled");
        HandleUpdateLoop();
    }
}

function HandleUpdateLoop() {
    const updateLoop = setInterval((interval) => {
        if(!IsAutomaticEnabled()) {
            clearInterval(updateLoop);
            return;
        }

        RegenerateTable(true, -1.5, 3);
        // IncrementDayCount();
    }, 2500); // 2.5 seconds

}

window.onload = function() {
    BindButtonCallbacks();
    SetBalance(1000); // Starting Balance
    GenerateTable();

    // Start Update Loop
    HandleUpdateLoop();
}