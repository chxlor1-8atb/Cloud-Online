import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { google } from 'googleapis';

// Simple in-memory user store - in production, use a database
const users = [
    {
        id: '1',
        username: 'admin',
        // Password: "admin123" - Change this!
        passwordHash: '$2b$10$hblf3CXKI.rynyt9PRdkEe8kynjn3f6VyDgHhhdT0/heCHaQiVweS',
        name: 'Administrator',
        role: 'admin',
    },
];

// Store for Google tokens (in production, use a database)
let storedGoogleToken: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
} | null = null;

// Function to refresh Google access token
async function refreshGoogleToken(refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        const data = await response.json();
        if (data.access_token) {
            storedGoogleToken = {
                accessToken: data.access_token,
                refreshToken: refreshToken,
                expiresAt: Date.now() + (data.expires_in * 1000),
            };
            return data.access_token;
        }
        return null;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
    }
}

// Get valid Google access token
export async function getGoogleAccessToken(): Promise<string | null> {
    // 1. Check if we have a stored token from env (for credential login)
    const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (storedGoogleToken) {
        // Check if token is still valid (with 5 min buffer)
        if (storedGoogleToken.expiresAt > Date.now() + 300000) {
            return storedGoogleToken.accessToken;
        }
        // Token expired, refresh it
        return await refreshGoogleToken(storedGoogleToken.refreshToken);
    }

    if (envRefreshToken) {
        return await refreshGoogleToken(envRefreshToken);
    }

    // 2. Try Service Account if available
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
        try {
            const auth = new google.auth.JWT({
                email: clientEmail,
                key: privateKey.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
            });
            const token = await auth.getAccessToken();
            return token.token || null;
        } catch (error) {
            console.error('Service Account Auth Error:', error);
        }
    }

    return null;
}

// Store Google token after OAuth login
export function storeGoogleToken(accessToken: string, refreshToken: string, expiresIn: number) {
    storedGoogleToken = {
        accessToken,
        refreshToken,
        expiresAt: Date.now() + (expiresIn * 1000),
    };
    console.log('Google token stored! Refresh token:', refreshToken);
    console.log('Add this to your .env.local: GOOGLE_REFRESH_TOKEN=' + refreshToken);
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        }),
        CredentialsProvider({
            name: 'ชื่อผู้ใช้',
            credentials: {
                username: { label: 'ชื่อผู้ใช้', type: 'text' },
                password: { label: 'รหัสผ่าน', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = users.find(u => u.username === credentials.username);
                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            // OAuth login - store Google tokens
            if (account?.provider === 'google') {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.provider = 'google';

                // Store for credential users to use
                if (account.access_token && account.refresh_token) {
                    storeGoogleToken(
                        account.access_token,
                        account.refresh_token,
                        account.expires_at ? account.expires_at - Math.floor(Date.now() / 1000) : 3600
                    );
                }
            }

            // Credentials login
            if (account?.provider === 'credentials') {
                token.provider = 'credentials';
                token.role = (user as any)?.role;
            }

            return token;
        },
        async session({ session, token }) {
            (session as any).provider = token.provider;
            (session as any).role = token.role;

            if (token.provider === 'google') {
                (session as any).accessToken = token.accessToken;
            } else if (token.provider === 'credentials') {
                // For credential users, get the stored Google token
                const accessToken = await getGoogleAccessToken();
                (session as any).accessToken = accessToken;
            }

            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
