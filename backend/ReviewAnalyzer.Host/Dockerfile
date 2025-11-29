FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

USER root
RUN apt-get update && \
    apt-get install -y libkrb5-3 && \
    rm -rf /var/lib/apt/lists/*

ARG APP_UID=1000
USER ${APP_UID}

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ReviewAnalyzer.Host/ReviewAnalyzer.Host.csproj", "ReviewAnalyzer.Host/"]
COPY ["ReviewAnalyzer.Application/ReviewAnalyzer.Application.csproj", "ReviewAnalyzer.Application/"]
COPY ["ReviewAnalyzer.PostgreSql/ReviewAnalyzer.PostgreSql.csproj", "ReviewAnalyzer.PostgreSql/"]
COPY ["ReviewAnalyzer.Core/ReviewAnalyzer.Core.csproj", "ReviewAnalyzer.Core/"]
RUN dotnet restore "ReviewAnalyzer.Host/ReviewAnalyzer.Host.csproj"
COPY . .
WORKDIR "/src/ReviewAnalyzer.Host"
RUN dotnet build "./ReviewAnalyzer.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ReviewAnalyzer.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReviewAnalyzer.Host.dll"]
