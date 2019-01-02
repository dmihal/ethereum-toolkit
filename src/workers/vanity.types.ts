export interface SearchParams {
  search: string,
}

export interface StatusUpdate {
  iterations: number,
}

export interface AddressResult {
  address: string,
  privkey: string,
  iterations: number,
}
