import mongoose from "mongoose";

import { User } from "../users/user.model";
import { Organization } from "../organizations/organization.model";
import { Membership } from "../memberships/membership.model";
import { LoginInput, RegisterInput } from "./auth.validation";
import { generateSlug } from "../../utils/slug";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token";
import { AppError } from "../../utils/AppError";
import { redis } from "../../config/redis";

// Account-level brute-force defense, layered on top of the per-IP rate limiter.
// Keyed by email, so a determined attacker can briefly lock a known account —
// an accepted trade-off for slowing distributed credential-stuffing.
const LOGIN_LOCKOUT_THRESHOLD = 10;
const LOGIN_LOCKOUT_WINDOW_SECONDS = 15 * 60;

const loginAttemptKey = (email: string) => `lockout:login:${email}`;

const assertNotLockedOut = async (email: string): Promise<void> => {
    if (!redis) return;
    const attempts = await redis.get<number>(loginAttemptKey(email));
    if (attempts && attempts >= LOGIN_LOCKOUT_THRESHOLD) {
        throw new AppError("Account temporarily locked due to too many failed login attempts. Try again later.", 429);
    }
};

const recordFailedLogin = async (email: string): Promise<void> => {
    if (!redis) return;
    const key = loginAttemptKey(email);
    const attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, LOGIN_LOCKOUT_WINDOW_SECONDS);
};

const clearFailedLogins = async (email: string): Promise<void> => {
    if (!redis) return;
    await redis.del(loginAttemptKey(email));
};

export const registerUser = async(input : RegisterInput) => {
    const existingUser = await User.findOne({
        email: input.email
    });

    if(existingUser){
        throw new AppError("A user with this email already exists!", 409);
    }
    const session = await mongoose.startSession();

    try{
        session.startTransaction();
        const [user] = await User.create([{
            name: input.name,
            email: input.email.toLowerCase(),
            password: input.password
        }],{
            session: session
        });

        const baseSlug = generateSlug(input.organizationName);
        const organizationSlug = `${baseSlug}-${Date.now()}`;
        const [organization] = await Organization.create([{
            name: input.organizationName,
            slug: organizationSlug,
            ownerId: user._id
        }],{
            session:  session
        });

        await Membership.create([{
            userId: user._id,
            organizationId: organization._id,
            role: "OWNER"
        }],{
            session: session
        });

        await session.commitTransaction();
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);


       return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },

            organization: {
                id: organization._id.toString(),
                name: organization.name,
                slug: organization.slug,
                createdAt: organization.createdAt,
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
    catch(error){
        await session.abortTransaction();
        throw error;
    }
    finally{
        session.endSession();
    }
};

export const loginUser = async(input : LoginInput) => {
    const email = input.email.toLowerCase();
    await assertNotLockedOut(email);

    const user = await User.findOne({ email }).select("+password");
    if(!user){
        await recordFailedLogin(email);
        throw new AppError("Invalid email or password!", 401);
    }
    const isPasswordValid = await user.comparePassword(input.password);
    if(!isPasswordValid){
        await recordFailedLogin(email);
        throw new AppError("Invalid email or password!", 401);
    }
    await clearFailedLogins(email);
    const membership = await Membership.findOne({ userId: user._id });
    if(!membership){
        throw new AppError("No Organization membership found for this user!", 404);
    }
    const organization = await Organization.findById(membership.organizationId);
    if (!organization) { throw new AppError("Organization not found!", 404); }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    return {
        user: { id: user._id.toString(), name: user.name, email: user.email },
        organization: { id: organization._id.toString(), name: organization.name, slug: organization.slug },
        tokens: { accessToken, refreshToken },
    };
};

export const getCurrentUser = async(userId: string) =>       {
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("User not found!", 404);
    }
    const membership = await Membership.findOne({ userId: user._id }).populate("organizationId");
    if (!membership) {
        throw new AppError( "Organization membership not found!", 404 );
    }
    const organization = await Organization.findById( membership.organizationId );
    if (!organization) {
        throw new AppError( "Organization not found!", 404 );
    }
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        },

        organization: {
            id: organization._id.toString(),
            name: organization.name,
            slug: organization.slug,
        },
    };
}

export const refreshAccessToken = async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);

    if(!user){
        throw new AppError("User no longer exists!", 401);
    }
    const accessToken = generateAccessToken(user._id);

    return {accessToken};
}
