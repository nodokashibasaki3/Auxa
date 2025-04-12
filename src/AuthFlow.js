import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const provider = new GoogleAuthProvider();

// Optional: Add Google Contacts scope, or use `useDeviceLanguage`
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
auth.useDeviceLanguage();

const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: '',
  dateOfBirth: '',
  diagnosisType: '',
  autismType: '',
  selfDiagnosed: false,
  lightSensitivity: 3
});

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (step === 'signin') {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        onComplete(userDoc.data());
      } else {
        await auth.signOut();
        alert("No profile data found. Please sign up first.");
      }

    } else if (step === 'signup') {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email: formData.email,
        name: formData.name
      });

      setStep('profile');

    } else if (step === 'profile') {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        uid: user.uid
      }, { merge: true });

      onComplete({ ...formData, uid: user.uid });
    }
  } catch (err) {
    console.error("Auth error:", err);
    alert(err.message);
  }
};

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the user already has a profile
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // First-time user → Create basic Firestore profile
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        dateOfBirth: '',
        diagnosisType: '',
        autismType: '',
        selfDiagnosed: false,
        lightSensitivity: 3
      });
    }

    const finalProfile = (await getDoc(userDocRef)).data();
    onComplete(finalProfile);
  } catch (error) {
    console.error('Google Sign-in Error:', error);
    alert(error.message);
  }
};

provider.setCustomParameters({
  prompt: 'select_account', // Always ask user to choose account
});