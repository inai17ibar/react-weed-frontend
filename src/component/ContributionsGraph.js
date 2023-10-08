import React, { useRef, useEffect } from 'react';
import './ContributionsGraph.css';

export default function ContributionsGraph({ data, thresholds = [0, 2, 4, 8, 12] }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const containerElement = containerRef.current;
        if (containerElement) {
        containerElement.scrollLeft = containerElement.scrollWidth;
        }
    }, []);
    
    const getColor = (value) => {
        let color = "#E6F2DA"; // デフォルトの色
        if(value > thresholds[4]) color = "#196127";
        else if(value > thresholds[3]) color = "#239A3B";
        else if(value > thresholds[2]) color = "#7BC96F";
        else if(value > thresholds[1]) color = "#C6E48B";
        else if(value === thresholds[0]) color = "#EBEDF0";
        return color;
    };

    console.log(data)

    const weeks = [];
    for(let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
    }

    return (
        <div className="graph-container" ref={containerRef}>
            {weeks.reverse().map((week, weekIndex) => (
                <div key={weekIndex} className="graph-week">
                    {week.map(day => (
                        <div
                            key={day.Date}
                            title={`Date: ${day.Date}\n ContributionCount: ${day.ContributionCount}`}
                            className="graph-cell"
                            style={{ backgroundColor: getColor(day.ContributionCount) }}
                        >
                            <div className="tooltip">{`Date: ${day.Date}\n ContributionCount: ${day.ContributionsCount}`}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
