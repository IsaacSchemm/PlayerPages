using PlayerPages.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PlayerPages.Data
{
    public class Page
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [StringLength(20)]
        public string Id { get; set; } = "";

        private static readonly Lazy<string> DefaultJson = new(() => JsonSerializer.Serialize(PagePropertiesModule.Empty));

        [JsonIgnore]
        public string PagePropertiesJson { get; set; } = DefaultJson.Value;

        [NotMapped]
        public PageProperties? PageProperties
        {
            get
            {
                return JsonSerializer.Deserialize<PageProperties>(PagePropertiesJson);
            }
            set
            {
                PagePropertiesJson = JsonSerializer.Serialize(value);
            }
        }
    }
}
