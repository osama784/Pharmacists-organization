export default function toLocalDate(date: Date | null | undefined): Date | null | undefined {
    if (!date) {
        return date;
    }
    return new Date(date.getTime() + 3 * 60 * 60 * 1000);
}
