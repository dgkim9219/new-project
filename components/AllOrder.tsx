// AllOrder.tsx

"use client";

import styles from "../styles/allOrder.module.css";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from 'reactstrap';

const AllOrderTable = ({ content }) => {
    const [AllOrderTableQty, setAllOrderTableQty] = useState([]);

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

                </div>
            </div>
        </div>
    );
};
export default AllOrderTable;
