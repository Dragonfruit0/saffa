'use server';

import { revalidatePath } from 'next/cache';
import { collection, getDocs, query, where, limit, updateDoc, doc, arrayUnion, arrayRemove, getDoc, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package, AISearchPreference } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAllPackages(): Promise<Package[]> {
    const querySnapshot = await getDocs(collection(db, 'packages'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
}

export async function getRecommendedPackages(userInput: string, preferences: AISearchPreference) {
  try {
    const allPackages = await getAllPackages();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the user's request: "${userInput}". 
    User's detailed preferences are: ${JSON.stringify(preferences)}.
    Given the following packages, recommend the top 3 that best match the user's request and preferences. 
    Return only the IDs of the recommended packages as a JSON array: ["id1", "id2", "id3"].

    Available Packages:
    ${JSON.stringify(allPackages, null, 2)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    const recommendedIds = JSON.parse(text) as string[];

    const recommendedPackages = allPackages.filter(p => recommendedIds.includes(p.id));
    
    // Ensure the order from the AI is preserved
    recommendedPackages.sort((a, b) => recommendedIds.indexOf(a.id) - recommendedIds.indexOf(b.id));

    return { success: true, data: recommendedPackages };

  } catch (error) {
    console.error("Error getting recommended packages:", error);
    // Fallback to keyword-based search if AI fails
    return getPackagesByKeywords(userInput);
  }
}


export async function getAiPreferences(userInput: string): Promise<AISearchPreference | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Based on the user query "${userInput}", extract the following travel preferences: duration (in days), budget (in local currency), desired travel dates or month, accommodation rating (e.g., 3-star, 4-star, 5-star), and transportation preferences. Return the preferences as a JSON object. If a preference is not mentioned, do not include it in the object.

    Example Query: "I am looking for a 10 day package for around 1,50,000 for 2 people in December. I would like to stay in a 5 star hotel and need flights included."

    Example Output:
    {
      "duration_days": 10,
      "budget_inr": 150000,
      "travel_month": "December",
      "accommodation_rating": "5-star",
      "transportation_preference": "flights included"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return JSON.parse(text) as AISearchPreference;
  } catch (error) {
    console.error("Error getting AI preferences:", error);
    return null;
  }
}

async function getPackagesByKeywords(keywords: string) {
    try {
        const q = query(
            collection(db, 'packages'),
            where('name', '>=', keywords),
            where('name', '<=', keywords + '\uf8ff'),
            limit(3)
        );
        const querySnapshot = await getDocs(q);
        const packages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Package[];
        return { success: true, data: packages };
    } catch (error) {
        console.error("Error searching packages by keywords:", error);
        return { success: false, error: 'Failed to search for packages.' };
    }
}

export async function addToWishlist(userId: string, packageId: string) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      wishlist: arrayUnion(packageId)
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: 'Failed to add to wishlist.' };
  }
}

export async function removeFromWishlist(userId: string, packageId: string) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      wishlist: arrayRemove(packageId)
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { success: false, error: 'Failed to remove from wishlist.' };
  }
}

export async function getWishlistPackages(userId: string): Promise<Package[]> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const wishlistIds = userData.wishlist || [];
      
      if (wishlistIds.length === 0) {
        return [];
      }

      const packagesQuery = query(collection(db, 'packages'), where(documentId(), 'in', wishlistIds));
      const packagesSnapshot = await getDocs(packagesQuery);
      
      return packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching wishlist packages:", error);
    return [];
  }
}
