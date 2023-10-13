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

    // 1. データの最初の日付が日曜日になるまで、weeksの最初の週に空のデータを追加
    const firstDay = new Date(data[0].Date).getDay(); // 0 = Sunday, 1 = Monday, ...
    const emptyDays = firstDay === 0 ? 0 : 7 - firstDay;
    for (let i = 0; i < emptyDays; i++) {
        data.unshift({
            Date: "",
            ContributionCount: 0,
        });
    }

    // 1-1. データの最後が7日分になるように空のデータを追加
    const lastDay = new Date(data[data.length - 1].Date).getDay();
    const emptyDaysAtEnd = (6 - lastDay) % 7; // 6 is Saturday
    for (let i = 0; i < emptyDaysAtEnd; i++) {
        data.push({
            Date: "",
            ContributionCount: 0,
        });
    }

    // 2. 週ごとのデータを分割
    const weeks = [];
    for(let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7).reverse());
    }

    return (
        <div className="graph-container" ref={containerRef}>
            {weeks.reverse().map((week, weekIndex) => (
                <div key={weekIndex} className="graph-week">
                    {week.map((day, dayIndex) => {
                        const key = day.Date || `empty-${weekIndex}-${dayIndex}`;
                        return (
                            <div
                                key={key}
                                className="graph-cell"
                                style={{ backgroundColor: getColor(day.ContributionCount) }}
                            >
                                <div className="tooltip">{`Date: ${day.Date}\n ContributionCount: ${day.ContributionCount}`}</div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
