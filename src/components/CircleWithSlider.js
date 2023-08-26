import React, { useState } from "react";
import Slider from "react-slider";

function CircleWithSlider({ value, onChange, handleCircleClick }) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="circle" onClick={handleCircleClick}>
      {sliderValue}
      <div className="slider-container">
        <Slider
          value={sliderValue}
          min={0}
          max={10}
          onChange={handleSliderChange}
          className="slider"
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
      </div>
    </div>
  );
}

export default CircleWithSlider;
