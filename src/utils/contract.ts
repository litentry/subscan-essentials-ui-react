import { pvmContractInfoType } from '@/utils/api'

const VERIFIED_CONTRACT_STATUSES = new Set(['verified', 'perfect', 'partial'])

export function isVerifiedContractStatus(verifyStatus?: string | null): boolean {
  const status = verifyStatus?.trim().toLowerCase() || ''

  return VERIFIED_CONTRACT_STATUSES.has(status)
}

export function formatContractVerifyStatus(verifyStatus?: string | null): string {
  return isVerifiedContractStatus(verifyStatus) ? 'Verified' : 'Unverified'
}

export function hasDisplayableContractInfo(contract?: Pick<pvmContractInfoType, 'abi' | 'source_code' | 'verify_status'> | null): boolean {
  if (!contract) {
    return false
  }

  if (isVerifiedContractStatus(contract.verify_status) || Boolean(contract.source_code?.trim())) {
    return true
  }

  if (Array.isArray(contract.abi)) {
    return contract.abi.length > 0
  }

  if (contract.abi && typeof contract.abi === 'object') {
    return Object.keys(contract.abi).length > 0
  }

  return Boolean(contract.abi)
}
