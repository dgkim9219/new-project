// AllOrderYearMonthRangePicker.tsx

"use client";

import React, { useState } from 'react';

function YearMonthRangePicker({ onDateChange }) {
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState('');

  const handleChange = () => {
      const startYearMonth = `${startYear}${startMonth}`;
      onDateChange(startYearMonth);
  };

  return (
      <div>
          <h3>연월 선택</h3>
          <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
              <option value="">연도 선택</option>
              <option value="23">2023년</option>
              <option value="24">2024년</option>
          </select>
          <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
              <option value="">월 선택</option>
              <option value="01">01월</option>
              <option value="02">02월</option>
              <option value="03">03월</option>
              <option value="04">04월</option>
              <option value="05">05월</option>
              <option value="06">06월</option>
              <option value="07">07월</option>
              <option value="08">08월</option>
              <option value="09">09월</option>
              <option value="10">10월</option>
              <option value="11">11월</option>
              <option value="12">12월</option>
          </select>
          <button onClick={handleChange}>선택</button>
      </div>
  );
}
export default YearMonthRangePicker;