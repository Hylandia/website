import { field, getModel, index, model } from "@/lib/db/odm";
import mongoose from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  preferences?: {
    notifications?: boolean;
    theme?: "light" | "dark" | "system";
  };
  stats?: {
    gamesPlayed?: number;
    wins?: number;
    losses?: number;
    level?: number;
    xp?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

@model("user", { timestamps: true })
export class User implements IUser {
  _id?: mongoose.Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;

  @field({ required: true, unique: true, trim: true })
  @index()
  clerkId!: string;

  @field({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @field({ trim: true, sparse: true })
  username?: string;

  @field({ trim: true })
  firstName?: string;

  @field({ trim: true })
  lastName?: string;

  @field()
  avatar?: string;

  @field({ trim: true, default: "player" })
  role?: string;

  @field({ type: [String], default: [] })
  permissions?: string[];

  @field({
    type: Object,
    default: () => ({
      notifications: true,
      theme: "system",
    }),
  })
  preferences?: {
    notifications?: boolean;
    theme?: "light" | "dark" | "system";
  };

  @field({
    type: Object,
    default: () => ({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      level: 1,
      xp: 0,
    }),
  })
  stats?: {
    gamesPlayed?: number;
    wins?: number;
    losses?: number;
    level?: number;
    xp?: number;
  };
}

export const UserModel = getModel(User);

export class UserQueries {
  static async findByClerkId(clerkId: string) {
    return UserModel.findOne({ clerkId }).exec();
  }

  static async findById(id: string) {
    return UserModel.findById(id).exec();
  }

  static async findOrCreateFromClerk(clerkUser: {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    username?: string | null;
    publicMetadata?: {
      role?: string;
      permissions?: string[];
    };
  }) {
    let user = await UserQueries.findByClerkId(clerkUser.id);

    if (!user) {
      user = new UserModel({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        avatar: clerkUser.imageUrl || undefined,
        username: clerkUser.username || undefined,
        role: clerkUser.publicMetadata?.role || "player",
        permissions: clerkUser.publicMetadata?.permissions || [],
      });
      await user.save();
    } else {
      const clerkRole = clerkUser.publicMetadata?.role || "player";
      const clerkPermissions = clerkUser.publicMetadata?.permissions || [];

      if (
        user.role !== clerkRole ||
        JSON.stringify(user.permissions) !== JSON.stringify(clerkPermissions)
      ) {
        user.role = clerkRole;
        user.permissions = clerkPermissions;
        await user.save();
      }
    }

    return user;
  }
}

export class UserMutations {
  static async updateUser(
    clerkId: string,
    updates: Partial<Pick<IUser, "username" | "avatar" | "preferences">>
  ) {
    const user = await UserModel.findOneAndUpdate(
      { clerkId },
      { ...updates },
      { new: true }
    ).exec();

    return user;
  }

  static async updateStats(clerkId: string, stats: Partial<IUser["stats"]>) {
    const user = await UserModel.findOne({ clerkId }).exec();
    if (!user) throw new Error("User not found");

    user.stats = { ...user.stats, ...stats };
    await user.save();

    return user;
  }
}
