import UserModel from "../Models/user/user.model";
import UserAddress from "../Models/user/user-adress.model";
import UserContact from "../Models/user/user-contact.model";
import UserPassword from "../Models/user/user-password.model";
import { UserRole, UserRoleEnum } from "../interface/interfaces/enum";

interface RegisterPayloadI {
  email: string;
  firstName: string;
  lastName: string;
  city?: string;
  country?: string;
  street?: string;
  codeZip?: number;
  password: string;
}

interface RegisterPayloadResponseI {
  contact: {
    email: string;
    firstName: string;
    lastName: string;
  };
  address?: {
    city?: string;
    country?: string;
    street?: string;
    codeZip?: number;
  };
  password: string;
  role?: UserRole;
}

interface RegisterResult {
  success: boolean;
  user?: unknown;
  error?: string;
}

/**
 * Auth service - handles authentication related business logic
 * Aligns with the project's `User` schema which stores contact, address,
 * and password as separate documents.
 */
class AuthService {
  /**
   * Register a new user by creating contact, password and address documents
   * and then the user document referencing them.
   * @param {RegisterPayloadI} payload - registration payload
   * @return {Promise<RegisterResult>} - result of the registration
   * @public
   * @async
   * @name registerUserService
   */
  public async registerUserService(
    _payload: RegisterPayloadI,
  ): Promise<RegisterResult> {
    const payload = this.transformRegisterPayload(_payload);
    const { contact, address, password, role } = payload;

    if (!contact?.email) {
      return {
        success: false,
        error: "Contact (email) and password are required",
      };
    }

    const existing = await UserContact.findOne({ email: contact.email }).exec();
    if (existing) {
      return { success: false, error: "Email already in use" };
    }

    let contactDoc: any = null;
    let passwordDoc: any = null;
    let addressDoc: any = null;
    let userDoc: any = null;

    try {
      contactDoc = await UserContact.create(contact);
      passwordDoc = await UserPassword.create({ password });
      addressDoc = await UserAddress.create(address);

      userDoc = await UserModel.create({
        contact: contactDoc._id,
        password: passwordDoc._id,
        address: addressDoc._id,
        role,
      });

      return { success: true, user: userDoc };
    } catch (error) {
      // cleanup
      try {
        if (userDoc && userDoc._id)
          await UserModel.deleteOne({ _id: userDoc._id }).exec();
        if (passwordDoc && passwordDoc._id)
          await UserPassword.deleteOne({ _id: passwordDoc._id }).exec();
        if (contactDoc && contactDoc._id)
          await UserContact.deleteOne({ _id: contactDoc._id }).exec();
        if (addressDoc && addressDoc._id)
          await UserAddress.deleteOne({ _id: addressDoc._id }).exec();
      } catch (cleanupErr) {
        // ignore cleanup errors
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  /**
   * priver service to handle payload structure ans transformaer funtion for the register
   * @privet
   * @return {RegisterPayloadResponseI} - transformed payload
   * @param {RegisterPayloadI} payload - original payload
   */
  private transformRegisterPayload(
    _payload: RegisterPayloadI,
  ): RegisterPayloadResponseI {
    const {
      email,
      firstName,
      lastName,
      city,
      country,
      street,
      codeZip,
      password,
    } = _payload;

    const contact = {
      email,
      firstName,
      lastName,
    };

    const address: {
      city?: string;
      country?: string;
      street?: string;
      codeZip?: number;
    } = {};
    if (city) address.city = city;
    if (country) address.country = country;
    if (street) address.street = street;
    if (codeZip) address.codeZip = codeZip;

    return {
      contact,
      address: Object.keys(address).length > 0 ? address : undefined,
      password,
      role: UserRoleEnum.FARMER,
    };
  }
}

export default new AuthService();
