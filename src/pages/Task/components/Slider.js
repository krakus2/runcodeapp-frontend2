import React from 'react'
import RcSlider, { createSliderWithTooltip } from 'rc-slider'

import 'rc-slider/assets/index.css'

import theme from 'theme'

import { SliderWrapper } from '../styles'

const Range = createSliderWithTooltip(RcSlider.Range)

const Slider = ({
  sliderValue,
  onSliderValueChange,
  onSliderAfterChange,
  isLoading,
}) => (
  <SliderWrapper disabled={isLoading}>
    <Range
      disabled={isLoading}
      min={1}
      max={5}
      dots
      step={1}
      className='mySlider'
      style={{ margin: '20px 5px' }}
      activeDotStyle={{
        borderColor: theme.primaryColor,
      }}
      dotStyle={{
        borderColor: theme.disabled,
      }}
      trackStyle={[{ backgroundColor: theme.primaryColor }]}
      handleStyle={{
        borderColor: theme.primaryColor,
      }}
      value={sliderValue}
      onChange={onSliderValueChange}
      onAfterChange={onSliderAfterChange}
    />
  </SliderWrapper>
)

export default Slider
