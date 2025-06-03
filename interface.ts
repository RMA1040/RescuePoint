import { ObjectId } from "mongodb";

export interface Client{
    name:string;
    licensePlate: string;
    latitude?: string;
    longitude?: string;
    time: Date;
};

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;
    role: "ADMIN" | "USER";
}