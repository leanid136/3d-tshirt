import React, { useCallback } from 'react';
const PatternImg = ({img, current_pattern ,callback}) =>{

    const onClick = useCallback((event) => {
        callback && callback(current_pattern); 
    }, []);

    return (
        <div className = "pattern-item">
            <img src = {img}  onClick={onClick} />
        </div> 
    );
};
export default PatternImg;