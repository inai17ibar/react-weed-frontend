import React, { useEffect, useRef } from 'react';
import './CommitsGraph.css';

export default function CommitsGraph({ data, thresholds = [0, 0, 50, 100, 300] }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const containerElement = containerRef.current;
        if (containerElement) {
        containerElement.scrollLeft = containerElement.scrollWidth;
        }
    }, []);
    
    const getColor = (value) => {
        let color = "#EBEDF0"; // デフォルトの色
        if(value > thresholds[4]) color = "#196127";
        else if(value > thresholds[3]) color = "#239A3B";
        else if(value > thresholds[2]) color = "#7BC96F";
        else if(value > thresholds[1]) color = "#C6E48B";
        else if(value === thresholds[0]) color = "#E6F2DA";
        return color;
    };

    const sortedData = [...data].sort((a, b) => new Date(a.Date) - new Date(b.Date));

    const startDate = new Date(sortedData[0].Date);
    const endDate = new Date(sortedData[sortedData.length - 1].Date);
    const allDates = [];

    for(let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }

    const dataWithEmptyDates = allDates.map(date => {
        const found = sortedData.find(d => new Date(d.Date).getTime() === date.getTime());
        return found || { Date: formatDate(date), Total: 0 };
    });

    const weeks = [];
    for(let i = 0; i < dataWithEmptyDates.length; i += 7) {
        weeks.push(dataWithEmptyDates.slice(i, i + 7));
    }

    return (
        <div className="graph-container" ref={containerRef}>
            {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="graph-week">
                    {week.map(day => (
                        <div
                            key={day.Date}
                            title={`Date: ${day.Date}\nTotal: ${day.Total}`}
                            className="graph-cell"
                            style={{ backgroundColor: getColor(day.Total) }}
                        >
                            <div className="tooltip">{`Date: ${day.Date}\nTotal: ${day.Total}`}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
