/**
 * PIN Code to State Mapping
 * Indian PIN codes have state-specific prefixes (first 1-2 digits)
 * Based on India Post PIN code system
 */

const PIN_CODE_TO_STATE_MAP: Record<string, string[]> = {
  // Single digit prefixes
  '1': ['Jammu and Kashmir'],
  '2': ['Himachal Pradesh', 'Punjab'],
  '3': ['Rajasthan', 'Delhi'],
  '4': ['Chandigarh', 'Haryana', 'Punjab'],
  '5': ['Uttarakhand', 'Uttar Pradesh'],
  '6': ['Tamil Nadu', 'Puducherry'],
  '7': ['West Bengal', 'Andaman and Nicobar Islands', 'Odisha'],
  '8': ['Bihar', 'Jharkhand'],
  '9': ['Uttar Pradesh'],
  
  // Two digit prefixes
  '10': ['Delhi'],
  '11': ['Delhi'],
  '12': ['Haryana'],
  '13': ['Haryana'],
  '14': ['Punjab'],
  '15': ['Punjab'],
  '16': ['Punjab', 'Chandigarh'],
  '17': ['Himachal Pradesh'],
  '18': ['Assam'],
  '19': ['Jammu and Kashmir', 'Ladakh'],
  '20': ['Uttar Pradesh'],
  '21': ['Uttar Pradesh'],
  '22': ['Uttar Pradesh'],
  '23': ['Uttar Pradesh'],
  '24': ['Uttar Pradesh'],
  '25': ['Uttar Pradesh'],
  '26': ['Uttar Pradesh'],
  '27': ['Uttar Pradesh'],
  '28': ['Uttar Pradesh'],
  '29': ['Karnataka'],
  '30': ['Rajasthan'],
  '31': ['Rajasthan'],
  '32': ['Rajasthan'],
  '33': ['Rajasthan'],
  '34': ['Rajasthan'],
  '35': ['Andaman and Nicobar Islands'],
  '36': ['Gujarat'],
  '37': ['Gujarat'],
  '38': ['Gujarat'],
  '39': ['Gujarat'],
  '40': ['Maharashtra'],
  '41': ['Maharashtra'],
  '42': ['Maharashtra'],
  '43': ['Maharashtra'],
  '44': ['Maharashtra'],
  '45': ['Madhya Pradesh'],
  '46': ['Madhya Pradesh'],
  '47': ['Madhya Pradesh'],
  '48': ['Madhya Pradesh'],
  '49': ['Chhattisgarh'],
  '50': ['Telangana', 'Andhra Pradesh'],
  '51': ['Andhra Pradesh'],
  '52': ['Andhra Pradesh'],
  '53': ['Andhra Pradesh'],
  '54': ['Karnataka'],
  '55': ['Karnataka'],
  '56': ['Karnataka'],
  '57': ['Karnataka'],
  '58': ['Karnataka'],
  '59': ['Karnataka'],
  '60': ['Tamil Nadu'],
  '61': ['Tamil Nadu'],
  '62': ['Tamil Nadu'],
  '63': ['Tamil Nadu'],
  '64': ['Tamil Nadu'],
  '65': ['Tamil Nadu'],
  '66': ['Kerala'],
  '67': ['Kerala'],
  '68': ['Kerala'],
  '69': ['Kerala', 'Lakshadweep'],
  '70': ['West Bengal'],
  '71': ['West Bengal'],
  '72': ['West Bengal'],
  '73': ['West Bengal'],
  '74': ['West Bengal'],
  '75': ['Odisha'],
  '76': ['Odisha'],
  '77': ['Odisha'],
  '78': ['Assam'],
  '79': ['Assam'],
  '80': ['Bihar'],
  '81': ['Bihar'],
  '82': ['Bihar'],
  '83': ['Bihar'],
  '84': ['Bihar', 'Jharkhand'],
  '85': ['Jharkhand'],
  '86': ['Jharkhand'],
  '87': ['Jharkhand'],
  '88': ['West Bengal'],
  '90': ['Punjab'],
  '91': ['Punjab'],
  '92': ['Punjab'],
  '93': ['Punjab'],
  '94': ['Punjab'],
  '95': ['Punjab'],
  '96': ['Punjab'],
  '97': ['Punjab'],
  '98': ['Punjab'],
  '99': ['Punjab'],
};

/**
 * Get the state(s) associated with a PIN code
 */
export function getStateFromPincode(pincode: string): string[] {
  if (!pincode || pincode.length < 1) {
    return [];
  }

  // Try 2-digit prefix first
  const twoDigit = pincode.substring(0, 2);
  if (PIN_CODE_TO_STATE_MAP[twoDigit]) {
    return PIN_CODE_TO_STATE_MAP[twoDigit];
  }

  // Try 1-digit prefix
  const oneDigit = pincode.substring(0, 1);
  if (PIN_CODE_TO_STATE_MAP[oneDigit]) {
    return PIN_CODE_TO_STATE_MAP[oneDigit];
  }

  return [];
}

/**
 * Check if a PIN code matches the selected state
 */
export function validatePincodeForState(pincode: string, state: string): {
  isValid: boolean;
  message: string;
} {
  if (!pincode || pincode.length !== 6) {
    return {
      isValid: false,
      message: 'PIN code must be 6 digits',
    };
  }

  if (!state) {
    return {
      isValid: true,
      message: '',
    };
  }

  const validStates = getStateFromPincode(pincode);
  
  if (validStates.length === 0) {
    return {
      isValid: false,
      message: 'Invalid PIN code format',
    };
  }

  if (!validStates.includes(state)) {
    const expectedStates = validStates.join(' or ');
    return {
      isValid: false,
      message: `PIN code ${pincode} belongs to ${expectedStates}, not ${state}. Please verify your state selection.`,
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

