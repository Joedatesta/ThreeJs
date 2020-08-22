using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace intuitive.Models
{
    [Table("Measures")]
    public class Measure
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(255)]
        public string Value { get; set; }
    }
}