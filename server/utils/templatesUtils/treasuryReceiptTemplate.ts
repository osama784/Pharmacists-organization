import { PopulatedTreasuryReceiptDocument } from "../../types/models/treasuryReceipt.types";

const appendReceiptFeesTable = (receiptHTML: string, receipt: PopulatedTreasuryReceiptDocument) => {
    let result: string = "";
    let total = 0;
    for (const fee of receipt.fees) {
        result += `
            <div class="table-row">
                <div class="table-row-statement">${fee.name}</div>
                <div class="table-row-amount">${fee.value}</div>
            </div>
        `;
        total += fee.value;
    }

    return receiptHTML.replace(
        `<div class="table-container"></div>`,
        `
        <div class="table-container">
            <div class="table-header">
                <div class="table-header-statement">البيان</div>
                <div class="table-header-amount">المبلغ</div>
            </div>
            
            <div class="table-rows">
                ${result}
            </div>
            
            <div class="total-row">
                <div class="total-statement">المجموع</div>
                <div class="total-amount">${total}</div>
            </div>
        </div>
    `
    );
};

export const TreasuryReceiptTemplate = {
    appendReceiptFeesTable,
};
