# Glimt mobilapp

Glimt är en mobil fotodagbok där användaren kan skapa och redigera minnen
med titel, datum, beskrivning och valfri bild.

Mobilappen är byggd med React Native och Expo. Den använder samma ASP.NET Core
Web API och SQLite-databas som webbappen.

## Förutsättningar

Du behöver ha följande installerat:

- Node.js
- npm
- Expo Go på mobilen
- .NET 10 SDK för API:t

Mobilen och datorn behöver vara anslutna till samma nätverk. Stäng gärna av
VPN under testet eftersom det kan göra att mobilen inte hittar datorns lokala
IP adress.

## Klona repot

Öppna en terminal och gå till den mapp där projektet ska ligga. Klona sedan
mobilrepot:

```bash
git clone https://github.com/danielaldemir79/glimt-mobile.git
cd glimt-mobile
```

## Installera mobilappen

Stå i mobilrepots rotmapp och kör:

```bash
npm install
```

Det hämtar de paket som projektet behöver. Vänta tills kommandot är färdigt
innan du går vidare.

## Ställ in API-adressen

Mobilen kan inte använda `localhost` för att nå ett API som kör på datorn.
På mobilen betyder `localhost` mobilen själv. Därför ska mobilappen använda
datorns lokala IPv4-adress.

1. Öppna PowerShell på datorn.
2. Kör:

	```powershell
	ipconfig
	```

3. Leta efter `IPv4 Address` under det nätverkskort som datorn faktiskt
	använder för samma nätverk som mobilen. Använd inte en frånkopplad adapter,
	VPN-adapter eller virtuell adapter.
4. Skapa en fil som heter `.env.local` i mobilrepots rotmapp.
5. Skriv följande rad i filen och byt ut IP-adressen:

	```text
	EXPO_PUBLIC_API_URL=http://DIN-IP-ADRESS:5097
	```

	Exempel:

	```text
	EXPO_PUBLIC_API_URL=http://192.168.50.250:5097
	```

Filen `.env.local` är lokal för den egna datorn och ska inte committas.
Filen `.env.example` visar vilket format som ska användas.

Om datorns lokala IP adress ändras behöver värdet i `.env.local` ändras också.
Starta sedan om Expo så att den nya miljövariabeln läses in.

## Starta API:t

API:t finns i det separata repot `glimt-api`. Klona det bredvid mobilrepot om
det inte redan finns på datorn:

```bash
git clone https://github.com/danielaldemir79/glimt-api.git
```

Öppna en ny terminal i API-repots rotmapp och kör först:

```bash
dotnet restore
dotnet ef database update
```

Om `dotnet ef` saknas, installera verktyget en gång:

```bash
dotnet tool install --global dotnet-ef --version 10.0.12
```

Flaggan `--global` gör att `dotnet-ef` installeras som ett kommando som kan
användas från valfri terminalmapp. Verktyget behöver bara installeras en gång
på datorn.

Starta därefter API:t på HTTP-port `5097`:

```bash
dotnet run --no-launch-profile --urls http://0.0.0.0:5097
```

Låt terminalen vara öppen. API:t är startat när terminalen visar ungefär:

```text
Now listening on: http://0.0.0.0:5097
Application started
```

Det är viktigt att API terminalen fortsätter köra medan mobilappen testas.

## Starta mobilappen

Öppna en andra terminal i mobilrepots rotmapp och kör:

```bash
npx expo start --tunnel
```

När Expo visar en QR-kod:

1. Öppna Expo Go på mobilen.
2. Skanna QR-koden.
3. Vänta tills appen har startat.
4. Kontrollera att listan med minnen visas.

Om appen visar att minnen inte kunde hämtas ska du kontrollera att API:t
fortfarande kör, att IP-adressen i `.env.local` är rätt och att mobilen och
datorn har nätverksanslutning. Ändra `.env.local` och starta om Expo om IP:t
har ändrats.

## Funktioner

Mobilappen kan:

- hämta minnen från API:t
- skapa ett nytt minne
- skapa ett minne utan bild
- välja och ladda upp JPG, JPEG, PNG eller WEBP
- visa uppladdade bilder
- redigera titel, datum och beskrivning
- begränsa titeln till 45 tecken och visa en teckenräknare
- behålla en befintlig bild vid redigering
- ersätta en befintlig bild med en ny bild
- uppdatera rätt minneskort direkt efter PUT
- sortera minnen från nyast till äldst
- visa ett tomläge när listan saknar minnen
- visa korta förhandsvisningar av titel och beskrivning i listan
- öppna en detaljvy med hela bilden, titeln och beskrivningen
- visa begripliga felmeddelanden när ett anrop misslyckas


## Bilder

Mobilappen skickar bilder till API:t med `multipart/form-data`. API:t tillåter
JPG, JPEG, PNG och WEBP upp till 5 MB. API:t sparar bilden i
`wwwroot/uploads` och sparar bildens publika sökväg tillsammans med minnet.

Bildkontrollen använder filändelse och filstorlek. En större applikation skulle
även kunna kontrollera filens verkliga innehåll innan den sparas.

## Tekniska val

### React Native och Expo

React Native används för gränssnittet eftersom projektet ska ha en mobil
version utan att vi behöver skriva en separat Android- och iOS-applikation.
Expo valdes eftersom det förenklar utveckling och testning under kursprojektet.
Med Expo Go kan vi testa appen på en fysisk mobil utan att först bygga en färdig
installationsfil.

### Komponentindelning

`App.jsx` håller ihop appens state och de viktigaste flödena. Komponenterna i
`src/components` har mindre och tydligare ansvarsområden:

- `MemoryForm.jsx` visar formuläret och sparar nya eller redigerade minnen.
- `MemoryList.jsx` visar listan och hanterar tomläget.
- `MemoryCard.jsx` visar ett enskilt minne och knappen för redigering.

Den här indelningen gör koden lättare att läsa och ändra. Formuläret behöver
inte känna till hur hela listan lagras, utan meddelar `App.jsx` när sparningen
är klar.

### API-lager och miljövariabel

API-anropen ligger samlade i `src/api/memoryApi.js`. Där finns funktionerna för
GET, POST, PUT och bilduppladdning. På så sätt behöver URL:er och HTTP-anrop
inte upprepas i flera komponenter.

API-adressen läses från `EXPO_PUBLIC_API_URL`. Vi valde en miljövariabel
eftersom `localhost` betyder olika saker på datorn och mobilen. Mobilen måste
använda datorns lokala IP-adress, medan porten och resten av API-adressen är
samma.

`.env.local` används för den lokala datorns IP-adress och ska inte checkas in.
`.env.example` visar formatet utan att innehålla en personlig nätverksadress.

### HTTP och datakommunikation

Minnen skickas som JSON eftersom titel, datum, beskrivning och bildens sökväg är
vanliga textvärden. Bilder skickas separat med `FormData`, eftersom en bild är
en fil och inte vanlig JSON-text.

Appen använder följande HTTP-metoder:

- GET hämtar alla minnen när appen startar.
- POST skapar ett nytt minne.
- PUT uppdaterar ett befintligt minne.
- POST till `/api/Images` laddar upp en bild innan minnet sparas.

När API:t har svarat uppdateras appens state direkt. Därför behöver användaren
inte starta om appen efter att ett minne har skapats eller redigerats.

### State och uppdatering av listan

React `useState` används för minnen, formulärets öppna eller stängda läge,
redigeringsläget, laddningsstatus och felmeddelanden.

När ett nytt minne sparas läggs API-svaret till i listan. När ett befintligt
minne redigeras ersätts bara minnet med samma id. Det förhindrar dubbletter och
gör att användaren ser resultatet direkt.

Listan sorteras från nyast till äldst genom minnets datum. Vi använder API-svaret
som källa efter sparningen i stället för att själva gissa vilket id eller vilken
bildsökväg posten fick.

### Formulär och validering

Formuläret använder React state för titel, datum, beskrivning och vald bild.
Datum väljs med `@react-native-community/datetimepicker`. Det ger en kontroll
som passar mobilens sätt att välja datum och minskar risken för fel format.

Titel, datum och beskrivning måste fyllas i innan ett minne sparas. Bilden är
frivillig när ett nytt minne skapas. Vid redigering behålls den gamla bilden om
användaren inte väljer en ny.

Spara-knappen är avstängd medan anropet pågår. Det minskar risken att samma
minne skickas flera gånger om användaren trycker snabbt flera gånger.

### Bilduppladdning

`expo-image-picker` används för att välja bilder från mobilen. Den valda bilden
skickas först till API:t med `multipart/form-data`. API:t kontrollerar att filen
har en tillåten filändelse och att den är högst 5 MB. Tillåtna format är JPG,
JPEG, PNG och WEBP.

API:t sparar själva filen i `wwwroot/uploads` med ett unikt filnamn. Mobilen
sparar inte bilden lokalt som projektdata, utan använder den publika sökväg som
API:t returnerar.

Den här lösningen håller mobilkoden enkel och gör att webb och mobil kan visa
samma bilder från samma API.

### Layout och användarupplevelse

`SafeAreaView` används så att innehållet inte hamnar bakom mobilens statusfält
eller andra skärmkanter. `ScrollView` används eftersom formuläret och listan
kan bli längre än mobilens skärm.

Innehållet har en maxbredd på 600 pixlar och centreras på bredare skärmar.
På vanliga mobiler använder appen den tillgängliga bredden. Det gör att
formulär och minneskort inte blir onödigt breda på foldable-telefoner,
surfplattor och större webbläsarfönster.

När användaren trycker på `Redigera` öppnas formuläret med det valda minnets
värden. Appen scrollar till formulärets början så att det märks att redigering
har startat.

Minneskorten visar bara en kort förhandsvisning av titel och beskrivning. När
användaren trycker på `Visa hela minnet` öppnas en detaljvy med React Native
`Modal`. Där visas hela bilden utan beskärning och hela texten kan läsas i en
egen `ScrollView`.

Vi använder en större `Pressable` för `Nytt minne`, eftersom det är appens
viktigaste huvudåtgärd. Knapparna på minneskorten är enklare, och har luft
mellan sig så att de inte upplevs som en enda tryckyta. Tydliga felmeddelanden
och stora tryckytor gör appen lättare att använda på små skärmar.

### Felhantering

API-funktionerna kontrollerar HTTP-svaret. Om ett anrop misslyckas kastas ett
fel som visas i formuläret eller i listans laddningsläge. Appen kraschar därför
inte bara för att API:t är avstängt eller att ett anrop misslyckas.

### Utvecklingsmiljö och tunnel

`npx expo start --tunnel` används under testning för att Expo Go ska kunna hämta
utvecklingsversionen av appen även när den vanliga lokala anslutningen inte
fungerar. Tunneln gäller Expo-utvecklingsservern. Själva API-anropet går
fortfarande till datorns lokala IP-adress i `.env.local`.

Vi använder HTTP till API:t i mobilens lokala utvecklingsmiljö eftersom det gör
anslutningen från Expo Go enkel. I en publicerad applikation skulle API:t i
stället köras bakom HTTPS och en riktig serveradress.

## Begränsningar och förbättringsförslag

Följande delar är medvetet inte byggda ännu:

- ta bort minnen med React Native `Alert`
- dra ned för att uppdatera listan
- automatisk synkning mellan webbappen och mobilappen
- automatisk scroll till ett äldre minne efter redigering
- kontroll av bildens verkliga filinnehåll
- automatiserade tester

Webbappen och mobilappen använder samma API och samma databas, men de skickar
inte automatiska händelser till varandra medan båda är öppna. En framtida
version skulle kunna använda pull-to-refresh, periodisk hämtning eller SignalR
för att visa ändringar automatiskt.

Vi har valt att hålla mobilappen enkel så att den är lätt att starta, testa
och förklara. Förbättringarna kan byggas vidare på utan att den nuvarande
grundstrukturen behöver göras om.