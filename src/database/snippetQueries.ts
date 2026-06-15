import db from "./db";

export type snippetDataType = {
  id?: number;
  title: string;
  description?: string;
  code: string;
  language?: string;
  tags?: string;
  isFavorite?: number;
  aiSummary?: string;
};

export const initializeDatabase = () => {
  try {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS snippets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          code TEXT NOT NULL,
          language TEXT,
          tags TEXT,
          isFavorite INTEGER DEFAULT 0,
          aiSummary TEXT,
          createdAt TEXT,
          updatedAt TEXT
        );
      `);
  } catch (error) {
    return;
  }
};
export const getAllSnippets = () => {
  try {
    const result = db.getAllSync("SELECT * FROM snippets");
    return result as snippetDataType[];
  } catch (error) {
    return [];
  }
};

export const getSnippetById = (id: number) => {
  try {
    const result = db.getFirstSync("SELECT * FROM snippets WHERE id = ?", [id]);
    return result as snippetDataType | null;
  } catch (error) {
    return null;
  }
};

export const insertSnippet = (
  title: string,
  description: string,
  code: string,
  language: string,
  tags: string,
  isFavorite: number,
  aiSummary: string,
) => {
  try {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    db.runSync(
      "INSERT INTO snippets (title, description, code, language, tags, isFavorite, aiSummary, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        code,
        language,
        tags,
        isFavorite,
        aiSummary,
        createdAt,
        updatedAt,
      ],
    );
  } catch (error) {}
  return "success";
};

export const updateSnippet = (
  id: number,
  title: string,
  description: string,
  code: string,
  language: string,
  tags: string,
  isFavorite: number,
  aiSummary: string,
) => {
  try {
    const updatedAt = new Date().toISOString();
    db.runSync(
      "UPDATE snippets SET title = ?, description = ?, code = ?, language = ?, tags = ?, isFavorite = ?, aiSummary = ?, updatedAt = ? WHERE id = ?",
      [
        title,
        description,
        code,
        language,
        tags,
        isFavorite,
        aiSummary,
        updatedAt,
        id,
      ],
    );
  } catch (error) {}
  return "success";
};

export const updateSnippetAISummary = (id: number, aiSummary: string) => {
  try {
    const updatedAt = new Date().toISOString();
    db.runSync(
      "UPDATE snippets SET aiSummary = ?, updatedAt = ? WHERE id = ?",
      [aiSummary, updatedAt, id],
    );
  } catch (error) {}
};

export const deleteSnippet = (id: number) => {
  try {
    db.runSync("DELETE FROM snippets WHERE id = ?", [id]);
  } catch (error) {}
};

export const toggleFavorite = (id: number, Value: number) => {
  try {
    db.runSync(
      `
        UPDATE snippets
        SET isFavorite = ?
        WHERE id = ?
        `,
      [Value, id],
    );
  } catch (error) {}
};

export const searchSnippets = (query: string) => {
  try {
    const result = db.getAllSync(
      `
          SELECT *
          FROM snippets
          WHERE
            title LIKE ?
            OR language LIKE ?
            OR tags LIKE ?
          `,
      [`%${query}%`, `%${query}%`, `%${query}%`],
    );

    return result as snippetDataType[];
  } catch (error) {
    return [];
  }
};
