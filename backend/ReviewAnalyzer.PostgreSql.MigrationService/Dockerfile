FROM mcr.microsoft.com/dotnet/runtime:10.0 AS base
USER $APP_UID
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ReviewAnalyzer.PostgreSql.MigrationService/ReviewAnalyzer.PostgreSql.MigrationService.csproj", "ReviewAnalyzer.PostgreSql.MigrationService/"]
COPY ["ReviewAnalyzer.PostgreSql/ReviewAnalyzer.PostgreSql.csproj", "ReviewAnalyzer.PostgreSql/"]
COPY ["ReviewAnalyzer.Core/ReviewAnalyzer.Core.csproj", "ReviewAnalyzer.Core/"]
RUN dotnet restore "ReviewAnalyzer.PostgreSql.MigrationService/ReviewAnalyzer.PostgreSql.MigrationService.csproj"
COPY . .
WORKDIR "/src/ReviewAnalyzer.PostgreSql.MigrationService"
RUN dotnet build "./ReviewAnalyzer.PostgreSql.MigrationService.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ReviewAnalyzer.PostgreSql.MigrationService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReviewAnalyzer.PostgreSql.MigrationService.dll"]
