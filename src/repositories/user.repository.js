const pool = require("../config/db");

// Create a user
async function createUser(name) {
  const result = await pool.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING *",
    [name],
  );

  return result.rows[0];
}

// Get all users
async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");

  return result.rows;
}

// Get one user by ID
async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  return result.rows[0];
}

// Update a user
async function updateUser(id, name) {
  const result = await pool.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
    [name, id],
  );

  return result.rows[0];
}

// Delete a user
async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id],
  );

  return result.rows[0];
}
// Get user with posts using JOIN
async function getUserWithPosts(id) {
  const result = await pool.query(
    `SELECT
        users.id,
        users.name,
        posts.id AS post_id,
        posts.title,
        posts.content
     FROM users
     LEFT JOIN posts
        ON users.id = posts.user_id
     WHERE users.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    posts: result.rows
      .filter(row => row.post_id !== null)
      .map(row => ({
        id: row.post_id,
        title: row.title,
        content: row.content
      }))
  };

  return user;
}
async function getUserStats() {
  const result = await pool.query(`
    SELECT
      users.id,
      users.name,
      COUNT(posts.id) AS total_posts
    FROM users
    LEFT JOIN posts
      ON users.id = posts.user_id
    GROUP BY users.id, users.name
    ORDER BY users.id
  `);

  return result.rows;
}
// async function getUsersPaginated(limit, offset) {
//   const result = await pool.query(
//     `SELECT *
//      FROM users
//      ORDER BY id ASC
//      LIMIT $1 OFFSET $2`,
//     [limit, offset],
//   );

//   return result.rows;
// }
async function getUsersPaginated(limit, offset, role, search, sortBy, order) {
  const allowedSortFields = ["id", "name", "email"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "id";

  const sortOrder = order === "DESC" ? "DESC" : "ASC";

  const conditions = [];
  const values = [];

  if (role) {
    values.push(role);
    conditions.push(`role = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  values.push(limit);
  const limitIndex = values.length;

  values.push(offset);
  const offsetIndex = values.length;

  const result = await pool.query(
    `SELECT id, name, email, role
     FROM users
     ${whereClause}
     ORDER BY ${sortField} ${sortOrder}
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    values,
  );

  return result.rows;
}
async function createUserWithPost(name, title, content) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [name],
    );

    const user = userResult.rows[0];

    const postResult = await client.query(
      `INSERT INTO posts (title, content, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, content, user.id],
    );

    await client.query("COMMIT");

    return {
      user,
      post: postResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
}

async function registerUser(name, email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, passwordHash],
  );

  return result.rows[0];
}
async function saveRefreshToken(userId, tokenHash, expiresAt) {
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at`,
    [userId, tokenHash, expiresAt],
  );

  return result.rows[0];
}

// async function findRefreshToken(tokenHash) {
//   const result = await pool.query(
//     `SELECT * FROM refresh_tokens
//      WHERE token_hash = $1 AND expires_at > NOW()`,
//     [tokenHash],
//   );

//   return result.rows[0];
// }
async function findRefreshToken(tokenHash) {
  const result = await pool.query(
    `SELECT
       rt.id,
       rt.user_id,
       rt.token_hash,
       rt.expires_at,
       u.email,
       u.role
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1
       AND rt.expires_at > NOW()`,
    [tokenHash],
  );

  return result.rows[0];
}
async function deleteRefreshToken(tokenHash) {
  const result = await pool.query(
    `DELETE FROM refresh_tokens
     WHERE token_hash = $1
     RETURNING id`,
    [tokenHash],
  );

  return result.rowCount > 0;
}
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserWithPosts,
  getUserStats,
  getUsersPaginated,
  createUserWithPost,
  findUserByEmail,
  registerUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
