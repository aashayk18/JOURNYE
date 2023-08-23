import React, { useState } from 'react';

function ValueSlider({ initialValue, onValueChange }) {
  const [value, setValue] = useState(initialValue);

  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <input
      type="range"
      min={0}
      max={10}
      step={1}
      value={value}
      onChange={handleSliderChange}
    />
  );
}

export default ValueSlider;
