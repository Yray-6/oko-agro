// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const imageLoader = ({src}:any) => {
    return  `${src}`
}

export const formatPrice = (price: string, currency: string, unit: string): string => {
  const isKilogram = unit === 'kilogram' || unit === 'kg';
  const suffix = isKilogram ? 'kg' : 'ton';
  
  // Handle currency formatting - case insensitive
  const normalizedCurrency = currency.toUpperCase();
  const currencySymbol = normalizedCurrency === 'NGN' ? '₦' : currency;
  
  // Format the price with proper number formatting
  const numericPrice = parseFloat(price);
  const formattedPrice = numericPrice.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${currencySymbol}${formattedPrice}/${suffix}`;
};