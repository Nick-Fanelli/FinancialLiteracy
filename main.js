const Table = document.querySelector("table");

const CompanyLookup = [
    "Some Company",
    "Random Cop.",
    "Company 1",
    "Walmart",
    "Target",
    "Apple"
];

function GetRandomRange(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function GetRandomInt(maxValue) {
    return Math.floor(Math.random() * maxValue);
}

function GenerateRandomCompany() {

    for(let i = 0; i < CompanyLookup.length; i++) {
        Table.innerHTML += GetTableEntry(CompanyLookup[i], GetRandomRange(0, 750));
    }

}

function GetTableEntry(name, price) {
    return `
    <tr>
        <th>${name}</th>
        <th>${price}</th>
    </tr>
    `;
}

function GenerateTable() {
    GenerateRandomCompany();
}

window.onload = function() {
    GenerateTable();
}