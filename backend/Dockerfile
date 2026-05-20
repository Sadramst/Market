# Backend Dockerfile — .NET 8 API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/Appilico.Market.Api/Appilico.Market.Api.csproj", "src/Appilico.Market.Api/"]
COPY ["src/Appilico.Market.Application/Appilico.Market.Application.csproj", "src/Appilico.Market.Application/"]
COPY ["src/Appilico.Market.Infrastructure/Appilico.Market.Infrastructure.csproj", "src/Appilico.Market.Infrastructure/"]
COPY ["src/Appilico.Market.Domain/Appilico.Market.Domain.csproj", "src/Appilico.Market.Domain/"]
RUN dotnet restore "src/Appilico.Market.Api/Appilico.Market.Api.csproj"
COPY . .
WORKDIR "/src/src/Appilico.Market.Api"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "Appilico.Market.Api.dll"]
