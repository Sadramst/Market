namespace Appilico.Market.Domain.Common;

/// <summary>
/// Standard API response wrapper.
/// Preserved pattern from existing appilico-server.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public PaginationMeta? Pagination { get; set; }
    public List<string> Errors { get; set; } = [];
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ApiResponse<T> Ok(T data, string message = "Success") => new()
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static ApiResponse<T> Ok(T data, PaginationMeta pagination, string message = "Success") => new()
    {
        Success = true,
        Message = message,
        Data = data,
        Pagination = pagination
    };

    public static ApiResponse<T> Fail(string message, List<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors ?? []
    };
}

public class PaginationMeta
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasPrevious => CurrentPage > 1;
    public bool HasNext => CurrentPage < TotalPages;

    public PaginationMeta() { }

    public PaginationMeta(int currentPage, int pageSize, int totalCount)
    {
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
    }
}

public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = [];
    public PaginationMeta Pagination { get; set; } = new();
}
