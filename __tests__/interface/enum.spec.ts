import { UserRoleEnum } from "../../src/interface/interfaces/enum";

describe("UserRoleEnum", () => {
  it("should expose the expected role values", () => {
    expect(UserRoleEnum.ADMIN).toBe("ADMIN");
    expect(UserRoleEnum.FARMER).toBe("FARMER");
    expect(UserRoleEnum.GUEST).toBe("GUEST");

    const keys = Object.keys(UserRoleEnum);
    expect(keys).toEqual(expect.arrayContaining(["ADMIN", "FARMER", "GUEST"]));
  });
});
