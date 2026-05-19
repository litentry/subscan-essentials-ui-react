import BigNumber from "bignumber.js"
import dayjs from "dayjs"
import { BIG_TEN, BIGNUMBER_FMT } from "./const"

export const getUTCTime = (timestamp: number, format = 'YYYY-MM-DD HH:mm:ss') => {
    const time = dayjs.unix(timestamp).format(format)
    return `${time} (UTC)`
}

export function parseFileText(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      const string = reader.result
      resolve(string)
    }
    reader.onerror = function (e: any) {
      reject(e)
    }
    reader.readAsText(file)
  })
}

export type themeType = "secondary" | "primary" | undefined
export function getThemeColor(isSubstrate?: boolean): themeType {
  return isSubstrate ? 'secondary': 'primary'
}
export function checkIsExtrinsicIndex(extrinsicKey: string): boolean {
  const reg = /^[0-9]+-[0-9]+$/
  return reg.test(extrinsicKey)
}

export type SearchType = 'sub_block' | 'sub_extrinsic' | 'sub_event' | 'sub_account' | 'pvm_block' | 'pvm_tx' | 'pvm_contract' | 'pvm_account'

const HEX_32_BYTE_REGEXP = /^0x[0-9a-fA-F]{64}$/
const EVM_ADDRESS_REGEXP = /^0x[0-9a-fA-F]{40}$/
const SUBSTRATE_ADDRESS_REGEXP = /^[1-9A-HJ-NP-Za-km-z]{46,50}$/

export function detectSearchType(input: string, selectedType: SearchType, availableTypes: string[]): SearchType {
  const value = input.trim()
  const available = new Set(availableTypes)
  const isAvailable = (searchType: SearchType) => available.size === 0 || available.has(searchType)
  const firstAvailable = (...searchTypes: SearchType[]) => searchTypes.find(isAvailable)

  if (HEX_32_BYTE_REGEXP.test(value)) {
    return firstAvailable('sub_block', 'pvm_tx', 'sub_extrinsic') || selectedType
  }

  if (SUBSTRATE_ADDRESS_REGEXP.test(value)) {
    return firstAvailable('sub_account') || selectedType
  }

  if (EVM_ADDRESS_REGEXP.test(value)) {
    if ((selectedType === 'pvm_contract' || selectedType === 'pvm_account') && isAvailable(selectedType)) {
      return selectedType
    }

    return firstAvailable('pvm_account', 'pvm_contract') || selectedType
  }

  if (checkIsExtrinsicIndex(value)) {
    if (selectedType === 'sub_event' && isAvailable(selectedType)) {
      return selectedType
    }

    return firstAvailable('sub_extrinsic', 'sub_event') || selectedType
  }

  return selectedType
}

export function formatHash(hash?: string, units = 12) {
  if (hash && hash.length > units) {
    const arr = hash.split('')
    return `${arr.slice(0, Math.floor(units / 2)).join('')}....${arr.slice(-Math.floor(units / 2)).join('')}`
  } else {
    return hash
  }
}

export function formatNumber(number: string | number | BigNumber) {
  return new BigNumber(number).toFormat(BIGNUMBER_FMT)
}

export function getBalanceAmount(amount: BigNumber, decimals?: number): BigNumber {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals || 0))
}

export function timeAgo(time: number | string, now = Date.now()) {
    const second = +time * 1000
    const d = new Date(second)
    const after = now - d.valueOf() < 0 ? 'after ' : ''
    const diff = Math.abs(now - d.valueOf()) / 1000
    if (diff < 1) {
      return '0 sec ago'
    } else if (diff < 60) {
      return `${after}${parseInt(diff.toString())} ${diff === 1 ? 'sec' : 'secs'} ago`
    } else if (diff < 3600) {
      // less 1 hour
      const min = Math.floor(diff / 60)
      return `${after}${min} ${min === 1 ? 'min' : 'mins'} ago`
    } else if (diff < 86400) {
      // less 1 day
      const hr = Math.floor(diff / 3600)
      const min = Math.floor((diff / 60) % 60)
      return `${after}${hr} ${hr === 1 ? 'hr' : 'hrs'}${min === 0 ? '' : min === 1 ? ' 1 min' : ` ${min} mins`} ago`
    } else if (diff < 90000) {
      // less 1 day 60 min
      const day = Math.floor(diff / 86400)
      const min = Math.floor((diff / 60) % 60)
      return `${after}${day} ${day === 1 ? 'day' : 'days'}${min === 0 ? '' : min === 1 ? ' 1 min' : ` ${min} mins`} ago`
    } else {
      const day = Math.floor(diff / 86400)
      const hr = Math.floor((diff / 60 / 60) % 24)
      return `${after}${day} ${day === 1 ? 'day' : 'days'}${hr === 0 ? '' : hr === 1 ? ' 1 hr' : ` ${hr} hrs`} ago`
    }
  }
