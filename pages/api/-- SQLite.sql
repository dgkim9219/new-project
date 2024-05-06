WITH CTE AS (
    SELECT
        PRODLIST.*,
        ORDERLIST.*,
        QCLIST.judgeResultDesc,
        ROW_NUMBER() OVER (PARTITION BY ORDERLIST.planNo ORDER BY ORDERLIST.ordDate DESC) AS RowNum
    FROM
        PRODLIST
        INNER JOIN ORDERLIST ON PRODLIST.planNo = ORDERLIST.planNo
        LEFT JOIN QCLIST ON ORDERLIST.ordCmf9 = QCLIST.reqCmf2
)
, RankedCTE AS (
    SELECT
        CTE.*,
        UNSTART.planNo_X AS UNSTART_planNo_X,
        ROW_NUMBER() OVER (PARTITION BY UNSTART.planNo_X ORDER BY CTE.ordDate DESC) AS UNSTART_RowNum
    FROM
        CTE
        INNER JOIN UNSTART ON CTE.planNo = UNSTART.planNo_X
    WHERE
        CTE.RowNum <= 2
)
SELECT
    UNSTART_planNo_X, UNSTART.planCmf4, planCmf8,
    MAX(CASE WHEN UNSTART_RowNum = 1 THEN judgeResultDesc END) AS First_judgeResultDesc,
    MAX(CASE WHEN UNSTART_RowNum = 2 THEN judgeResultDesc END) AS Second_judgeResultDesc
FROM
    RankedCTE
GROUP BY
    UNSTART_planNo_X;
