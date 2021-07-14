const Table = document.querySelector("table");

// Encourage Forward Growth
const ChangeHigh = 0.025;
const ChangeLow = -0.0005;

var CompanyLookup = {
    "Microsoft": 0,
    "Amazon": 0,
    "Qualcomm": 0,
    "Walmart": 0,
    "Target": 0,
    "Apple": 0,
    "Nvidia": 0,
    "AMD": 0
};

function GetDayCount() { return Number.parseInt(document.getElementById("day-count").innerHTML); }
function GetBalance() { return Number.parseInt(document.getElementById("balance").innerHTML); }

function IsAutomaticEnabled() { return document.getElementById("automatic").classList.contains("enabled"); }

function IncrementDayCount(count = 1) { document.getElementById("day-count").innerHTML = GetDayCount() + count; }
function SetBalance(value) { document.getElementById("balance").innerHTML = value; UpdateNetWorth(); }

function UpdateNetWorth() {

    var values = 0;

    for(let i = 1; i < Table.children.length; i++) {
        let price = Table.children[i].children[0].children[1].innerHTML; // TODO: Find safer way
        values += Number.parseInt(price) * Number.parseInt(Table.children[i].children[0].children[2].innerHTML);
    }

    document.getElementById("net-worth").innerHTML = GetBalance() + values;
}

function GetRandomRange(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
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
        <th>Stocks Owned (1% of Equity)</th>
        <th>Controls</th>
    </tr>
    `;

    for(let value in CompanyLookup) {
        Table.innerHTML += GetTableEntry(value, GetRandomRange(0, 100), CompanyLookup[value]);
    }
}

function NumberToMoney(value) {
    let parts = value.toString().split(".");

    if(parts.length < 2)
        return parts + ".00";

    if(parts[1].length == 0)
        parts[1] += "00"
    else if(parts[1].length == 1)
        parts[1] += "0"

    return parts.join(".");
}

function RegenerateTable(shouldUpdate, low = ChangeLow, high = ChangeHigh) {

    var values = [];

    for(let i = 1; i < Table.children.length; i++) {
        let price = Table.children[i].children[0].children[1]; // TODO: Find safer way
        values.push(price.innerHTML);
    }

    Table.innerHTML = `
    <tr id="main-header">
        <th>Company Name</th>
        <th>Current Selling Price</th>
        <th>Stocks Owned (1% of Equity)</th>
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

        Table.innerHTML += GetTableEntry(value, NumberToMoney(newValue), CompanyLookup[value]);
        i++;
    }

    UpdateNetWorth();
}

function BindButtonCallbacks() {
    document.getElementById("increment").onclick = function() {
        IncrementDayCount();

        RegenerateTable(true, ChangeLow, ChangeHigh * 30);
    }

    document.getElementById("increment-month").onclick = function() {
        IncrementDayCount(30);

        RegenerateTable(true, ChangeLow, ChangeHigh * 900); // 30 per day * 30 days = 900
    }

    document.getElementById("automatic").onclick = function() {
        document.getElementById("automatic").classList.toggle("enabled");
        HandleUpdateLoop();
    }
}

var running = false;

function HandleUpdateLoop() {
    if(running)
        return;

    var tickCount = 0;

    const updateLoop = setInterval((interval) => {
        if(!IsAutomaticEnabled()) {
            running = false;
            clearInterval(updateLoop);
            tickCount = 0;
            return;
        }

        running = true;
        
        RegenerateTable(true);
        tickCount++;

        if(tickCount >= 30) { // Based on 30 days per month (Every thirty automatic ticks equals one day)
            IncrementDayCount();
            tickCount = 0;
        }
    }, 2250); // 2.25 seconds

}

function DisplayWelcomeMessage() {
    window.alert(
        "Hello and welcome to the Financial Literacy Stocks Trading Demo!\n\n" +
        "Your goal is to spend your original starting value of $1,000 in order to buy stocks and make more money in the long run.\n\n" +
        "How many days will it take you to become a millionaire?"
    );
}

function CatchUnload() {
    window.onbeforeunload = function() {
        return "Are you sure you want to reload?? You will loose all your progress!!";
    }
}

window.onload = function() {
    DisplayWelcomeMessage();

    BindButtonCallbacks();
    SetBalance(1000); // Starting Balance
    GenerateTable();

    // Start Update Loop
    HandleUpdateLoop();

    CatchUnload();
}