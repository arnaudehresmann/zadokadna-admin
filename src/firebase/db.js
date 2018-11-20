import { db } from './firebase';

export const doAddDailyZadoka = async (zadokaDay, filename) => {
    db.collection("daily")
      .doc(zadokaDay)
      .set({path: "daily/"+filename})
}