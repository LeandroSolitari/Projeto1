
using System;
using System.Collections.Generic;

namespace ProjetoCORE.Services
{
    public static class NumberService
    {
        public static List<int> GetDivisors(int number)
        {
            var divisors = new List<int>();
            for (int i = 1; i <= number; i++)
            {
                if (number % i == 0)
                {
                    divisors.Add(i);
                }
            }
            return divisors;
        }

        public static List<int> GetPrimeDivisors(int number)
        {
            var primeDivisors = new List<int>();
            var divisors = GetDivisors(number);

            foreach (var divisor in divisors)
            {
                if (IsPrime(divisor))
                {
                    primeDivisors.Add(divisor);
                }
            }
            return primeDivisors;
        }

        private static bool IsPrime(int number)
        {
            if (number <= 1) return false;
            if (number == 2) return true;
            if (number % 2 == 0) return false;

            var boundary = (int)Math.Floor(Math.Sqrt(number));

            for (int i = 3; i <= boundary; i += 2)
            {
                if (number % i == 0)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
