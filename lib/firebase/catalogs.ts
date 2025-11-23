import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "./config";
import { Catalog } from "@/types";

const CATALOGS_COLLECTION = "catalogs";

export async function getAllCatalogs(): Promise<Catalog[]> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return [];
    }

    const catalogsRef = collection(db, CATALOGS_COLLECTION);
    const q = query(catalogsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const catalogs = snapshot.docs.map((catalogDoc) => {
      const data: any = catalogDoc.data();
      return {
        id: catalogDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Catalog;
    });

    return catalogs;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return [];
  }
}

export async function getCatalogById(id: string): Promise<Catalog | null> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return null;
    }

    const catalogRef = doc(collection(db, CATALOGS_COLLECTION), id);
    const catalogSnap = await getDoc(catalogRef);

    if (!catalogSnap.exists()) {
      return null;
    }

    const data: any = catalogSnap.data();

    return {
      id: catalogSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Catalog;
  } catch (error) {
    console.error("Error fetching catalog by id:", error);
    return null;
  }
}
