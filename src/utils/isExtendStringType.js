export default function isExtendStringType(type) {
  return ['string', 'url', 'hex', 'email', 'date', 'pattern'].includes(type)
}
