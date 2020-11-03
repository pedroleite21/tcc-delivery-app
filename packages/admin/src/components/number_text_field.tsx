import * as React from 'react';
import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  value: string;
  name: string;
}

function currencyFormatter(value) {
  if (!Number(value)) return "";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value / 100);

  return `${amount}`;
}

export default function NumberTextField(props: NumberFormatCustomProps) {
  const { inputRef, onChange, value, ...other } = props;

  return (
    <NumberFormat
      {...other}
      value={Number(value) * 100}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: String(values.floatValue / 100),
          },
        });
      }}
      isNumericString
      prefix="R$ "
      format={currencyFormatter}
    />
  );
}
