import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const PhoneNumberInput = ({ id, label = 'Phone Number', country = 'IN', value, onChange, onCountryChange, error, required = false }) => (
  <div className="phone-field">
    <label htmlFor={id}>{label} {required && <span aria-hidden="true">*</span>}</label>
    <PhoneInput
      id={id}
      international
      countryCallingCodeEditable={false}
      defaultCountry={country}
      value={value}
      onChange={onChange}
      onCountryChange={onCountryChange}
      aria-label={label}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={error ? 'phone-input phone-input-error' : 'phone-input'}
    />
    {error && <span id={`${id}-error`} className="phone-error" role="alert">{error}</span>}
  </div>
);
