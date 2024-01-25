function assetURL(path) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const assetPrefix = isDevelopment ? '' : process.env.PUBLIC_URL

  return `${assetPrefix}/assets/${path}`
}

export { assetURL }
