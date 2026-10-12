

export function formatPrice(price: number){
    return new Intl.NumberFormat("es-UY", {style: "currency", currency: "USD"}).format(price / 100)
}