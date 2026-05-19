import { formatContractVerifyStatus, hasDisplayableContractInfo, isVerifiedContractStatus } from '@/utils/contract'

describe('Utils - contract', () => {
  describe('isVerifiedContractStatus', () => {
    it('treats successful backend verify statuses as verified', () => {
      expect(isVerifiedContractStatus('verified')).toBe(true)
      expect(isVerifiedContractStatus('perfect')).toBe(true)
      expect(isVerifiedContractStatus('partial')).toBe(true)
    })

    it('treats blank verify status as unverified', () => {
      expect(isVerifiedContractStatus('')).toBe(false)
      expect(isVerifiedContractStatus('   ')).toBe(false)
      expect(isVerifiedContractStatus(undefined)).toBe(false)
    })

    it('treats explicit negative verification states as unverified', () => {
      expect(isVerifiedContractStatus('unverified')).toBe(false)
      expect(isVerifiedContractStatus('pending')).toBe(false)
      expect(isVerifiedContractStatus('failed')).toBe(false)
      expect(isVerifiedContractStatus('unknown')).toBe(false)
    })
  })

  describe('formatContractVerifyStatus', () => {
    it('formats successful statuses as Verified', () => {
      expect(formatContractVerifyStatus('perfect')).toBe('Verified')
    })

    it('formats blank statuses as Unverified', () => {
      expect(formatContractVerifyStatus('')).toBe('Unverified')
    })
  })

  describe('hasDisplayableContractInfo', () => {
    it('allows the contract source tab for backend verified statuses such as perfect', () => {
      expect(
        hasDisplayableContractInfo({
          verify_status: 'perfect',
          source_code: '',
          abi: null,
        })
      ).toBe(true)
    })

    it('allows contract source when source code exists even without a status', () => {
      expect(
        hasDisplayableContractInfo({
          verify_status: '',
          source_code: 'contract AgentKeysScope {}',
          abi: null,
        })
      ).toBe(true)
    })

    it('allows contract info when ABI exists even without a status', () => {
      expect(
        hasDisplayableContractInfo({
          verify_status: '',
          source_code: '',
          abi: [{ type: 'function', name: 'owner' }],
        })
      ).toBe(true)
    })

    it('keeps the verification form for contracts without verified metadata', () => {
      expect(
        hasDisplayableContractInfo({
          verify_status: '',
          source_code: '',
          abi: null,
        })
      ).toBe(false)
    })
  })
})
