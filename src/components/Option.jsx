import React from "react";

const Option = ({ label, value }) => {
  return (
    <option value={value} label={label}>
      {value}
    </option>
  );
};

export default Option;
