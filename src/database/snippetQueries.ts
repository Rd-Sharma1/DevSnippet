import db from './db';

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

export const initializeDatabase =
  () => {
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

      console.log(
        "Database initialized"
      );
    } catch (error) {
      console.log(
        "DB Init Error:",
        error
      );
    }
  };

//   export const insertDemoSnippets = () => {
//     try {
//       db.execSync(`
//         INSERT INTO snippets (title, description, code, language, tags, isFavorite, aiSummary, createdAt, updatedAt)
//         VALUES
//           ('Hello World in JavaScript', 'A simple hello world example in JavaScript', 'console.log("Hello World!");', 'JavaScript', 'hello world, javascript', 0, 'A basic JavaScript snippet that prints "Hello World!" to the console.', datetime('now'), datetime('now')),
//           ('Factorial Function in Python', 'A function to calculate factorial of a number in Python', 'def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)', 'Python', 'factorial, python', 0, 'A recursive function in Python that calculates the factorial of a given number.', datetime('now'), datetime('now')),
//           ('Fetch API Example', 'Using Fetch API to make a GET request', 'fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));', 'JavaScript', 'fetch api, javascript, http request', 0, 'An example of using the Fetch API in JavaScript to make a GET request and handle the response.', datetime('now'), datetime('now'));
//       `);

//       console.log(
//         "Demo snippets inserted"
//       );
//     } catch (error) {
//       console.log(
//         "Insert Demo Snippets Error:",
//         error
//       );
//     }
//   }
export const getAllSnippets = () => {
    try {
        const result = db.getAllSync('SELECT * FROM snippets');
        return result as snippetDataType[];
    } catch (error) {
        console.log('Get All Snippets Error:', error);
        return [];
    }
}

export const getSnippetById = (id: number) => {
    try {
        const result = db.getFirstSync('SELECT * FROM snippets WHERE id = ?', [id]);
        return result as snippetDataType | null;
    } catch (error) {
        console.log('Get Snippet By ID Error:', error);
        return null;
    }
}

export const insertSnippet = (title: string, description: string, code: string, language: string, tags: string, isFavorite: number, aiSummary: string) => {
    try {
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        db.runSync('INSERT INTO snippets (title, description, code, language, tags, isFavorite, aiSummary, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, description, code, language, tags, isFavorite, aiSummary, createdAt, updatedAt]);
        console.log('Snippet inserted successfully');
    } catch (error) {
        console.log('Insert Snippet Error:', error);
    }
    return "success";
}

export const updateSnippet = (id: number, title: string, description: string, code: string, language: string, tags: string, isFavorite: number, aiSummary: string) => {
    try {
        const updatedAt = new Date().toISOString();
        db.runSync('UPDATE snippets SET title = ?, description = ?, code = ?, language = ?, tags = ?, isFavorite = ?, aiSummary = ?, updatedAt = ? WHERE id = ?', [title, description, code, language, tags, isFavorite, aiSummary, updatedAt, id]);
        console.log('Snippet updated successfully');
    } catch (error) {
        console.log('Update Snippet Error:', error);
    }
    return "success";
}

export const deleteSnippet = (id: number) => {
    try {
        db.runSync('DELETE FROM snippets WHERE id = ?', [id]);
        console.log('Snippet deleted successfully');
    } catch (error) {
        console.log('Delete Snippet Error:', error);
    }
}

export const toggleFavorite =
  (
    id: number,
    Value: number
  ) => {
    try {
      db.runSync(
        `
        UPDATE snippets
        SET isFavorite = ?
        WHERE id = ?
        `,
        [
          Value,
          id,
        ]
      );

      console.log(
        "Favorite updated"
      );
    } catch (error) {
      console.log(
        "Favorite Toggle Error:",
        error
      );
    }
  };

  export const searchSnippets =
  (query: string) => {
    try {
      const result =
        db.getAllSync(
          `
          SELECT *
          FROM snippets
          WHERE
            title LIKE ?
            OR language LIKE ?
            OR tags LIKE ?
          `,
          [
            `%${query}%`,
            `%${query}%`,
            `%${query}%`,
          ]
        );

      return result as snippetDataType[];
    } catch (error) {
      console.log(
        "Search Error:",
        error
      );

      return [];
    }
  };