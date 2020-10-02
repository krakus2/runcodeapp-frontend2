import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'

export const hexToRgb = (hex) =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16))

export const addAlphaChannel = (color, a) =>
  `rgba(${hexToRgb(color).join(', ')}, ${a})`

export const isMobile = () => {
  if (/iPhone|Android/i.test(navigator.userAgent) || window.innerWidth < 900) {
    return true
  } else {
    return false
  }
}

export function getParams(location) {
  const searchParams = new URLSearchParams(location)
  return {
    task_id: searchParams.get('task_id') || '',
  }
}

export function subtractFunc(date) {
  return Math.round((Date.now() - new Date(date)) / (1000 * 3600 * 24))
}

export function getSqlYear(d) {
  return `${d.getFullYear()}-${
    d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
  }-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`
}

const resolvePath = (path) => {
  if (!path) return ''

  return path[0] === '/' ? path : `/${path}`
}

export const addPortToUrl = ({ host, port, path }) => {
  if (!host) return
  const pathPart = resolvePath(path)

  if (port) {
    return `${host}:${port}${pathPart}`
  }

  return `${host}${pathPart}`
}

const cache = setupCache({
  maxAge: 5 * 60 * 1000, //5 minutes
})

const { host, port = '' } =
  (window && window.options && window.options.server) || {}

// Create `axios` instance passing the newly created `cache.adapter`

const API_PREFIX = '/api'
const baseURL = addPortToUrl({ host, port, path: API_PREFIX })

const RUNCODE_ACCESS_TOKEN_KEY = 'X-RunCode-Access'
const RUNCODE_ACCESS_TOKEN_VALUE = 'RUNCODE'

export const api = axios.create({
  adapter: cache.adapter,
  baseURL,
  headers: { [RUNCODE_ACCESS_TOKEN_KEY]: RUNCODE_ACCESS_TOKEN_VALUE },
})

export async function getDataFromDB(fromValue, task_id) {
  if (fromValue !== 'all') {
    const d = new Date()
    d.setDate(d.getDate() - fromValue)
    const sqlDate = getSqlYear(d)

    return api({
      url: `tests/task_id=${task_id}&test_date=${sqlDate}&from_value=${fromValue}`,
    })
  } else {
    return api({
      url: `tests/task_id=${task_id}&test_date=all&from_value=${fromValue}`,
    })
  }
}

export async function getDataFromDB2(fromValue, task_id, from, to) {
  if (fromValue !== 'all') {
    const d = new Date()
    d.setDate(d.getDate() - fromValue)
    const sqlDate = getSqlYear(d)

    return api({
      url: `tests/task_id=${task_id}&test_date=${sqlDate}&from=${from}&to=${to}`,
    })
  } else {
    return api({
      url: `tests/task_id=${task_id}&test_date=all&from=${from}&to=${to}`,
      method: 'get',
    })
  }
}

export function memoize(f) {
  let store = new Map(JSON.parse(localStorage.getItem('store'))) || new Map()

  return function (...args) {
    //dodać maxAge
    const k = JSON.stringify(args)
    if (store.has(k)) {
      return store.get(k)
    } else {
      store.set(k, f(...args))
      localStorage.setItem('store', JSON.stringify(Array.from(store.entries())))
      return store.get(k)
    }
  }
}
