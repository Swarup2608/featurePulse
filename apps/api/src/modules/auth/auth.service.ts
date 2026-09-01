import mongoose from "mongoose";

import { User } from "../users/user.model";
import { Organization } from "../organizations/organization.model";
import { Membership } from "../memberships/membership.model";
import { RegisterInput } from "./auth.validation";
import { generateSlug } from "../../utils/slug";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

export const registerUser = async(input : RegisterInput) => {
    const existingUser = await User.findOne({
        email: input.email
    });

    if(existingUser){
        throw new Error(" A user with the email already exists! ");
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
}