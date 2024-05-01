export default function toUpperCamelCase(input: string): string {
  return input
    .toLowerCase() // Convert to lower case to handle mixed case inputs
    .split('_') // Split the string at each underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(''); // Join all the words without any separators
}
