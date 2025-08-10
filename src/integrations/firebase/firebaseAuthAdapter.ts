import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { AuthPort, User, AuthCredentials, SignupData, OTPVerification } from '../../core/ports/auth.port';
import { getFirebaseAuth, getFirebaseFirestore } from './firebaseClient';

export class FirebaseAuthAdapter implements AuthPort {
  private auth = getFirebaseAuth();
  private db = getFirebaseFirestore();
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  private async createUserDoc(firebaseUser: FirebaseUser, additionalData: any = {}) {
    if (!this.db) throw new Error('Firestore not initialized');

    const userRef = doc(this.db, 'users', firebaseUser.uid);
    const userData = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || additionalData.name || '',
      phone: firebaseUser.phoneNumber || additionalData.phone || '',
      avatar: firebaseUser.photoURL || '',
      role: 'user' as const,
      isVerified: firebaseUser.emailVerified,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      ...additionalData,
    };

    await setDoc(userRef, userData, { merge: true });
    return this.mapFirebaseUser(firebaseUser, userData);
  }

  private async mapFirebaseUser(firebaseUser: FirebaseUser, userData?: any): Promise<User> {
    if (!this.db) throw new Error('Firestore not initialized');

    let userDoc = userData;
    if (!userDoc) {
      const userRef = doc(this.db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userRef);
      userDoc = docSnap.data();
    }

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || userDoc?.name || '',
      phone: firebaseUser.phoneNumber || userDoc?.phone || '',
      avatar: firebaseUser.photoURL || userDoc?.avatar || '',
      role: userDoc?.role || 'user',
      isVerified: firebaseUser.emailVerified,
      createdAt: userDoc?.createdAt?.toDate() || new Date(),
      lastLoginAt: new Date(),
    };
  }

  async login(credentials: AuthCredentials): Promise<{ user: User; token: string }> {
    if (!this.auth) throw new Error('Firebase Auth not initialized');

    const result = await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
    const user = await this.mapFirebaseUser(result.user);
    const token = await result.user.getIdToken();

    // Update last login
    if (this.db) {
      const userRef = doc(this.db, 'users', result.user.uid);
      await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
    }

    return { user, token };
  }

  async loginWithGoogle(): Promise<{ user: User; token: string }> {
    if (!this.auth) throw new Error('Firebase Auth not initialized');

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = await this.createUserDoc(result.user);
    const token = await result.user.getIdToken();

    return { user, token };
  }

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    if (!this.auth) throw new Error('Firebase Auth not initialized');

    const result = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
    
    // Update profile
    await updateProfile(result.user, {
      displayName: data.name,
    });

    // Send email verification
    await sendEmailVerification(result.user);

    const user = await this.createUserDoc(result.user, { name: data.name, phone: data.phone });
    const token = await result.user.getIdToken();

    return { user, token };
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    if (!this.auth) throw new Error('Firebase Auth not initialized');

    try {
      // Initialize reCAPTCHA verifier
      if (!this.recaptchaVerifier) {
        this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }

      const provider = new PhoneAuthProvider(this.auth);
      const verificationId = await provider.verifyPhoneNumber(phone, this.recaptchaVerifier);
      
      // Store verification ID for later use
      sessionStorage.setItem('phoneVerificationId', verificationId);

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      console.error('OTP send error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP',
      };
    }
  }

  async verifyOTP(data: OTPVerification): Promise<{ user: User; token: string }> {
    if (!this.auth) throw new Error('Firebase Auth not initialized');

    const verificationId = sessionStorage.getItem('phoneVerificationId');
    if (!verificationId) {
      throw new Error('No verification ID found. Please request OTP again.');
    }

    const credential = PhoneAuthProvider.credential(verificationId, data.otp);
    const result = await signInWithCredential(this.auth, credential);
    
    const user = await this.mapFirebaseUser(result.user);
    const token = await result.user.getIdToken();

    // Update phone verification status
    if (this.db) {
      const userRef = doc(this.db, 'users', result.user.uid);
      await updateDoc(userRef, { 
        phoneVerified: true,
        phone: data.phone,
      });
    }

    sessionStorage.removeItem('phoneVerificationId');
    return { user, token };
  }

  async logout(): Promise<void> {
    if (!this.auth) throw new Error('Firebase Auth not initialized');
    await signOut(this.auth);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.auth?.currentUser) return null;
    return this.mapFirebaseUser(this.auth.currentUser);
  }

  async refreshToken(): Promise<{ token: string }> {
    if (!this.auth?.currentUser) throw new Error('No user logged in');
    const token = await this.auth.currentUser.getIdToken(true);
    return { token };
  }
}