using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using intuitive.Controllers.Resources;
using intuitive.Models;
using intuitive.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace intuitive.Controllers
{
    public class MeasuresController : Controller
    {
        private readonly IntuitiveDbContext context;
        private readonly IMapper mapper;
        public MeasuresController(IntuitiveDbContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;

        }
        [HttpGet("/api/measures")]
        public async Task<IEnumerable<MeasureResource>> GetMeasures()
        {
            var measures = await context.Measures.ToListAsync();
            return mapper.Map<List<Measure>, List<MeasureResource>>(measures);
        }

        [HttpPut("/api/measures/{id}")]
        public IActionResult UpdateMeasures(int id, [FromBody] MeasureResource measure)
        {
            return Ok(measure); //error: tunnelling socket could not be established, cause=socket hang up
        }

    }
}