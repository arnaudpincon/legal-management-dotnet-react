namespace LegalApp.GraphQL.GraphQL.Types.InputTypes
{
    public class UpdateClientInput
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
    }
}