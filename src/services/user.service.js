const userRepository = require("../repositories/user.repository");

async function createUser(name) {
  return await userRepository.createUser(name);
}

async function getAllUsers() {
  return await userRepository.getAllUsers();
}

async function getUserById(id) {
  const user = await userRepository.getUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function updateUser(id, name) {
  const user = await userRepository.updateUser(id, name);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function deleteUser(id) {
  const user = await userRepository.deleteUser(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
async function getUserWithPosts(id) {
  const user = await userRepository.getUserWithPosts(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
async function getUserStats() {
  return await userRepository.getUserStats();
}
// async function getUsersPaginated(limit, offset) {
//   return await userRepository.getUsersPaginated(limit, offset);
// }
async function getUsersPaginated(limit, offset, role, search, sortBy, order) {
  return await userRepository.getUsersPaginated(
    limit,
    offset,
    role,
    search,
    sortBy,
    order,
  );
}
async function createUserWithPost(name, title, content) {
  return await userRepository.createUserWithPost(name, title, content);
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
  createUserWithPost
};
