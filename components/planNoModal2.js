'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';
import styles from '../styles/planNoModal2.module.css'


const Modal = ({ closeModal, content }) => {
    const [modalQty, setmodalQty] = useState([]);

    useEffect(() => {
        fetchData0();
    }, []);
    
    const fetchData0 = async () => {
        try {
        console.log(content);
        const response_modalQty = await axios.get(`/api/Query_modal_planQty2?ordDate=${content}`);
        setmodalQty(response_modalQty.data);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };
        const renderTableData0 = () => {
            return modalQty.map((item) => {
            const { planNo, matDesc, ordCmf13, ordQty, ordCmf16 } = item;
            return (
                <tr key={planNo}>
                    <td className={styles.th1}>{planNo}</td>
                    <td className={styles.th1}>{matDesc}</td>
                    <td className={styles.th1}>{ordCmf13}</td>
                    <td className={styles.th2}>{new Intl.NumberFormat().format(ordQty)}</td>
                    <td className={styles.th2}>{new Intl.NumberFormat().format(ordCmf16)}</td>
                </tr>
            );
            });
        };

    const [modalList, setmodalList] = useState([{}]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
        // console.log(content)
        const response_modalist = await axios.get(`/api/Query_modal_planQty3?planDate=${content}`);
        setmodalList(response_modalist.data);
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };
        const renderTableData = () => {
            return modalList.map((item) => {
            const { planNo, masterMatDesc, planCmf4, qty} = item;
            return (
                <tr key={planNo}>
                <td className={styles.th1}>{planNo}</td>
                <td className={styles.th1}>{masterMatDesc}</td>
                <td className={styles.th1}>{planCmf4}</td>
                <td className={styles.th2}>{new Intl.NumberFormat().format(qty)}</td>

                </tr>
            );
            });
        };

        const [modalList2, setmodalList2] = useState([{}]);

        useEffect(() => {
            fetchData2();
        }, []);
    
        const fetchData2 = async () => {
            try {
            const response_modalist2 = await axios.get(`/api/Query_modal_planQty4?ordDate=${content}`);
            setmodalList2(response_modalist2.data);
            } catch (error) {
            console.error("Error fetching data:", error);
            }
        };
            const renderTableData2 = () => {
                return modalList2.map((item) => {
                const { planNo, matDesc, ordCmf13, ordQty, ordCmf16} = item;
                return (
                    <tr key={planNo}>
                    <td className={styles.th1}>{planNo}</td>
                    <td className={styles.th1}>{matDesc}</td>
                    <td className={styles.th1}>{ordCmf13}</td>
                    <td className={styles.th2}>{new Intl.NumberFormat().format(ordQty)}</td>
                    <td className={styles.th2}>{new Intl.NumberFormat().format(ordCmf16)}</td>
                    </tr>
                );
                });
            };
    
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <div className={styles.div1}> 
            <div  className ={styles.div2}> 
                <div>
                    <div className ={styles.div3}>반제품1</div>
                    <Table className={styles.table1}>
                        <thead>
                        <tr>
                            <th className={styles.th1}>지시번호</th>
                            <th className={styles.th1}>품목명</th>
                            <th className={styles.th1}>Cat.no</th>
                            <th className={styles.th2}>지시수량</th>
                            <th className={styles.th2}>실적수량</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableData2()}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <div className ={styles.div3}>반제품2</div>
                    <Table className={styles.table1}>
                        <thead>
                        <tr>
                            <th className={styles.th1}>지시번호</th>
                            <th className={styles.th1}>품목명</th>
                            <th className={styles.th1}>Cat.no</th>
                            <th className={styles.th2}>지시수량</th>
                            <th className={styles.th2}>실적수량</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableData0()}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <div className={styles.div3}>완제품</div>
                    <Table className={styles.table1}>
                        <thead>
                        <tr>
                            <th className={styles.th1}>지시번호</th>
                            <th className={styles.th1}>품목명</th>
                            <th className={styles.th1}>Cat.no</th>
                            <th className={styles.th2}>지시수량</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableData()}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;