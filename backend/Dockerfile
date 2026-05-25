# Backend Dockerfile — .NET 8 API (Production)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
WORKDIR /app
EXPOSE 5000
RUN addgroup -S appilico && adduser -S appilico -G appilico

FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY ["src/Appilico.Market.Api/Appilico.Market.Api.csproj", "src/Appilico.Market.Api/"]
COPY ["src/Appilico.Market.Application/Appilico.Market.Application.csproj", "src/Appilico.Market.Application/"]
COPY ["src/Appilico.Market.Infrastructure/Appilico.Market.Infrastructure.csproj", "src/Appilico.Market.Infrastructure/"]
COPY ["src/Appilico.Market.Domain/Appilico.Market.Domain.csproj", "src/Appilico.Market.Domain/"]
RUN dotnet restore "src/Appilico.Market.Api/Appilico.Market.Api.csproj"
COPY . .
WORKDIR "/src/src/Appilico.Market.Api"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /var/log/appilico && chown -R appilico:appilico /var/log/appilico /app
USER appilico
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
HEALTHCHECK --interval=30s --timeout=10s --start-period=300s --retries=5 CMD wget -qO- http://localhost:5000/health || exit 1
ENTRYPOINT ["dotnet", "Appilico.Market.Api.dll"]
