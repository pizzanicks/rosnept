import { deleteUser as deleteAuthUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase'; // Initialize Firebase Auth in your server-side code
import db from '@/lib/firebase'; // Initialize Firestore

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Ensure the user is authenticated and the userId matches the current user
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      return res.status(403).json({ error: 'Forbidden: User does not match the authenticated user' });
    }

    // Delete the Firestore document
    const userDocRef = doc(db, 'USERS', userId);
    await deleteDoc(userDocRef);

    // Delete the user from Firebase Authentication
    await deleteAuthUser(user);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
}
