import pandas as pd
import urllib3
import sqlite3
from sqlite3 import Error
import re

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def connection():
    try:

        con = sqlite3.connect('./my_DB.db')
        # con = sqlite3.connect('my_DB.db')
        return con
    except Error:
        print(Error)

con = connection()

#########################################################################################################


def update_orderlist_with_qclist(con):
    try:
        cursor_db = con.cursor()
        
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET JudgeResultCode = (SELECT QCLIST.judgeResultCode 
                                FROM QCLIST 
                                WHERE ORDERLIST.ordCmf9 = QCLIST.reqCmf2)
        """)

        # operCode열의 정보에 따라 다양한 작업을 수행
        # OPR-011인 행에 대하여 ordDate열의 정보를 Elution 열에, ordCmf9열의 정보를 ElutionLot열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET Elution = ordDate,
                ElutionLot = ordCmf9
            WHERE operCode = 'OPR-011'
        """)

        # OPR-010인 행에 대하여 ordDate열의 정보를 Epoch 열에, ordCmf9열의 정보를 EpochLot열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET Epoch = ordDate,
                EpochLot = ordCmf9
            WHERE operCode = 'OPR-010'
        """)

        # OPR-041인 행에 대하여 ordDate열의 정보를 PmMono열에, ordCmf9열의 정보를 PmMonoLot, judgeResultCode열의 정보를 PmMonoLotQCR열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET PmMono = ordDate,
                PmMonoLot = ordCmf9,
                PmMonoLotQCR = judgeResultCode
            WHERE operCode = 'OPR-041'
        """)

        # OPR-042인 행에 대하여 ordDate열의 정보를 TomMono열에, ordCmf9열의 정보를 TomMonoLot, judgeResultCode열의 정보를 TomMonoLotQCR열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET TomMono = ordDate,
                TomMonoLot = ordCmf9,
                TomMonoLotQCR = judgeResultCode
            WHERE operCode IN ('OPR-042', 'OPR-044')
        """)

        # OPR-040인 행에 대하여 ordDate열의 정보를 OmMono열에, ordCmf9열의 정보를 OmMonoLot, judgeResultCode열의 정보를 OmMonoLotQCR열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET OmMono = ordDate,
                OmMonoLot = ordCmf9,
                OmMonoLotQCR = judgeResultCode
            WHERE operCode = 'OPR-040'
        """)

        # OPR-050인 행에 대하여 ordDate열의 정보를 Minisemi1열에, ordCmf9열의 정보를 Minisemi1Lot, judgeResultCode열의 정보를 Minisemi1LotQCR열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET Minisemi1 = ordDate,
                Minisemi1Lot = ordCmf9,
                Minisemi1LotQCR = judgeResultCode
            WHERE operCode = 'OPR-050'
        """)

        # OPR-060, OPR-200, OPR-250인 행에 대하여 ordDate열의 정보를 semi1열에, ordCmf9열의 정보를 Semi1Lot, judgeResultCode열의 정보를 semi1LotQCR열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET Semi1 = ordDate,
                Semi1Lot = ordCmf9,
                Semi1LotQCR = judgeResultCode
            WHERE operCode IN ('OPR-060', 'OPR-200', 'OPR-250')
        """)

        # semi2_process 테이블의 operCode에 해당하는 행에 대하여 ordDate열의 정보를 semi2열에, ordCmf9열의 정보를 Semi2Lot, judgeResultCode열의 정보를 Semi2LotQCR열에 입력
        cursor_db.execute("""
            UPDATE ORDERLIST 
            SET Semi2 = ordDate,
                Semi2Lot = ordCmf9,
                Semi2LotQCR = judgeResultCode
            WHERE operCode IN (SELECT operCode FROM semi2_process)
        """)

        con.commit()

    except Error as e:
        print(f"Error occurred: {e}")

# ORDERLIST 테이블 업데이트 수행
update_orderlist_with_qclist(con)

def update_prodlist_with_process_list1(con):
    try:
        cursor_db = con.cursor()
        
        # process_List 테이블의 masterMatCode를 기준으로 operCode열의 정보를 합침
        cursor_db.execute("""
            SELECT masterMatCode, GROUP_CONCAT(operCode) AS combined_operCode
            FROM process_List
            GROUP BY masterMatCode
        """)
        process_list_combined = cursor_db.fetchall()
        
        # PRODLIST 테이블에 masterMatCode를 기준으로 operCode열 추가
        for masterMatCode, combined_operCode in process_list_combined:
            cursor_db.execute(f"""
                UPDATE PRODLIST
                SET operCode = '{combined_operCode}'
                WHERE masterMatCode = '{masterMatCode}'
            """)
        
        con.commit()

    except Error as e:
        print(f"Error occurred: {e}")

# PRODLIST 테이블 업데이트 수행
update_prodlist_with_process_list1(con)

def update_prodlist_with_process_list2(con):
    try:
        cursor_db = con.cursor()
        cursor_db.execute("""
            SELECT
            planNo,
            GROUP_CONCAT(CAST(qty AS INTEGER)) AS combined_qty,
            GROUP_CONCAT(matCmf1) AS combined_matCmf1
                          
            FROM QTPRODS
                          
            GROUP BY planNo
        """)
        QTPRODS_combined = cursor_db.fetchall()
        
        for planNo, combined_qty, combined_matCmf1 in QTPRODS_combined:
            cursor_db.execute(f"""
                UPDATE
                PRODLIST
                
                SET
                Qty = '{combined_qty}',
                MatCmf1 = '{combined_matCmf1}'

                WHERE
                planNo = '{planNo}'
            """)
        
        con.commit()

    except Error as e:
        print(f"Error occurred: {e}")

# PRODLIST 테이블 업데이트 수행
update_prodlist_with_process_list2(con)

def update_dg_master_table(con):
    try:
        cursor_db = con.cursor()
        cursor_db.execute("""
            INSERT OR REPLACE INTO dgMasterTable (planNo)
            SELECT 
                PL.planNo
            FROM PRODLIST PL
            LEFT JOIN dgMasterTable DG ON PL.planNo = DG.planNo
            WHERE DG.planNo IS NULL;
        """)
        con.commit()

    except Error as e:
        print(f"Error occurred: {e}")

update_dg_master_table(con)

def update_dg_master_table2(con):
    try:
        cursor_db = con.cursor()
        cursor_db.execute("""
            UPDATE dgMasterTable
            SET
                MatCmf1 = (
                    SELECT MatCmf1 FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                ),
                mstMatCmf2 = (
                    SELECT mstMatCmf2 FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                ),
                Qty = (
                    SELECT Qty FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                ),
                halbDate = (
                    SELECT halbDate FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                ),
                masterMatCode = (
                    SELECT masterMatCode FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                ),
                operCode = (
                    SELECT operCode FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                ),
                planCmf4 = (
                    SELECT planCmf4 FROM PRODLIST WHERE PRODLIST.planNo = dgMasterTable.planNo
                );                          
        """)
        con.commit()

    except Error as e:
        print(f"Error occurred: {e}")

update_dg_master_table2(con)

def update_dgMasterTable_ORDERLIST(con):
    try:
        cursor_db = con.cursor()
        cursor_db.execute("""
            SELECT
            planNo,
            GROUP_CONCAT(Elution) AS concatenated_elution,
            GROUP_CONCAT(Epoch) AS concatenated_epoch,
            GROUP_CONCAT(PmMono) AS concatenated_pmMono,
            GROUP_CONCAT(TomMono) AS concatenated_tomMono,
            GROUP_CONCAT(OmMono) AS concatenated_omMono,
            GROUP_CONCAT(Minisemi1) AS concatenated_minisemi1,
            GROUP_CONCAT(Semi1) AS concatenated_semi1,
            GROUP_CONCAT(Semi2) AS concatenated_semi2,
            GROUP_CONCAT(ElutionLot) AS concatenated_elutionLot,
            GROUP_CONCAT(EpochLot) AS concatenated_epochLot,
            GROUP_CONCAT(PmMonoLot) AS concatenated_pmMonoLot,
            GROUP_CONCAT(TomMonoLot) AS concatenated_tomMonoLot,
            GROUP_CONCAT(OmMonoLot) AS concatenated_omMonoLot,
            GROUP_CONCAT(Minisemi1Lot) AS concatenated_minisemi1Lot,
            GROUP_CONCAT(Semi1Lot) AS concatenated_semi1Lot,
            GROUP_CONCAT(Semi2Lot) AS concatenated_semi2Lot,
            GROUP_CONCAT(PmMonoLotQCR) AS concatenated_pmMonoLotQCR,
            GROUP_CONCAT(TomMonoLotQCR) AS concatenated_tomMonoLotQCR,
            GROUP_CONCAT(OmMonoLotQCR) AS concatenated_omMonoLotQCR,
            GROUP_CONCAT(Minisemi1LotQCR) AS concatenated_minisemi1LotQCR,
            GROUP_CONCAT(Semi1LotQCR) AS concatenated_semi1LotQCR,
            GROUP_CONCAT(Semi2LotQCR) AS concatenated_semi2LotQCR
                                                                              
            FROM ORDERLIST
                          
            GROUP BY planNo
        """)
        ORDERLIST_combined = cursor_db.fetchall()
        
        for planNo, concatenated_elution, concatenated_epoch, concatenated_pmMono, concatenated_tomMono, concatenated_omMono, concatenated_minisemi1, concatenated_semi1, concatenated_semi2, concatenated_elutionLot, concatenated_epochLot, concatenated_pmMonoLot, concatenated_tomMonoLot, concatenated_omMonoLot, concatenated_minisemi1Lot, concatenated_semi1Lot, concatenated_semi2Lot, concatenated_pmMonoLotQCR, concatenated_tomMonoLotQCR, concatenated_omMonoLotQCR, concatenated_minisemi1LotQCR, concatenated_semi1LotQCR, concatenated_semi2LotQCR in ORDERLIST_combined:
            
            concatenated_elution = '' if concatenated_elution is None else concatenated_elution
            concatenated_epoch = '' if concatenated_epoch is None else concatenated_epoch
            concatenated_pmMono = '' if concatenated_pmMono is None else concatenated_pmMono
            concatenated_tomMono = '' if concatenated_tomMono is None else concatenated_tomMono
            concatenated_omMono = '' if concatenated_omMono is None else concatenated_omMono
            concatenated_minisemi1 = '' if concatenated_minisemi1 is None else concatenated_minisemi1
            concatenated_semi1 = '' if concatenated_semi1 is None else concatenated_semi1
            concatenated_semi2 = '' if concatenated_semi2 is None else concatenated_semi2
            concatenated_elutionLot = '' if concatenated_elutionLot is None else concatenated_elutionLot
            concatenated_epochLot = '' if concatenated_epochLot is None else concatenated_epochLot
            concatenated_pmMonoLot = '' if concatenated_pmMonoLot is None else concatenated_pmMonoLot
            concatenated_tomMonoLot = '' if concatenated_tomMonoLot is None else concatenated_tomMonoLot
            concatenated_omMonoLot = '' if concatenated_omMonoLot is None else concatenated_omMonoLot
            concatenated_minisemi1Lot = '' if concatenated_minisemi1Lot is None else concatenated_minisemi1Lot
            concatenated_semi1Lot = '' if concatenated_semi1Lot is None else concatenated_semi1Lot
            concatenated_semi2Lot = '' if concatenated_semi2Lot is None else concatenated_semi2Lot
            concatenated_pmMonoLotQCR = '' if concatenated_pmMonoLotQCR is None else concatenated_pmMonoLotQCR
            concatenated_tomMonoLotQCR = '' if concatenated_tomMonoLotQCR is None else concatenated_tomMonoLotQCR
            concatenated_omMonoLotQCR = '' if concatenated_omMonoLotQCR is None else concatenated_omMonoLotQCR
            concatenated_minisemi1LotQCR = '' if concatenated_minisemi1LotQCR is None else concatenated_minisemi1LotQCR
            concatenated_semi1LotQCR = '' if concatenated_semi1LotQCR is None else concatenated_semi1LotQCR
            concatenated_semi2LotQCR = '' if concatenated_semi2LotQCR is None else concatenated_semi2LotQCR
            
            cursor_db.execute(f"""
                UPDATE dgMasterTable
                              
                SET
                Elution = '{concatenated_elution}',
                Epoch = '{concatenated_epoch}',
                PmMono = '{concatenated_pmMono}',
                TomMono = '{concatenated_tomMono}',
                OmMono = '{concatenated_omMono}',
                Minisemi1 = '{concatenated_minisemi1}',
                Semi1 = '{concatenated_semi1}',
                Semi2 = '{concatenated_semi2}',
                ElutionLot = '{concatenated_elutionLot}',
                EpochLot = '{concatenated_epochLot}',
                PmMonoLot = '{concatenated_pmMonoLot}',
                TomMonoLot = '{concatenated_tomMonoLot}',
                OmMonoLot = '{concatenated_omMonoLot}',
                Minisemi1Lot = '{concatenated_minisemi1Lot}',
                Semi1Lot = '{concatenated_semi1Lot}',
                Semi2Lot = '{concatenated_semi2Lot}',
                PmMonoLotQCR = '{concatenated_pmMonoLotQCR}',
                TomMonoLotQCR = '{concatenated_tomMonoLotQCR}',
                OmMonoLotQCR = '{concatenated_omMonoLotQCR}',
                Minisemi1LotQCR = '{concatenated_minisemi1LotQCR}',
                Semi1LotQCR = '{concatenated_semi1LotQCR}',
                Semi2LotQCR = '{concatenated_semi2LotQCR}'
                                
                WHERE planNo = '{planNo}'
            """)

        con.commit()
        print("MES 연동 테이블 업데이트 완료")
    except Error as e:
        print(f"Error occurred: {e}")

update_dgMasterTable_ORDERLIST(con)


#########################################################################################################