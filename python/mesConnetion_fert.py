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

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

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
    requestData = requests.get(url + planno ,headers=hs, verify=False, timeout=20)
    sleep(0.03)
    jsonDatas = None
    if requestData.status_code == 200 :
        # print ('reques ok')
        jsonDatas = requestData.json()
        return jsonDatas['list']


fertURL = "https://mes.seegene.com/v1/cwip/plnSts?pageSize=1000&pageNumber=0&planStatus=APPROVALSIGN,CONFIRM&fromDate=20231101&toDate=20241231&&planNo=P&masterMatType=FERT"

fertList = pd.DataFrame(url_parser(fertURL))

fertcountList = pd.DataFrame()

fertcountURL = "https://mes.seegene.com/v1/cwip/plnMat?checkbox4cb36825-b640-4f0f-8bdd-5618bb65a97d=false&id=&btnImage=undefined&planNo="

for i in fertList.index:
    a = fertList.at[i,"planNo"]
    if fertcountList.empty :
        fertcountList = pd.DataFrame(parser(fertcountURL, a))
    else:
        fertcountList = pd.concat([fertcountList, pd.DataFrame(parser(fertcountURL, a))],ignore_index=True)
    
del fertURL

fertList = fertList.join(fertcountList.set_index("planNo")["qty"], on= "planNo")


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
    drop_table(con,"FERTLIST")
    fertList.to_sql("FERTLIST",con)
    
except:
    fertList.to_sql("FERTLIST",con)

# %%
with open('meslog.txt','a') as f:
    f.write(str(datetime.datetime.now())+ '\n')
