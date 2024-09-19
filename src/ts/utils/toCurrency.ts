export function toCurrency(value: number) {
	const toCurrency = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	return toCurrency.format(value);
}
