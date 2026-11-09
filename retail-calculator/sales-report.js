const preferredOrder = [
    "broiler_cut",
    "broiler_live",
    "culbird_cut",
    "culbird_live"
];

function logSale(type, kg, rate, saleTimestamp) {

    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    const recordTimestamp = getISTISOString(); // IST timestamp

    allSales.push({
        type,
        kg: Number(kg),
        rate: Number(rate),
        amount: Number(kg) * Number(rate),
        saleTimestamp: saleTimestamp || getISTISOString(),
        recordTimestamp
    });

    localStorage.setItem("salesLog", JSON.stringify(allSales));
}



// Build daily × type table data
function getDailySalesReport() {
    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    const summary = {};      // summary[date][type] = total kg
    const allTypes = new Set();

    allSales.forEach(entry => {
        const date = entry.recordTimestamp
                         ? entry.recordTimestamp.split("T")[0]
                         : "—";; // YYYY-MM-DD
        allTypes.add(entry.type);

        if (!summary[date]) summary[date] = {};
        if (!summary[date][entry.type]) summary[date][entry.type] = 0;

        summary[date][entry.type] += entry.kg;
    });

    return { summary, types: Array.from(allTypes) };
}

document.getElementById("reportBox").style.display = "none";

// Keep data-translate in sync so a language switch shows the right label
function setReportToggleLabel(key) {
    const btn = document.getElementById("reportToggleBtn");
    if (!btn) return;
    btn.dataset.translate = key;
    btn.textContent = tr(key);
}

function toggleReport() {
    const box = document.getElementById("reportBox");

    // If hidden → show
    if (box.style.display === "none" || box.innerHTML.trim() === "") {
        showReport();
        box.style.display = "block";
        setReportToggleLabel("hide_sales_report");
    }
    else {
        // If visible → hide
        box.style.display = "none";
        setReportToggleLabel("view_sales_report");
    }
}

function hideReportIfOpen() {
    const box = document.getElementById("reportBox");

    if (box && box.style.display === "block") {
        box.style.display = "none";
        setReportToggleLabel("view_sales_report");
    }
}

// Convert the data into an HTML table
function showReport() {
    const { summary, types } = getDailySalesReport();

    if (types.length === 0) {
        document.getElementById("reportBox").innerHTML = `
            <div class="no-data">${tr("no_sales")}</div>
        `;
        return;
    }

    let html = `
        <div class="table-container">
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>${tr("date")}</th>
    `;

    const orderedTypes = [
        ...preferredOrder.filter(t => types.includes(t)),
        ...types.filter(t => !preferredOrder.includes(t)).sort()
    ];

    orderedTypes.forEach(type => {
        html += `<th>${tr(type)}</th>`;
    });

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    Object.keys(summary).sort().forEach(date => {
        html += `<tr>
                    <td class="date-cell">${date} <button class="delete-date-btn" onclick="deleteEntireDate('${date}')" aria-label="Delete day"><i class="fa-regular fa-trash-can"></i></button></td>
                `;

        orderedTypes.forEach(type => {
            const value = Number((summary[date][type] || 0).toFixed(3));
            html += `<td class="clickable-cell" onclick="showTransactions('${date}', '${type}')">${value}</td>`;
        });

        html += `</tr>`;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    document.getElementById("reportBox").innerHTML = html;
}


function clearSalesReport() {
    localStorage.removeItem("salesLog");
}

function deleteEntireDate(date) {
    if (!confirm(`Delete ALL records for ${date}?`)) return;

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    allSales = allSales.filter(entry =>
        !(entry.saleTimestamp && entry.saleTimestamp.startsWith(date))
    );

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    showReport();
    closeModal();
}


// transaction per day and delete

let modalDate = "";
let modalType = "";


function showTransactions(date, type) {
    modalDate = date;
    modalType = type;

    const allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    // Filter matching records
    const list = allSales.filter(entry =>
        entry.type === type && entry.saleTimestamp.startsWith(date)
    );

    document.getElementById("modalTitle").innerText =
        `${tr(type)} — ${date}`;

    let html = "";

    if (list.length === 0) {
        html = `<p class="no-data">${tr("no_transactions")}</p>`;
    } else {
        list.forEach(entry => {
            const saleTime = entry.saleTimestamp
                                 ? entry.saleTimestamp.split("T")[1].slice(0,5)
                                 : "—";
            const recordTime = entry.recordTimestamp
                                   ? entry.recordTimestamp.split("T")[1].slice(0,5)
                                   : "—";

            html += `
            <div class="transaction-item">
                <div>
                    <b>${entry.kg} kg × ₹${entry.rate}</b> = <b>₹${entry.amount}</b>
                    <br><small>Sale: ${saleTime}</small>
                    <br><small>Recorded: ${recordTime}</small>
                </div>

                <div class="transaction-actions">
                    <button class="edit-btn" onclick="editTransaction('${entry.recordTimestamp}', ${entry.kg}, ${entry.rate})">${tr("edit")}</button>
                    <button class="delete-btn" onclick="deleteTransaction('${entry.recordTimestamp}')">${tr("delete")}</button>
                </div>
            </div>
            `;
        });
    }

    document.getElementById("transactionList").innerHTML = html;
    document.getElementById("transactionModal").style.display = "flex";
}


function editTransaction(recordKey, oldKg, oldRate) {
    const newKg = prompt("Enter new KG:", oldKg);
    if (!newKg || isNaN(newKg)) return;

    const newRate = prompt("Enter new Rate:", oldRate);
    if (!newRate || isNaN(newRate)) return;

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    allSales = allSales.map(entry => {
        if (entry.recordTimestamp === recordKey) {
            return {
                ...entry,
                kg: Number(newKg),
                rate: Number(newRate),
                amount: Number(newKg) * Number(newRate)
            };
        }
        return entry;
    });

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    showTransactions(modalDate, modalType);
    showReport();
}



function deleteTransaction(timeKey) {
    if (!confirm("Delete this record?")) return;

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");
    allSales = allSales.filter(entry => entry.recordTimestamp !== timeKey);

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    showTransactions(modalDate, modalType);
    showReport();
}

function addTransaction() {
    const kg = Number(document.getElementById("newKgInput").value);
    const rate = Number(document.getElementById("newRateInput").value);

    if (!kg || !rate || kg <= 0 || rate <= 0) {
        alert("Enter valid KG and Rate.");
        return;
    }

    // midnight IST for the modal date
    const saleTimestamp = `${modalDate}T00:00:00+05:30`;

    const recordTimestamp = getISTISOString();

    let allSales = JSON.parse(localStorage.getItem("salesLog") || "[]");

    allSales.push({
        type: modalType,
        kg,
        rate,
        amount: kg * rate,
        saleTimestamp,
        recordTimestamp
    });

    localStorage.setItem("salesLog", JSON.stringify(allSales));

    document.getElementById("newKgInput").value = "";
    document.getElementById("newRateInput").value = "";

    showTransactions(modalDate, modalType);
    showReport();
}



function getISTISOString(date = new Date()) {
    // IST = UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    return istDate.toISOString().replace("Z", "+05:30");
}
function formatIST(iso) {
    if (!iso) return "—";

    const date = new Date(iso);
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata"
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
}





function closeModal() {
    document.getElementById("transactionModal").style.display = "none";
}

