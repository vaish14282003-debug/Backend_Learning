const {
  createNewRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
} = require("../src/services/mongoRefreshToken.service");

const {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} = require("../src/repositories/mongoRefreshToken.repository");

jest.mock("../src/repositories/mongoRefreshToken.repository", () => ({
  createRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Mongo refresh token service", () => {
  test("should create a new refresh token", async () => {
    createRefreshToken.mockImplementation(async (data) => data);

    const result = await createNewRefreshToken("user-123");

    expect(createRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-123",
        token: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    );

    expect(result.token).toHaveLength(128);
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  test("should return a valid refresh token", async () => {
    const storedToken = {
      token: "valid-token",
      userId: "user-123",
      expiresAt: new Date(Date.now() + 60_000),
    };

    findRefreshToken.mockResolvedValue(storedToken);

    const result = await validateRefreshToken("valid-token");

    expect(result).toEqual(storedToken);
    expect(findRefreshToken).toHaveBeenCalledWith("valid-token");
    expect(deleteRefreshToken).not.toHaveBeenCalled();
  });

  test("should reject an invalid refresh token with 401", async () => {
    findRefreshToken.mockResolvedValue(null);

    await expect(validateRefreshToken("invalid-token")).rejects.toMatchObject({
      message: "Invalid refresh token",
      statusCode: 401,
    });

    expect(findRefreshToken).toHaveBeenCalledWith("invalid-token");
  });

  test("should delete an expired token and reject it with 401", async () => {
    findRefreshToken.mockResolvedValue({
      token: "expired-token",
      userId: "user-123",
      expiresAt: new Date(Date.now() - 60_000),
    });

    deleteRefreshToken.mockResolvedValue({ deletedCount: 1 });

    await expect(validateRefreshToken("expired-token")).rejects.toMatchObject({
      message: "Refresh token expired",
      statusCode: 401,
    });

    expect(deleteRefreshToken).toHaveBeenCalledWith("expired-token");
  });

  test("should revoke a refresh token", async () => {
    deleteRefreshToken.mockResolvedValue({ deletedCount: 1 });

    await revokeRefreshToken("token-to-revoke");

    expect(deleteRefreshToken).toHaveBeenCalledWith("token-to-revoke");
  });
});
