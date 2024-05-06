# %%
# 필요한 라이브러리들 import 하기
import pandas as pd
import requests
import urllib3
import os
import datetime
from operator import index
import sqlite3
from time import sleep
from sqlite3 import Error

import schedule
import time

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def run_scraper2():
    try:


# %%
# url관련 함수
        def url_parser(url) :
            
            hs = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36'} 
            requestData = requests.get(url,headers=hs, verify=False, timeout=10)
            jsonData = None
            if requestData.status_code == 200 :
                # print ('reques ok')
                jsonData = requestData.json()
                return jsonData["list"]   
                
        def parser(url, planno):
            hs = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36'} 
            requestData = requests.get(url + planno ,headers=hs, verify=False, timeout=10)
            sleep(0.03)
            jsonDatas = None
            if requestData.status_code == 200 :
                # print ('reques ok')
                jsonDatas = requestData.json()
                return jsonDatas['list']
            

        # %%
        # MES에서 끌어오기
        prodURL2 = "https://mes.seegene.com/v1/cwip/plnSts?pageSize=1000&pageNumber=0&planStatus=COMPLETE&fromDate=20231101&toDate=20241231&&planNo=s&masterMatType=HALB"
        qcURL = "https://mes.seegene.com/v1/cqcm/ispJudge?pageSize=10000&pageNumber=0&fromDate=20231101&toDate=20241231"
        qtURL = "https://mes.seegene.com/v1/cwip/plnMat?checkboxf4325ead-4e46-4211-a2ce-53bfff5abce3=false&&planNo="


        prodList2 = pd.DataFrame(url_parser(prodURL2))
        qcList =  pd.DataFrame(url_parser(qcURL))
        qtProds2 = pd.DataFrame()

        from time import sleep

        orderList2 = pd.DataFrame()

        orURL = "https://mes.seegene.com/v1/swip/plnOrd?pageSize=100&pageNumber=0&planNo="


        for i in prodList2.index:
            a = prodList2.at[i,"planNo"] #한번에

            if qtProds2.empty : #수량확인
                qtProds2 = pd.DataFrame(parser(qtURL, a))
            else:
                qtProds2 = pd.concat([qtProds2, pd.DataFrame(parser(qtURL, a))],ignore_index=True)

            if orderList2.empty : #지시확인
                orderList2 = pd.DataFrame(parser(orURL, a))
                orderList2["planNo"] = a
            else:
                temp = pd.DataFrame(parser(orURL, a))
                temp["planNo"] = a
                orderList2 = pd.concat([orderList2, temp],ignore_index=True)
            sleep(0.03)


        
        del prodURL2
        del qcURL
        del qtURL
        del orURL
        del temp


        # %%
        # DB_connection
        def connection():
            try:

                con = sqlite3.connect('./my_DB.db')
                # con = sqlite3.connect('my_DB.db')
                return con
            except Error:
                print(Error)

        con = connection()

        def create_table(con, CreateSql):
            cursor_db = con.cursor()
            cursor_db.execute("CREATE TABLE " + CreateSql)
            con.commit()

        def drop_table(con, DropSql):
            cursor_db = con.cursor()
            cursor_db.execute("DROP TABLE " + DropSql)
            con.commit()
            

        # TEMP_DB생성
        try:
            drop_table(con, "ORDERLIST2")    
            drop_table(con, "QCLIST")
            drop_table(con, "PRODLIST2")
            drop_table(con, "QTPRODS2")
            orderList2.to_sql("ORDERLIST2", con)
            qcList.to_sql("QCLIST",con)
            prodList2.to_sql( "PRODLIST2", con)
            qtProds2.to_sql("QTPRODS2", con)
            
        except:
            orderList2.to_sql("ORDERLIST2", con)
            qcList.to_sql("QCLIST",con)
            prodList2.to_sql("PRODLIST2", con)
            qtProds2.to_sql("QTPRODS2", con)


        # %%
        with open('meslog.txt','a') as f:
            f.write(str(datetime.datetime.now())+ '\n')

#####################################################################################################

        def add_column2(con):
            try:
                cursor_db = con.cursor()
                
                cursor_db.execute("""        
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN JudgeResultCode TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Elution TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Epoch TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN PmMono TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN TomMono TEXT;
                """)
                cursor_db.execute("""                                      
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN OmMono TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Minisemi1 TEXT;
                """)
                cursor_db.execute("""                                           
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Semi1 TEXT;
                """)
                cursor_db.execute("""                         
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Semi2 TEXT;
                """)              
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN ElutionLot TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN EpochLot TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN PmMonoLot TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN TomMonoLot TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN OmMonoLot TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Minisemi1Lot TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Semi1Lot TEXT;
                """)
                cursor_db.execute("""                           
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Semi2Lot TEXT;
                """)            
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN PmMonoLotQCR TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN TomMonoLotQCR TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN OmMonoLotQCR TEXT;
                """)
                cursor_db.execute("""                          
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Minisemi1LotQCR TEXT;
                """)
                cursor_db.execute("""                                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Semi1LotQCR TEXT;
                """)
                cursor_db.execute("""                            
                    ALTER TABLE ORDERLIST2
                    ADD COLUMN Semi2LotQCR TEXT;
                """)

                cursor_db.execute("""        
                    ALTER TABLE PRODLIST2
                    ADD COLUMN operCode TEXT;
                """)                          
                cursor_db.execute("""                               
                    ALTER TABLE PRODLIST2
                    ADD COLUMN Qty TEXT;
                """)            
                cursor_db.execute("""                               
                    ALTER TABLE PRODLIST2
                    ADD COLUMN MatCmf1 TEXT;
                """)

                con.commit()

            except Error as e:
                print(f"Error occurred: {e}")

        # ORDERLIST 테이블 업데이트 수행
        add_column2(con)

######################################################################################################

        pass
    except Exception as e:
        # 에러가 발생하면 에러를 로깅하고 계속 진행합니다.
        with open('error_log.txt', 'a') as f:
            f.write(f'Error occurred: {str(e)}\n')

# 1시간마다 run_scraper 함수 실행
schedule.every().hour.at(":20").do(run_scraper2)

while True:
    schedule.run_pending()
    time.sleep(10)