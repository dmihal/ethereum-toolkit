export type AddressType = 'Account' | 'Contract';

export interface SearchParams {
  search: string,
  addressType: AddressType,
}

export interface StatusUpdate {
  iterations: number,
}

export interface AddressResult {
  address: string,
  privkey: string,
  accountAddress: string,
  iterations: number,
}
