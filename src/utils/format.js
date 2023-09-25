const formatRegExp = /%[sdj%]/g

export default function format(...args) {
  let i = 1
  const f = args[0]
  const len = args.length

  if (typeof f === 'function')
    return f(args.slice(1))

  if (typeof f === 'string') {
    // 匹配到值并替换args里的值
    const str = String(f).replace(formatRegExp, (x) => {
      if (x === '%%')
        return '%'
      if (i >= len)
        return x
      switch (x) {
        case '%s':
          return String(args[i++])
        case '%d':
          return Number(args[i++])
        case '%j':
          try {
            return JSON.stringify(args[i++])
          }
          catch (_) {
            return '[Circular]'
          }
        default:
          return x // 默认原样返回
      }
    })
    return str
  }
  return f
}
