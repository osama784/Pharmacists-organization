export interface ITreasuryReceiptQuery {
    page?: string;
    limit?: string;
    id?: string | Object;
    pharmacist?: Object;
    receiptBook?: string | Object;
    total?: string | Object;

    createdAt?: string | Object;
}
