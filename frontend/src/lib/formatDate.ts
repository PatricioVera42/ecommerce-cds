
export function formatDate(date: string){
    return new Date(date).toLocaleString("es-UY", { dateStyle: "short", timeStyle: "short" })
}