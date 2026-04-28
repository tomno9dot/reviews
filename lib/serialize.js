// lib/serialize.js
// Reusable serialization helper

export function serializeDoc(doc) {
  if (!doc) return null;

  const obj = typeof doc.toObject === 'function'
    ? doc.toObject()
    : { ...doc };

  const result = {};

  for (const key in obj) {
    const value = obj[key];

    if (value === null || value === undefined) {
      result[key] = null;
    } else if (value instanceof Date) {
      // ✅ Convert Date to ISO string
      result[key] = value.toISOString();
    } else if (
      value &&
      typeof value === 'object' &&
      typeof value.toString === 'function' &&
      value.constructor?.name === 'ObjectId'
    ) {
      // ✅ Convert ObjectId to string
      result[key] = value.toString();
    } else if (typeof value === 'object' && value.buffer) {
      // ✅ Convert buffer ObjectId to string
      result[key] = value.toString();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' ? serializeDoc(item) : item
      );
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function serializeDocs(docs) {
  if (!docs || !Array.isArray(docs)) return [];
  return docs.map(serializeDoc);
}