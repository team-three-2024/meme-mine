function assetURL(path) {
  const publicUrl = new URL(process.env.PUBLIC_URL || 'https://mememine.io')

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isRoot = publicUrl.pathname === '/' || publicUrl.pathname === ''

  const assetPrefix = isDevelopment || isRoot ? '' : process.env.PUBLIC_URL

  return `${assetPrefix}/assets/${path}`
}

export { assetURL }
