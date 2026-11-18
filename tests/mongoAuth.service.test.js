const User = require("../src/models/user.model");
const {
  registerUser,
  loginUser,
} = require("../src/services/mongoAuth.service");

jest.mock("../src/models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Mongo auth service - registerUser", () => {
  test("should register a new user when email is not taken", async () => {
    const input = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123!",
      role: "user",
    };

    const createdUser = { _id: "user-123", ...input };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(createdUser);

    const result = await registerUser(input);

    expect(User.findOne).toHaveBeenCalledWith({
      email: input.email,
    });
    expect(User.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(createdUser);
  });

  test("should reject registration when email already exists", async () => {
    User.findOne.mockResolvedValue({
      email: "test@example.com",
    });

    await expect(
      registerUser({
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        role: "user",
      }),
    ).rejects.toMatchObject({
      message: "User already exists",
      statusCode: 409,
    });

    expect(User.create).not.toHaveBeenCalled();
  });
});

describe("Mongo auth service - loginUser", () => {
  test("should log in with valid credentials", async () => {
    const user = {
      _id: "user-123",
      email: "test@example.com",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const result = await loginUser({
      email: "test@example.com",
      password: "Password123!",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(user.comparePassword).toHaveBeenCalledWith("Password123!");
    expect(result).toEqual(user);
  });

  test("should reject login when user does not exist", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(
      loginUser({
        email: "missing@example.com",
        password: "Password123!",
      }),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      statusCode: 401,
    });
  });

  test("should reject login when password is incorrect", async () => {
    const user = {
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    await expect(
      loginUser({
        email: "test@example.com",
        password: "WrongPassword!",
      }),
    ).rejects.toMatchObject({
      message: "Invalid email or password",
      statusCode: 401,
    });

    expect(user.comparePassword).toHaveBeenCalledWith("WrongPassword!");
  });
});
