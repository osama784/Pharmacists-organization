export default function toLocaleDate(date: Date | null | undefined): Date | null | undefined {
    if (!date) {
        return date;
    }
    return new Date(date.getTime() + 3 * 60 * 60 * 1000);
}

export function formatDate(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export const dateUtils = {
    toLocaleDate,
    formatDate,
};
