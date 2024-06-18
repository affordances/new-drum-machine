import React from "react";

import { GridOption } from "@/types/types";
import * as S from "../styles/styles";

type SelectProps = {
  defaultOption: GridOption;
  options: Array<GridOption>;
  onSelect: (value: GridOption) => void;
};

export const Select: React.FC<SelectProps> = ({
  defaultOption,
  options,
  onSelect,
}) => {
  const [selectedOptionValue, setSelectedOptionValue] = React.useState(
    defaultOption.value
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );

    if (selectedOption) {
      setSelectedOptionValue(selectedValue);
      onSelect(selectedOption);
    }
  };

  return (
    <S.StyledSelect value={selectedOptionValue} onChange={handleChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </S.StyledSelect>
  );
};
