import bcrypt from "bcrypt";

export async function hashString(plainText: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainText, saltRounds);
}
