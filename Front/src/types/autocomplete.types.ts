export interface AutocompleteResult {
  value: string;
  field: 'name' | 'chain_name' | 'state_name' | 'state_code' | 'city' | 'street_address';
  fieldLabel: string;
}

export interface SelectedFilter extends AutocompleteResult {}
