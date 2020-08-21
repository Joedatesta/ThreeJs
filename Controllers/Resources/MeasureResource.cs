using System.ComponentModel.DataAnnotations;

namespace intuitive.Controllers.Resources
{
    public class MeasureResource
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }
    }
}