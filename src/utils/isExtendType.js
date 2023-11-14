export default function isExtendType(extendType, sourceType) {
  const supportedTypes = {
    string: [
      'email',
      'date',
      'pattern',
      'mobile',
    ],
    number: [
      'money',
      'ratio',
    ],
  }

  const extendTypes = supportedTypes[sourceType] || []

  return extendTypes.includes(extendType)
}
