FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar todo el proyecto (estructura Visual Studio)
COPY . .

# Restaurar usando el csproj correcto
RUN dotnet restore "PsicologiaIAAPI.csproj"

# Compilar
RUN dotnet build "PsicologiaIAAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PsicologiaIAAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "PsicologiaIAAPI.dll"]