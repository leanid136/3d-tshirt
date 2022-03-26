import React, { useCallback, useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
const ControlSlider = ({min, max, initValue, label, showScale, callback}) =>{ 
    const [ slider_value, setSlider_value ] = useState(initValue); 
    const onChange = useCallback((event) => {
        callback && callback(event.target.value);
        setSlider_value(event.target.value);
    }, []);
    
    return (
        <>
            <label htmlFor="size_slider" className="form-label">
                {label}  : { showScale ? <strong>{slider_value - 15}</strong> : ''} 
            </label>  
            <div className = "sliderbar-group">
                <RangeSlider className = "form-range"  min= {min} max={max} onChange={onChange}  value={slider_value} />   
                { showScale ? <p className = "sacle"> </p> : ''}
            </div>
        </>
    );
};

export default ControlSlider;
 