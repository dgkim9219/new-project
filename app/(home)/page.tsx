import Image from 'next/image'
import SignInButton from '../../components/SignInButton'
import styles from "../../styles/home.module.css";


export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.slide}>
        
      </div>
      <div className={styles.div1}>

      </div>

      <div className={styles.div2}>
        <Image
          className={styles.image1}
          src="/seegene_home_logo.png"
          alt="seegene logo"
          width={290}
          height={56}
          priority
        />


          <SignInButton />
      </div>
      <div className={styles.div3}>
        <a
          href="https://mes.seegene.com"
          className={styles.a1}
          target="_blank"
          rel="noopener noreferrer"
        >
          
          
          <h2 className={styles.h2}>
            MES{' '}
            <span className={styles.span1}>
              -&gt;
            </span>
          </h2>
          <p className={styles.p2}>
            {/* MES 바로가기 */}
          </p>
        </a>

        <a
          href="https://ngw.seegene.com/ekp/main/home/homGwMain"
          className={styles.a1}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={styles.h2}>
            그룹웨어{' '}
            <span className={styles.span1}>
              -&gt;
            </span>
          </h2>
          <p className={styles.p2}>
            {/* 그룹웨어 바로가기 */}
          </p>
        </a>

        <a
          href="http://sgap.seegene.com:8081/sys/menu/main.do"
          className={styles.a1}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={styles.h2}>
            SG-Approval{' '}
            <span className={styles.span1}>
              -&gt;
            </span>
          </h2>
          <p className={styles.p2}>
            {/* SG-Approval 바로가기 */}
          </p>
        </a>

        <a
          href="/" //추후 주소 추가 
          className={styles.a1}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={styles.h2}>
            추가{' '} /
            <span className={styles.span1}>
              -&gt;
            </span>
          </h2>
          <p className={styles.p2}>
            {/* 추가 바로가기 */}
          </p>
        </a>
      </div>
    </main>
  )
}
