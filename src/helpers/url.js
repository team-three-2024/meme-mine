function assetURL(path) {
  const publicUrl = process.env.PUBLIC_URL

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isRoot = publicUrl === '/'

  const assetPrefix = isDevelopment || isRoot ? '' : process.env.PUBLIC_URL

  return `${assetPrefix}/assets/${path}`
}

function prefix(path) {
  const publicUrl = process.env.PUBLIC_URL

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isRoot = publicUrl === '/'

  const assetPrefix = isDevelopment || isRoot ? '' : process.env.PUBLIC_URL

  return `${assetPrefix}/${path}`
}

export { assetURL, prefix }
