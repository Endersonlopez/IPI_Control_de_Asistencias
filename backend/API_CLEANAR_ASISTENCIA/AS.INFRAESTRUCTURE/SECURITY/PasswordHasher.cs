using System;
using System.Text;
using BCrypt.Net;

namespace AS.INFRAESTRUCTURE.SECURITY
{
    public static class PasswordHasher
    {
        // Hash password using bcrypt and return UTF8 bytes of the bcrypt string.
        public static byte[] HashPassword(string password, int workFactor = 12)
        {
            if (password == null) throw new ArgumentNullException(nameof(password));
            var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor);
            return Encoding.UTF8.GetBytes(hash);
        }

        // Verify password against stored bcrypt bytes (stored contains UTF8 of bcrypt string)
        public static bool VerifyPassword(string password, byte[] stored)
        {
            if (password == null) return false;
            if (stored == null || stored.Length == 0) return false;
            var storedHash = Encoding.UTF8.GetString(stored);
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
    }
}
