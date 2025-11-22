/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [ADMIN, FARMER, GUEST]
 */
export type UserRole = keyof typeof UserRoleEnum;

export enum UserRoleEnum {
  ADMIN = "ADMIN",
  FARMER = "FARMER",
  GUEST = "GUEST",
}
