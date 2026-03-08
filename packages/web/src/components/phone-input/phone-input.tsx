'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

const COUNTRIES = [
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '\u{1F1F2}\u{1F1FD}' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '\u{1F1F3}\u{1F1F1}' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '\u{1F1F8}\u{1F1EC}' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '\u{1F1F3}\u{1F1FF}' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '\u{1F1E6}\u{1F1EA}' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '\u{1F1F8}\u{1F1E6}' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '\u{1F1FF}\u{1F1E6}' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '\u{1F1F0}\u{1F1F7}' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoDetectCountry?: boolean;
  countryCode?: string;
}

function PhoneInput({
  value,
  onChange,
  placeholder = 'Enter phone number',
  className = '',
  disabled = false,
  autoDetectCountry = true,
  countryCode,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(COUNTRIES[0]);
  const [localNumber, setLocalNumber] = React.useState('');
  const [isDetecting, setIsDetecting] = React.useState(false);

  React.useEffect(() => {
    if (countryCode) {
      const matchedCountry = COUNTRIES.find((c) => c.code === countryCode.toUpperCase());
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        if (localNumber) {
          onChange(`${matchedCountry.dialCode}-${localNumber}`);
        }
      }
    }
  }, [countryCode]);

  React.useEffect(() => {
    if (value) {
      const normalizedValue = value.replace(/^\+(\d+)\s+/, '+$1-');
      const matchedCountry = COUNTRIES.find((c) =>
        normalizedValue.startsWith(c.dialCode)
      );
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        const localPart = normalizedValue.slice(matchedCountry.dialCode.length).replace(/^[-\s]/, '');
        setLocalNumber(localPart);
      } else {
        setLocalNumber(value.replace(/^\+\d+[-\s]?/, ''));
      }
    }
  }, [value]);

  React.useEffect(() => {
    if (autoDetectCountry && !value && !countryCode) {
      detectCountry();
    }
  }, [autoDetectCountry, countryCode]);

  const detectCountry = async () => {
    setIsDetecting(true);
    try {
      const browserLocale = navigator.language || (navigator as any).userLanguage;
      const countryFromLocale = browserLocale?.split('-')[1]?.toUpperCase();
      if (countryFromLocale) {
        const matchedCountry = COUNTRIES.find((c) => c.code === countryFromLocale);
        if (matchedCountry) {
          setSelectedCountry(matchedCountry);
          setIsDetecting(false);
          return;
        }
      }
    } catch {
      // Silently fail
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCountryChange = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const fullNumber = localNumber ? `${country.dialCode}-${localNumber}` : '';
    onChange(fullNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d]/g, '');
    setLocalNumber(newNumber);
    const fullNumber = newNumber ? `${selectedCountry.dialCode}-${newNumber}` : '';
    onChange(fullNumber);
  };

  const sortedCountries = React.useMemo(() => {
    return [...COUNTRIES].sort((a, b) => {
      if (a.code === selectedCountry.code) return -1;
      if (b.code === selectedCountry.code) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedCountry]);

  return (
    <div className={cn('relative', className)}>
      <div className="flex">
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-r-0 border-border rounded-l-lg bg-muted hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-foreground">
              {selectedCountry.dialCode}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-20">
                {sortedCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryChange(country)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-primary/10',
                      country.code === selectedCountry.code
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground'
                    )}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-sm">{country.name}</span>
                    <span className="text-sm text-muted-foreground">{country.dialCode}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative flex-1">
          <input
            type="tel"
            value={localNumber}
            onChange={handleNumberChange}
            placeholder={placeholder}
            disabled={disabled || isDetecting}
            className="w-full px-4 py-2.5 border border-border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {isDetecting && (
        <p className="mt-1 text-xs text-muted-foreground">Detecting your location...</p>
      )}
    </div>
  );
}

export { PhoneInput, COUNTRIES };
export type { PhoneInputProps };
