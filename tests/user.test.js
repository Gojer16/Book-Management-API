const User = require("../models/User");

describe("User Model", () => {
  it("should fail if email is invalid", 
    async () => {
    const user = new User({ email: "bademail", password: "password123" });
    let error;
    try {
      await user.save();
    } 
    catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it("should hash password before saving", 
    async () => {
    const user = new User({ email: "test@example.com", password: "password123" });
    await user.save();

    const savedUser = await User.findOne({ email: "test@example.com" }).select("+password");
    expect(savedUser.password).not.toBe("password123"); 
    expect(savedUser.password.length).toBeGreaterThan(20);
  });

  it("should compare password correctly", 
    async () => {
    const user = new User({ email: "john@example.com", password: "supersecret" });
    await user.save();

    const savedUser = await User.findOne({ email: "john@example.com" }).select("+password");
    const isMatch = await savedUser.comparePassword("supersecret");
    expect(isMatch).toBe(true);

    const wrongMatch = await savedUser.comparePassword("wrongpass");
    expect(wrongMatch).toBe(false);
  });

  it("should require a password with at least 8 chars", 
    async () => {
    const user = new User({ email: "short@example.com", password: "short" });
    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });
  it("should not allow duplicate emails", async () => {
    const user1 = new User({ email: "unique@example.com", password: "password123" });
    await user1.save();
    const user2 = new User({ email: "unique@example.com", password: "password456" });
    let error;
    try {
      await user2.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); 
  });

  it("should lowercase the email before saving", async () => {
    const user = new User({ email: "Test@Example.COM", password: "password123" });
    await user.save();
    const savedUser = await User.findOne({ email: "test@example.com" });
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe("test@example.com");
  });

  it("should trim the email before saving", async () => {
    const user = new User({ email: "   spaced@example.com   ", password: "password123" });
    await user.save();
    const savedUser = await User.findOne({ email: "spaced@example.com" });
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe("spaced@example.com");
  });

  it("should not return password by default when querying", async () => {
    const user = new User({ email: "nopass@example.com", password: "password123" });
    await user.save();
    const found = await User.findOne({ email: "nopass@example.com" });
    expect(found.password).toBeUndefined();
  });
});
