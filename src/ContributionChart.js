import React, { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
const ContributionChart = ({ data }) => {
  const rows = 7;
  const columns = 51;
  const months = [
    "Янв.",
    "Февр.",
    "Март.",
    "Апр.",
    "Май.",
    "Июнь.",
    "Июль.",
    "Авг.",
    "Сент.",
    "Окт.",
    "Нояб.",
    "Дек.",
  ];

  const weekdays = ["Пн", "Ср", "Пт"];
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredCount, setHoveredCount] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const blockRef = useRef(null);

  useEffect(() => {
    // Добавьте обработчик события для всего документа при монтировании компонента.
    document.addEventListener("click", handleClickOutside);

    // Удалите обработчик события при размонтировании компонента.
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (blockRef.current && !blockRef.current.contains(e.target)) {
      setHoveredDate(null);
      setHoveredCount(null);
    }
  };

  const generateColor = (count) => {
    if (count === 0) {
      return "#EDEDED";
    } else if (count >= 1 && count <= 9) {
      return "#ACD5F2";
    } else if (count >= 10 && count <= 19) {
      return "#7FA8C9";
    } else if (count >= 20 && count <= 29) {
      return "#527BA0";
    } else {
      return "#254E77";
    }
  };

  const generateChart = () => {
    const chart = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 50 * 7);

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < columns; j++) {
        const dateString = currentDate.toISOString().slice(0, 10);
        const count = data[dateString] || 0;
        const color = generateColor(count);

        row.push(
          <div
            key={dateString}
            className="day"
            style={{
              backgroundColor: color,
            }}
            onClick={(e) => handleCellClick(dateString, e, count)}
          ></div>
        );

        currentDate.setDate(currentDate.getDate() + 1);
      }

      chart.push(
        <div key={`row-${i}`} style={{ display: "flex" }}>
          {row}
        </div>
      );
    }

    return chart;
  };
  const handleCellClick = (dateString, event, count) => {
    if (count !== null) {
      setHoveredDate(dateString);
      setHoveredCount(count);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div className="container">
      <div className="contribution" ref={blockRef}>
        <div style={{ display: "flex" }}>
          <div className="weekdays">
            {weekdays.map((day, index) => (
              <div key={index} className="weekday_label">
                {day}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              margin: "0 5px",
            }}
          >
            {generateChart()}
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                padding: " 0 20px",
              }}
            >
              {months.map((months, index) => (
                <div key={index} className="months-label">
                  {months}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="day_discription">
          <p className="Less_More">Меньше</p>
          <div
            className="day"
            style={{
              backgroundColor: "#EDEDED",
            }}
            onClick={(e) => handleCellClick("", e, 0)}
          ></div>
          <div
            className="day"
            style={{
              backgroundColor: "#ACD5F2",
            }}
            onClick={(e) => handleCellClick("", e, "1-9")}
          ></div>
             <div
            className="day"
            style={{
              backgroundColor: "#7FA8C9",
            }}
            onClick={(e) => handleCellClick("", e, "10-19")}
          ></div>
            <div
            className="day"
            style={{
              backgroundColor: "#527BA0",
            }}
            onClick={(e) => handleCellClick("", e, "20-29")}
          ></div>
             <div
            className="day"
            style={{
              backgroundColor: "#254E77",
            }}
            onClick={(e) => handleCellClick("", e, "30+")}
          ></div>
                   <p className="Less_More">Больше</p>
        </div>
        {hoveredCount !== null && (
          <div
            className="tooltip"
            style={{
              transform: "translateX(-50%) translateY(-100%)",
              top: tooltipPosition.y - 20,
              left: tooltipPosition.x,
            }}
          >
            <p>{hoveredCount===0?"No":hoveredCount} contributions </p>
            {hoveredDate && (
              <p style={{ color: "#7C7C7C" }}>
                {format(parseISO(hoveredDate), "EEEE, MMMM d, yyyy", {
                  locale: ru,
                })}{" "}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionChart;
