function assetURL(path) {
  const publicUrl = process.env.PUBLIC_URL

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isRoot = publicUrl === '/'

  const assetPrefix = isDevelopment || isRoot ? '' : process.env.PUBLIC_URL

  return `${assetPrefix}/assets/${path}`
}

export { assetURL }
