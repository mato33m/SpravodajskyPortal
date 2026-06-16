CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    role VARCHAR(255),
    bio TEXT,
    date_joined TIMESTAMP DEFAULT NOW(),
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    banned BOOLEAN DEFAULT FALSE
);

CREATE TABLE topic (
    topic_name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE tag (
    tag_name VARCHAR(255) PRIMARY KEY
);

CREATE TABLE article (
    article_id SERIAL PRIMARY KEY,
    writer_id INT,
    topic_name TEXT,
    tags_id INT,
    release_date TIMESTAMP DEFAULT NOW(),
    content TEXT,
    status VARCHAR(255),
    title VARCHAR(255),
    image_url TEXT,

    CONSTRAINT fk_article_topic
        FOREIGN KEY (topic_name)
        REFERENCES topic(topic_name),

    CONSTRAINT fk_article_user
        FOREIGN KEY (writer_id)
        REFERENCES users(user_id)
);

CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    author_id INT,
    article_id INT,
    content TEXT,
    rating INT,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (author_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_article
        FOREIGN KEY (article_id)
        REFERENCES article(article_id)
        ON DELETE CASCADE
);

CREATE TABLE articletags (
    article_id INT,
    tag_name VARCHAR(255),

    PRIMARY KEY (article_id, tag_name),

    CONSTRAINT fk_articletags_article
        FOREIGN KEY (article_id)
        REFERENCES article(article_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_articletags_tag
        FOREIGN KEY (tag_name)
        REFERENCES tag(tag_name)
        ON DELETE CASCADE
);

INSERT INTO users (
    username,
    firstname,
    lastname,
    role,
    bio,
    password_hash,
    email,
    banned
)
VALUES
    (
        'historyhub',
        'Michael',
        'Turner',
        'ADMIN',
        'Administrátor zameraný na historické publikácie.',
        '$2a$10$ZBHDLd6VF5Q3EEqqTZYBAOBVuYO.f2bQnAonBqeWRKIqSsez6//EG',
        'michael.turner@example.com',
        FALSE
    ),
    (
        'science_daily',
        'Sarah',
        'Coleman',
        'EDITOR',
        'Píše články o vede a výskume.',
        '$2a$10$mvsIH5/8md7/hapgcnE65eiTxMWYyLYxufIAp4Pj8sgjY1iUOXFsC',
        'sarah.coleman@example.com',
        FALSE
    ),
    (
        'news_reader',
        'David',
        'Miller',
        'USER',
        'Zaujíma sa o svetové správy a technológie.',
        '$2a$10$APpsaC0/Bv4.BFRPtFvo/eBZR5xI3poOl4kIuvwdti1smCibi2rAK',
        'david.miller@example.com',
        FALSE
    );

INSERT INTO topic (topic_name)
VALUES
    ('Veda'),
    ('História'),
    ('Technológie'),
    ('Svetové správy');

INSERT INTO tag (tag_name)
VALUES
    ('Výskum'),
    ('Objav'),
    ('Starovek'),
    ('Inovácia'),
    ('Vzdelávanie'),
    ('Aktuálne');

INSERT INTO article (
    writer_id,
    topic_name,
    tags_id,
    release_date,
    content,
    status,
    title,
    image_url
)
VALUES
    (
        1,
        'Technológie',
        3,
        NOW(),
        'Medzinárodný tím astronómov pod hlavičkou Európskeho južného observatória a NASA dnes zverejnil dychberúce zábery, ktoré posúvajú hranice nášho poznania hlbokého vesmíru. Vesmírny ďalekohľad Jamesa Webba nasmeroval svoje citlivé prístroje do doteraz neprebádaných oblastí hmloviny Orlia hlava. Výsledkom je mozaika snímok v doteraz nevídanom rozlíšení, ktorá odhaľuje chaotický a zároveň fascinujúci proces zrodu nových hviezdnych systémov. Vďaka pokročilej infračervenej kamere NIRCam dokázal teleskop preniknúť cez husté prachové závoje, ktoré boli pre staršie optické prístroje vrátane Hubbleovho teleskopu úplne nepriehľadné.Podľa vyjadrenia poprednej astrofizičky Dr. Eleny Vance, tieto dáta zásadne prekvapili celú vedeckú komunitu. Snímky ukazujú stovky doteraz nezaznamenaných protohviezd, ktoré žiaria ako žeravé uhlíky uprostred masívnych stĺpov kozmického plynu a prachu. Tieto mladé hviezdy aktívne generujú nadzvukové prúdy molekulárneho vodíka, ktoré narážajú do okolitého materiálu a formujú ho do dramatických štruktúr. Nové zistenia naznačujú, že hustota formovania hviezd v tejto oblasti je až dvakrát vyššia, než ukazovali doterajšie teoretické modely. Ľudstvo tak získava jedinečné laboratórium na pochopenie procesov, ktoré pred 4,6 miliardami rokov formovali aj našu vlastnú Slnečnú sústavu. Štúdia bude v najbližších dňoch publikovaná v prestížnom vedeckom časopise Nature.',
        'PUBLISHED',
        'Webbov teleskop prepisuje učebnice: Fascinujúci pohľad na zrod hviezd v hlbokom vesmíre',
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
    ),
    (
        2,
        'História',
        1,
        NOW(),
        'Hlboko pod nepreniknuteľnou zelenou klenbou guatemalskej džungle sa po celé storočia ukrývalo tajomstvo, ktoré mení dejiny strednej Ameriky. Medzinárodný archeologický tím s podporou národného inštitútu pre antropológiu dnes oznámil objav doteraz neznámeho mayského megamesta. Tento prielom sa podaril vďaka masívnemu nasadeniu leteckej laserovej technológie LiDAR. Špeciálne upravené lietadlá zmapovali územie s rozlohou viac ako dvetisíc štvorcových kilometrov, pričom vyslali k zemi miliardy laserových lúčov. Počítačové spracovanie dát následne umožnilo výskumníkom virtuálne odstrihnúť hustý prales a odhaliť presnú topografiu terénu vrátane štruktúr vytvorených ľudskou rukou.Výsledná digitálna mapa vyrazila vedcom dych. Na obrazovkách sa objavilo rozľahlé a sofistikovane prepojené mestské centrum s viac ako šesťdesiatimi tisíckami doteraz neznámych stavieb. Archeológovia lokalizovali masívne stupňovité pyramídy, palácové komplexy, obranné valy, strážne veže a rozsiahle poľnohospodárske terasy s pokročilým zavlažovacím systémom. Najväčším prekvapením je však objav širokých vyvýšených kamenných ciest, ktoré spájali jednotlivé mestské štáty do jedného mohutného ekonomického a politického celku. Tento objav definitívne vyvracia staršie teórie o tom, že Mayovia žili v izolovaných komunitách. Ukazuje sa, že ich civilizácia bola v čase svojho najväčšieho rozkvetu neuveriteľne urbanizovaná, husto osídlená a centrálne riadená, čím sa vyrovnala starovekej Číne či Rímskej ríši.',
        'PUBLISHED',
        'Senzácia v džungli: Lasery odhalili gigantické mayské megamesto, o ktorom nikto netušil',
        'https://images.unsplash.com/photo-1514894780887-121968d00567?auto=format&fit=crop&w=800&q=80'
    ),
    (
        2,
        'Technológie',
        4,
        NOW(),
        'Svet technológií zažíva historický zlom, ktorý nás posúva o krok bližšie k ére superpočítačov novej generácie. Popredné technologické konzorcium so sídlom v Silicon Valley dnes oznámilo úspešné vyriešenie najväčšieho hardvérového problému, ktorý doteraz blokoval rozvoj kvantových počítačov. Týmto problémom bol environmentálny šum a s ním spojená extrémna nestabilita kvantových bitov (qubitov). Qubity sú neuveriteľne citlivé na akékoľvek vonkajšie vplyvy, ako sú minimálne zmeny teploty alebo elektromagnetické žiarenie. Tieto faktory doteraz spôsobovali takzvanú dekoherenciu, pri ktorej qubity strácali svoj stav superpozície a kolabovali v priebehu mikrosekúnd, čo viedlo k fatálnym chybám vo výpočtoch.Inžinieri však vyvinuli revolučnú procesorovú architektúru, ktorá využíva pokročilé kryogénne chladenie na úrovne blízke absolútnej nule v kombinácii s novým typom lokalizovaného magnetického tienenia. Okolo každého qubitu sa im podarilo vytvoriť stabilizačný digitálny obal, ktorý dokáže v reálnom čase detegovať a korigovať chyby. Počas oficiálneho testu si procesor udržal plnú stabilitu po dobu rekordných desiatich minút. V tomto čase dokázal vyriešiť komplexný kryptografický algoritmus, ktorého výpočet by najrýchlejšiemu súčasnému superpočítaču na svete trval približne štyritisíc rokov. Tento masívny úspech znamená prechod kvantového computingu z teoretických akademických diskusií do reálnej komerčnej praxe, čo zásadne ovplyvní kybernetickú bezpečnosť, logistiku a vývoj nových liečiv.',
        'PUBLISHED',
        'Kvantová nadvláda na dosah: Vedci vyriešili fatálny problém so stabilitou qubitov',
        'https://imgs.search.brave.com/xaO2n6YrXC1HhFWZl_fGZm4fs2fvKvMuF7ZR6JWlUFE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZWFydGguY29tL2Fz/c2V0cy9fbmV4dC9p/bWFnZS8_dXJsPWh0/dHBzOi8vY2ZmMi5l/YXJ0aC5jb20vdXBs/b2Fkcy8yMDI1LzAy/LzI1MTA0MDM0L21p/Y3Jvc29mdF9xdWFu/dHVtLWNvbXB1dGlu/Zy1hZHZhbmNlbWVu/dF9tYWpvcmFuYS0x/XzFtLTE0MDB4ODUw/LmpwZyZ3PTEyMDAm/cT03NQ'
    ),
    (
        1,
        'Svetové správy',
        2,
        NOW(),
        'Zatiaľ čo z celého sveta prichádzajú alarmujúce správy o masovom bielení a nezvratnom úpadku koralových ekosystémov v dôsledku stúpajúcej teploty povrchových vôd, oceánografický výskumný tím prišiel s prekvapivým objavom. Počas hlbinných expedícií v odľahlých vodách v blízkosti Galapágskych ostrovov narazili vedci na úplne neporušený, obrovský koralový útes, ktorý sa neprerušene tiahne v dĺžke niekoľkých kilometrov. Tento skrytý klenot sa nachádza v hĺbke takmer 600 metrov pod hladinou oceánu, kam už slnečné lúče nedosiahnu, a vďaka tomu bol dokonale izolovaný od klimatických zmien prebiehajúcich na povrchu.Morskí biológovia vysvetľujú tento unikátny úkaz špecifickou lokálnou hydrodynamikou. Oblasť je totiž zásobovaná silnými, ľadovými hlbinnými prúdmi, ktoré sú mimoriadne bohaté na minerálne živiny. Tieto prúdy neustále obmývajú útes a fungujú ako stopercentne spoľahlivá prírodná klimatizácia, ktorá udržiava optimálne podmienky pre život koralov. Podmorské kamery s vysokým rozlíšením zaznamenali, že útes doslova prekypuje biodiverzitou. Vedci tu identifikovali desiatky vzácnych hlbinných živočíchov, unikátne druhy žralokov a krabov, ktoré boli v iných častiach planéty považované za kriticky ohrozené. Už teraz prebiehajú intenzívne diplomatické rokovania o okamžitom vyhlásení tejto hlbinnatnej zóny za prísne chránenú morskú rezerváciu s úplným zákazom priemyselného rybolovu.',
        'PUBLISHED',
        'Zázrak v temnotách oceánu: Pri Galapágoch objavili panenský hlbinný koralový útes',
        'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80'
    ),
    (
        2,
        'Veda',
        1,
        NOW(),
        'Onkologická liečba stojí na prahu najväčšej revolúcie vo svojich dejinách. Výsledky prvej fázy klinických testov novej personalizovanej protirakovinovej terapie na ľuďoch prekonali aj tie najoptimistickejšie očakávania lekárskej komunity. Tím onkológov a molekulárnych biológov úspešne adaptoval technológiu informačnej RNA (mRNA), ktorá sa osvedčila pri celosvetovom vývoji najmodernejších vakcín, a pretvoril ju na nekompromisnú zbraň proti nádorovým ochoreniam. Na rozdiel od tradičnej a pre telo agresívnej chemoterapie, ktorá plošne ničí všetko živé vrátane imunitného systému, táto nová metóda funguje s chirurgickou presnosťou.Lekári najskôr vykonajú detailnú biopsiu pacientovho nádoru a zmapujú jeho jedinečný genetický profil. Následne v laboratóriu syntetizujú na mieru navrhnutý reťazec mRNA, ktorý po vstreknutí do tela funguje ako presné zadanie pre imunitný systém. Naučí pacientove vlastné biele krvinky (T-lymfocyty) bezpečne rozpoznať a neúprosne likvidovať špecifické proteíny, ktoré sa vyskytujú výlučne na povrchu rakovinových buniek. V prvej testovacej skupine pacientov s pokročilými štádiami solídnych nádorov došlo v priebehu necelých šiestich týždňov k priemernému zmenšeniu nádorovej hmoty o neuveriteľných 70 percent. Keďže okolité zdravé tkanivá zostali úplne nedotknuté, pacienti netrpeli žiadnymi vážnymi vedľajšími účinkami. Svetové zdravotnícke organizácie už pripravujú podmienky pre urýchlené schválenie druhej fázy rozsiahlych klinických testov.',
        'PUBLISHED',
        'Medicínsky prielom: Nová mRNA terapia rakoviny dokáže vytrénovať imunitu a zničiť nádor',
        'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80'
    ),
    (
        1,
        'Svetové správy',
        4,
        NOW(),
        'Po viac ako pätnástich rokoch úmorných medzinárodných vyjednávaní, diplomatických kríz a opätovne zablokovaných schôdzí sa v sídle Organizácie Spojených národov v New Yorku odohral historický moment. Delegáti z viac ako 190 členských krajín slávnostne podpísali prvú komplexnú a právne plne záväznú dohodu o ochrane medzinárodných vôd, celosvetovo známu pod názvom Zmluva o šírom mori. Ide o obrovský míľnik, keďže oblasti šíreho mora tvoria takmer dve tretiny svetového oceánu, no doteraz spadali pod slabú legislatívu a pred nelegálnym drancovaním bolo chránené necelé jedno percento z nich.Zmluvné strany sa pod hrozbou prísnych medzinárodných sankcií oficiálne zaviazali, že do roku 2030 premenia minimálne 30 percent všetkých medzinárodných vôd na plne chránené morské rezervácie. V týchto chránených zónach bude zavedený absolútny zákaz komerčného hlbinného rybolovu, vypúšťania priemyselného odpadu a hlbinnatnej ťažby nerastných surovín. Celý systém bude prísne monitorovaný novovytvoreným medzinárodným úradom, ktorý bude v reálnom čase využívať pokročilé satelitné sledovanie a umelú inteligenciu na detekciu nelegálnych flotíl. Poprední svetoví environmentalisti neskrývajú nadšenie a zhodujú sa, že táto dohoda predstavuje absolútne poslednú reálnu šancu pre ľudstvo, ako zastaviť prebiehajúcu ekologickú krízu a masové vymieranie morských druhov.',
        'PUBLISHED',
        'Historický úspech diplomacie: OSN schválila prelomovú zmluvu na záchranu svetových oceánov',
        'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
    ),
    (
        2,
        'História',
        3,
        NOW(),
        'Tím podmorských archeológov a špecialistov na hlbinný prieskum dnes oznámil definitívne vyriešenie jednej z najväčších záhad v námornej histórii severnej Európy. Za pomoci moderných autonómnych podvodných robotov (AUV) vybavených sonarom s vysokým rozlíšením sa im podarilo na dne Baltského mora objaviť vrak legendárnej holandskej obchodnej lode, ktorá bez stopy zmizla počas ničivej zimnej búrky v roku 1684. Loď odpočíva v hĺbke presahujúcej 120 metrov a jej stav vyrazil expertom dych. Trup lode a hlavné sťažne sú takmer dokonale neporušené, akoby sa potopila len pred niekoľkými týždňami.Tento neuveriteľný stupeň zachovania je priamym dôsledkom unikátnych prírodných podmienok, ktoré v hlbokých vrstvách Baltského mora panujú. Voda tu vykazuje extrémne nízku salinitu a takmer úplný nedostatok kyslíka. Vďaka tomu v tejto oblasti nedokážu prežiť takzvané lodné červy (Drevokaz lodný) ani iné mikroorganizmy, ktoré v teplejších moriach spoľahlivo zlikvidujú akékoľvek historické drevo v priebehu pár desaťročí. Prvé zábery z robotických kamier ukázali, že nákladný priestor lode je stále naplnený pôvodným tovarom vrátane tisícok neporušených hlinených fajok, starých mincí, textilných balíkov a zapečatených keramických amfor. Historici sa zhodujú, že laboratórny výskum tohto nákladu prinesie neoceniteľné informácie o ekonomike a každodennom živote obchodníkov v sedemnástom storočí.',
        'PUBLISHED',
        'Záhada vyriešená: Na dne Baltského mora našli dokonale zachovaný vrak lode z roku 1684',
        'https://images.unsplash.com/photo-1500049242364-5f500807cdd7?auto=format&fit=crop&w=800&q=80'
    ),
    (
        1,
        'Technológie',
        4,
        NOW(),
        'Masové rozšírenie elektromobility na celom svete dlhé roky narážalo na dva zásadné technologické limity, ktoré odrádzali bežných motoristov: obmedzený dojazd na jedno nabitie a neúmerne dlhý čas strávený na nabíjacích staniciach. Inovatívny automobilový startup však dnes šokoval odbornú verejnosť, keď predstavil plne funkčný a otestovaný prototyp batérie s pevným elektrolytom (solid-state) novej generácie. Súčasné elektromobily sa spoliehajú na lítium-iónové batérie s tekutým alebo gélovým elektrolytom, ktoré majú limitovanú hustotu energie a pri pokuse o ultrarýchle nabíjanie produkujú nebezpečné množstvo tepla, čo poškodzuje ich životnosť.Nový predstavený prototyp nahrádza rizikovú kvapalnú zložku špeciálne vyvinutým ultra hustým keramickým materiálom. Výsledky nezávislých testov sú priam neuveriteľné. Táto batéria dokáže reálne zabezpečiť elektromobilu dojazd na úrovni až 1450 kilometrov na jedno nabitie. Čo je však ešte pôsobivejšie, unikátna chemická architektúra umožňuje bezpečné plné nabitie batérie za necelých osem minút, pričom nedochádza k žiadnemu vnútornému prehrievaniu ani degradácii článkov. Poprední svetoví automobiloví giganti už odštartovali ostrý boj o získanie exkluzívnych licenčných práv pre túto technológiu. Spustenie hromadnej sériovej výroby pre komerčný trh je oficiálne naplánované na najbližšie tri roky, čo môže znamenať definitívny koniec éry spaľovacích motorov.',
        'PUBLISHED',
        'Koniec obáv z dojazdu: Nová solid-state batéria sľubuje dojazd 1450 km a nabitie za 8 minút',
        'https://imgs.search.brave.com/rJex_4nEjfa_GwNmv_sEHzTrq7c_rGAE-5s9IAeq4ZE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM5/MDk2OTUyNC9waG90/by9iYXR0ZXJ5LXBh/dHRlcm4uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPTctXzRU/eEdQM2RVNVhVdUNv/TUlsbl9wUU55bEVu/bC0wTm9EMW1helYw/T0U9'
    ),
    (
        2,
        'Veda',
        1,
        NOW(),
        'Nové telemetrické a seizmické dáta prijaté z robotického modulu, ktorý momentálne vykonáva geofyzikálny výskum v hlbokých kráteroch na južnej pologuli Marsu, vyvolali obrovskú senzáciu a okamžite rozpútali ostrú vedeckú diskusiu medzi planetárnymi geológmi. Prevažná časť vedeckej komunity sa totiž po celé desaťročia pevne držala teórie, že Červená planéta stratila takmer všetku svoju tekutú vodu pred miliardami rokov v dôsledku postupného rednutia atmosféry a silného pôsobenia slnečného vetra. Ultra citlivé seizmometre pracujúce na palube modulu však zaznamenali sériu anomálnych podzemných otrasov.Pri následnej detailnej počítačovej analýze rázových vĺn geofyzici zistili, že vlny sa marťanskou kôrou šíria spôsobom, ktorý jednoznačne potvrdzuje prítomnosť masívnych podzemných rezervoárov kvapaliny. Podľa nových prepočtov sa obrovské zásoby vysoko slanej vody nenachádzajú len v zmrznutom stave na polárnych čiapočkách, ale prežívajú v tekutej forme celé kilometre pod povrchom planéty. Pred úplným zamrznutím ich chráni pretrvávajúce geotermálne teplo jadra a extrémny tlak nadložných vrstiev hornín. Tento objav zásadne mení naše predstavy o evolúcii Marsu a poskytuje úplne jasné ciele pre budúce misie zamerané na hľadanie stôp mimozemského mikroskopického života.',
        'PUBLISHED',
        'Senzácia na Marse: Seizmické merania potvrdili obrovské zásoby tekutej vody hlboko pod povrchom',
        'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80'
    ),
    (
        1,
        'Veda',
        2,
        NOW(),
        'Tím popredných medzinárodných paleontológov dnes zverejnil detaily o náleze, ktorý vyvolal zemetrasenie vo svete evolučnej biológie. Počas náročných vykopávok v nehostinných a vetrom ošľahaných púštnych oblastiach patagónskej Argentíny sa im podarilo odkryť takmer kompletné fosílne pozostatky obrovského dravého dinosaura z konca kriedového obdobia. Unikátny nález zahŕňa najmä masívnu, dokonale zachovanú lebku s radmi vrúbkovaných zubov pripomínajúcich dýky, ktoré dĺžkou presahujú dvadsať centimetrov. Predbežné anatomické merania kostry ukazujú, že tento obrovský mäsožravec meral od nosa po koniec chvosta necelých 12 metrov a jeho živá váha presahovala úctyhodných šesť ton. Svojou veľkosťou tak bol priamym konkurentom slávneho severoamerického Tyrannosaura Rexa. Čo však robí tento nový druh, oficiálne pomenovaný „Púštny prízrak“, skutočne fascinujúcim, je nezvyčajne veľká mozgová dutina a špecifická štruktúra vnútorného ucha. Biomechanické simulácie dokazujú, že dinosaurus disponoval výnimočne ostrým zrakom, trojrozmerným vnímaním priestoru a dokázal pri behu vyvinúť bleskovú akceleráciu. Nález viacerých jedincov na jednom mieste navyše naznačuje, že tieto obávané predátory lovili v organizovaných svorkách, vďaka čomu dokázali skoliť aj tie najväčšie bylinožravé sauropody svojej éry.',
        'PUBLISHED',
        'Nový kráľ praveku: V Patagónii vykopali masívneho dravého dinosaura, ktorý lovil v svorkách',
        'https://imgs.search.brave.com/aN4qd9Zb7djmhFq-UihfEnuo4M7ixPeu5IhApG576D0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG9wc2NpLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8x/MC8yMS9JTExVU1RS/QVRJT05uZXN0aW5n/X2dyb3VuZF9jcmVk/aXRfSm9yZ2VfR29u/emFsZXotc2NhbGVk/LmpwZz9xdWFsaXR5/PTg1Jnc9NzY4'
    ),
    (
        2,
        'Technológie',
        4,
        NOW(),
        'Mestská mobilita na celom svete oficiálne prekračuje hranice sci-fi a vstupuje do svojej novej, vertikálnej éry. Civilné letecké úrady po ukončení trojročného cyklu prísnych bezpečnostných testov formálne udelili vôbec prvé povolenie na plnú komerčnú prevádzku autonómnych elektrických lietadiel s vertikálnym vzletom a pristátím, známych pod skratkou eVTOL. Tieto ekologické osobné drony budú fungovať v rámci decentralizovanej siete riadenia vzdušného priestoru, ktorú kompletne spravuje pokročilá umelá inteligencia. Počas finálnej testovacej fázy stroje bezpečne a bez jediného incidentu absolvovali tisíce letov bez prítomnosti pilota priamo nad husto zastavanými metropolitnými centrami. Pohonné systémy týchto lietajúcich taxíkov využívajú najmodernejšie lítium-sírové batérie, ktoré vynikajú nízkou hmotnosťou a extrémnou stabilitou. Veľkou výhodou je, že prevádzka strojov je z úrovne ulice takmer úplne bezhlučná, čím sa eliminujú akékoľvek obavy z hlukového smogu v obytných zónach. Analytické dáta ukázali, že priemerný čas presunu pasažierov cez preťažené mestské jadrá sa vďaka prechodu do vzduchu skrátil o neuveriteľných 85 percent, čo predstavuje revolúciu v každodennom dochádzaní do práce.',
        'PUBLISHED',
        'Doprava budúcnosti je tu: Lietajúce autonómne taxíky dostali zelenú pre komerčnú prevádzku',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ),
    (
        1,
        'Veda',
        1,
        NOW(),
        'Hlboko v mrazivom srdci Antarktídy sa medzinárodnému tímu polárnych výskumníkov podaril husársky kúsok, ktorý zásadne ovplyvní modernú klimatológiu. Pomocou špeciálnej vrtnej súpravy určenej do extrémnych podmienok úspešne vytiahli z hĺbky niekoľkých kilometrov neporušené vzorky prastarého ľadovcového jadra. Vnútri tohto ľadu zostali hermeticky zakonzervované mikroskopické vzduchové bubliny, ktoré vznikli pred takmer dvoma miliónmi rokov. Tento objav predstavuje najstarší priamy fyzikálny záznam o stave zemskej atmosféry, aký máme k dispozícii. Následné precízne analýzy v laboratóriách s vysokým stupňom ochrany priniesli prekvapivé odhalenia. Ukázalo sa, že prirodzené kolísanie koncentrácie atmosférických skleníkových plynov v období ranného pleistocénu prebiehalo v úplne iných chemických a fyzikálnych mantineloch, než s akými doteraz striktne počítali všetky moderné klimatické modely. Tieto jedinečné dáta z minulosti našej planéty umožnia vedcom výrazne spresniť ich predpovedné algoritmy týkajúce sa globálneho otepľovania. Pomôžu lepšie pochopiť, ako bude globálny klimatický systém v najbližších desaťročiach reagovať na prudké zmeny v distribúcii tepla a salinity v polárnych oceánoch.',
        'PUBLISHED',
        'Prielom v Antarktíde: Vedci vyvrtali dva milióny rokov starý ľad, ktorý mení pohľad na klímu',
        'https://images.unsplash.com/photo-1516756587022-7891ad56a8cd?auto=format&fit=crop&w=800&q=80'
    ),
    (
        2,
        'Svetové správy',
        6,
        NOW(),
        'Boj proti globálnym klimatickým zmenám získal do svojho arzenálu mimoriadne silnú priemyselnú zbraň. Inžinierske tímy dnes oficiálne uviedli do plnej prevádzky celosvetovo najväčšie a technologicky najvyspelejšie zariadenie na priame zachytávanie oxidu uhličitého z voľného ovzdušia (technológia DAC). Tento gigantický komplex budov a priemyselných ventilátorov dokáže podľa oficiálnych technických špecifikácií ročne efektívne odfiltrovať z atmosféry viac ako jeden milión metrických ton čistého CO2. Celý systém funguje na báze revolučnej štruktúrovanej mriežky napustenej chemicky stálym pevným sorbentom, pričom celá prevádzka je stopercentne poháňaná čistou lokálnou geotermálnou energiou, takže sama nevytvára žiadnu uhlíkovú stopu. Zachytený plyn sa pod extrémnym tlakom skvapalní a masívnym potrubím sa odvedie tisíce stôp pod zemský povrch priamo do hlbokých čadičových skalných útvarov. Tam, vďaka prirodzeným minerálnym reakciám s okolitou horninou, tento uhlík v priebehu niekoľkých mesiacov doslova skamenie a premení sa na stabilný minerál. Týmto spôsobom sa natrvalo zabráni jeho opätovnému uvoľneniu do ovzdušia, čo predstavuje obrovský krok vpred pre ekologickú stabilitu planéty.',
        'PUBLISHED',
        'Technologický míľnik: Spustili najväčší závod na svete, ktorý doslova mení emisie CO2 na kameň',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    ),
    (
        1,
        'História',
        3,
        NOW(),
        'Dlhoročné a nesmierne mravčie úsilie tímu historikov a reštaurátorov v tajných štátnych archívoch v Istanbule prinieslo nečakanú historickú senzáciu. Počas katalogizácie poškodených stredovekých spisov narazili na zabudnutú a doteraz nikde nepublikovanú zbierku ručne kreslených vojenských a taktických máp. Tieto vzácne pergameny sa aktívne používali počas ranej éry osmanskej námornej expanzie v Stredozemnom mori a slúžili ako prísne strážené štátne tajomstvo. Mapy s neuveriteľnou precíznosťou podrobne dokumentujú polohu doteraz neznámych pobrežných pevností, tajných signalizačných sietí využívajúcich ohne a skrytých zásobovacích bodov. Najväčšiu hodnotu však majú rozsiahle osobné poznámky, strategické úvahy a rukou písané príkazy legendárnych admirálov, ktoré sú vpísané priamo do okrajov máp. Poprední svetoví kartografi tento nález svorne označujú za najvýznamnejší prielom tohto storočia v oblasti stredomorskej histórie. Tieto dokumenty totiž odkrývajú detailné informácie o vtedajšej vojenskej logistike, špionáži a námornej taktike, ktoré boli po celé stáročia považované za definitívne stratené v prachu času.',
        'PUBLISHED',
        'Poklad z archívov: V Istanbule objavili tajné osmanské mapy s poznámkami admirálov',
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'
    ),
    (
        2,
        'Technológie',
        4,
        NOW(),
        'Materiáloví vedci po piatich rokoch intenzívnych počítačových simulácií a laboratórnych pokusov úspešne syntetizovali materiál, ktorý posúva hranice modernej fyziky. Ide o prelomovú dvojrozmernú polymérovú štruktúru, ktorá svojimi vlastnosťami totálne deklasuje všetky doteraz známe kompozitné materiály. Podľa oficiálnych výsledkov laboratórnych testov vykazuje tento nový polymér výrazne vyššiu pevnosť v ťahu a neporovnateľne lepšiu štrukturálnu flexibilitu než tie najkvalitnejšie súčasné uhlíkové vlákna, pričom si zachováva ultraľahkú hmotnosť. Materiál bol vytvorený za pomoci unikátnej nízkoteplotnej chemickej technológie, ktorá umožňuje presné usporiadanie molekúl do dokonalej mriežky. Vďaka tejto špecifickej vnútornej stavbe dokáže štruktúra absorbovať a hravo zablokovať aj vysokorýchlostné nárazy cudzích telies bez toho, aby došlo k jej prasknutiu. Globálny letecký a kozmický priemysel okamžite prejavil o objav obrovský záujem a v týchto dňoch už testuje prvé verzie tohto materiálu. Plánuje sa jeho využitie na konštrukciu vonkajších pancierov novej generácie, ktoré budú chrániť medzihviezdne prieskumné sondy a komunikačné satelity pred silným kozmickým žiarením a nárazmi mikrometeoritov.',
        'PUBLISHED',
        'Revolúcia v materiálových vedách: Nový ultraľahký polymér je pevnejší ako uhlíkové vlákna',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    );

INSERT INTO comment (
    author_id,
    article_id,
    content,
    rating
)
VALUES
    (
        3,
        1,
        'Snímky z teleskopu Jamesa Webba ma nikdy neprestanú udivovať. Je to skutočná nádhera.',
        5
    ),
    (
        1,
        2,
        'Technológia LiDAR úplne mení spôsob, akým pristupujeme k historickej archeológii.',
        5
    ),
    (
        3,
        3,
        'Pokroky v oblasti kvantového hardvéru napredujú oveľa rýchlejšie, než sa čakalo.',
        4
    ),
    (
        2,
        4,
        'Je upokojujúce počuť, že niektoré morské ekosystémy si dokážu nájsť spôsob, ako sa prispôsobiť.',
        5
    ),
    (
        3,
        5,
        'Cielená mRNA liečba v onkológii by mohla zachrániť milióny ľudských životov.',
        5
    ),
    (
        1,
        6,
        'Nevyhnutný politický míľnik. Dúfajme, že dodržiavanie pravidiel sa bude prísne kontrolovať.',
        4
    ),
    (
        3,
        7,
        'Fascinujúce. Nájsť drevené konštrukcie z roku 1684 v takomto neporušenom stave je neuveriteľné.',
        5
    ),
    (
        2,
        8,
        'Dojazd 900 míľ by definitívne odbúral akýkoľvek strach a stres z potreby nabíjania.',
        4
    ),
    (
        3,
        9,
        'Podzemná voda na Marse znamená, že naše budúce misie s posádkou budú oveľa zaujímavejšie.',
        5
    ),
    (
        1,
        10,
        'Patagónia neustále prináša tie najúžasnejšie objavy fosílií na svete.',
        5
    );

INSERT INTO articletags (
    article_id,
    tag_name
)
VALUES
    (1, 'Starovek'),
    (1, 'Vzdelávanie'),
    (2, 'Výskum'),
    (2, 'Objav'),
    (3, 'Inovácia'),
    (3, 'Aktuálne'),
    (4, 'Objav'),
    (5, 'Výskum'),
    (5, 'Inovácia'),
    (6, 'Aktuálne'),
    (7, 'Starovek'),
    (7, 'Objav'),
    (8, 'Inovácia'),
    (9, 'Objav'),
    (9, 'Výskum'),
    (10, 'Starovek'),
    (11, 'Inovácia'),
    (11, 'Aktuálne'),
    (12, 'Výskum'),
    (12, 'Starovek'),
    (13, 'Inovácia'),
    (14, 'Starovek'),
    (15, 'Inovácia'),
    (15, 'Výskum');