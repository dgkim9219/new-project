import Qcing from '../../components/Qcing';
import Calendar from '../../components/calendar';
import styles from '../../styles/endProduct.module.css'


export default function fertpage() {
    const fert = 'fert'
  return (
    <div className={styles.div1}>
      <div className={styles.div2}>
        <Qcing
            data={fert}
        />
      </div>
      <div className={styles.div4}>
        <Calendar
            data={fert}
        />
      </div>
    </div>
  );
}
