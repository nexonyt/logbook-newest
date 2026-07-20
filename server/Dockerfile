# Używamy Node.js jako bazy
FROM node:22-alpine

# Ustalamy katalog roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy pliki zależności
COPY package*.json ./

# Instalujemy paczki (tutaj legacy-peer-deps, bo widzę, że masz starsze zależności)
RUN npm install --legacy-peer-deps

# Kopiujemy całą resztę kodu serwera
COPY . .

# Otwieramy port, na którym nasłuchuje Twój backend (w docker-compose masz 4040)
EXPOSE 4040

# Uruchamiamy serwer
CMD ["node", "logbook-index.js"]