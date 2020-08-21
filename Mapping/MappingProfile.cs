using AutoMapper;
using intuitive.Controllers.Resources;
using intuitive.Models;

namespace intuitive.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Measure, MeasureResource>();
        }
    }
}