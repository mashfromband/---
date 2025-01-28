import bcrypt from "bcrypt";

export class MailAuthPasswordHash {
    public static async create(password: string, round: number = 10) {
        const hashedPassword = await bcrypt.hash(password, round);
        return hashedPassword;
    }

    public static async compare(password: string, hashedPassword: string) {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    }
}
