
using Microsoft.AspNetCore.Mvc;
using ProjetoCORE.Services;

namespace ProjetoCORE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NumberController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetDivisors([FromQuery] int number)
        {
            var divisors = NumberService.GetDivisors(number);
            var primeDivisors = NumberService.GetPrimeDivisors(number);

            return Ok(new
            {
                Number = number,
                Divisors = divisors,
                PrimeDivisors = primeDivisors
            });
        }
    }
}
