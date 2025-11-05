import { doc, getDoc, setDoc, increment, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile, Package } from './types';

const analyticsDocRef = doc(db, 'analytics', 'all-time');
const packageInteractionsCollectionRef = collection(db, 'packageInteractions');

export const trackLogin = async () => {
  try {
    await setDoc(analyticsDocRef, { logins: increment(1) }, { merge: true });
  } catch (error) {
    console.error('Error tracking login:', error);
  }
};

export const trackBookNowClick = async (pkg: Package, user: UserProfile) => {
  try {
    await setDoc(analyticsDocRef, { bookNowClicks: increment(1) }, { merge: true });
    await addDoc(packageInteractionsCollectionRef, {
      packageName: pkg.name,
      packageId: pkg.id,
      agentName: pkg.agentName,
      clickType: 'bookNow',
      user: {
        uid: user.uid,
        name: user.name ?? null,
        email: user.email ?? null,
        phoneNumber: user.phoneNumber ?? null
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking book now click:', error);
  }
};

export const trackPackageClick = async (pkg: Package, user: UserProfile) => {
  try {
    await addDoc(packageInteractionsCollectionRef, {
      packageName: pkg.name,
      packageId: pkg.id,
      agentName: pkg.agentName,
      clickType: 'moreInfo',
      user: {
        uid: user.uid,
        name: user.name ?? null,
        email: user.email ?? null,
        phoneNumber: user.phoneNumber ?? null
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking package click:', error);
  }
};

export const getAnalytics = async () => {
  try {
    const docSnap = await getDoc(analyticsDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return { logins: 0, bookNowClicks: 0 };
    }
  } catch (error) {
    console.error('Error getting analytics:', error);
    return { logins: 0, bookNowClicks: 0 };
  }
};

export const getPackageInteractions = async () => {
  try {
    const querySnapshot = await getDocs(packageInteractionsCollectionRef);
    const interactions = querySnapshot.docs.map(doc => doc.data());
    return interactions;
  } catch (error) {
    console.error('Error getting package interactions:', error);
    return [];
  }
}
