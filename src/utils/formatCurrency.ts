export const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`;