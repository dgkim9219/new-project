// AllOrder.tsx

"use client";

import styles from "../styles/allOrder.module.css";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from 'reactstrap';

const AllOrderTable = ({ content }) => {
    const [AllOrderTableQty, setAllOrderTableQty] = useState([]);
    const [AllOrderTableQty2, setAllOrderTableQty2] = useState([]);

    useEffect(() => {
        fetchData(content);
    }, [content]);
    
    const fetchData = async (planNo) => {
        try {
            const response_AllOrderTableQty = await axios.get(`/api/Query_AllOrder?planNo=${planNo}`);
            const modifiedData = response_AllOrderTableQty.data.map((item) => ({
                ...item,
                orderCount: parseInt(item.orderCount).toLocaleString() + " 건",
                semi2Count: parseInt(item.semi2Count).toLocaleString() + " EA",
                fertCount: parseInt(item.fertCount).toLocaleString() + " Kit",
            }));
            setAllOrderTableQty(modifiedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(content);
    }, [content]);

    const renderTableData = (data) => {
        return data.map((item, index) => {
            const { orderCount, semi2Count, fertCount } = item;
            return (
                <tr key={index}>
                    <td className={styles.th2}>{orderCount}</td>
                    <td className={styles.th2}>{semi2Count}</td>
                    <td className={styles.th2}>{fertCount}</td>
                </tr>
            );
        });
    };

    return (
        <div className={styles.div1}>
            <div className={styles.div2}>
                <div>
                    <div className={styles.div3}>총</div>
                    <Table className={styles.table1}>
                        <thead>
                            <tr>
                                <th className={styles.th1}>생산지시 건수</th>
                                <th className={styles.th1}>반제품 수량</th>
                                <th className={styles.th1}>완제품 수량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableData(AllOrderTableQty)}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <div className={styles.div3}>완료</div>
                    <Table className={styles.table1}>
                        <thead>
                            <tr>
                                <th className={styles.th1}>생산지시 건수</th>
                                <th className={styles.th1}>반제품 수량</th>
                                <th className={styles.th1}>완제품 수량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableData(AllOrderTableQty2)}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

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
