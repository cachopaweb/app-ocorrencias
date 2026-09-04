import React from 'react';
import RawDatePicker, { registerLocale as rawRegisterLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pt_br from 'date-fns/locale/pt-BR/index.js';

try {
  rawRegisterLocale('pt-BR', pt_br);
} catch (e) {
  // Ignora se já estiver registrado
}

// Resolução segura do componente react-datepicker independente do ambiente (ESM vs CJS)
const ResolvedDatePicker = RawDatePicker?.default?.default || RawDatePicker?.default || RawDatePicker;

export const DatePicker = React.forwardRef(({ locale = 'pt-BR', dateFormat = 'dd/MM/yyyy', className = '', ...props }, ref) => {
  return React.createElement(ResolvedDatePicker, {
    ref,
    locale,
    dateFormat,
    className,
    ...props
  });
});

DatePicker.displayName = 'DatePicker';

export { rawRegisterLocale as registerLocale };
export default DatePicker;
