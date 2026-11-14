export type Term = {
  id: number;
  en: string;
  pl: string;
  section: number;
};

export type Section = {
  id: number;
  short: string;
  title: string;
  en: string;
};

export const SECTIONS: Section[] = [
  { id: 1, short: "Branża", title: "Branża i terminologia", en: "Advertising industry and terminology" },
  { id: 2, short: "Formy", title: "Rodzaje i formy reklamy", en: "Types and forms of advertising" },
  { id: 3, short: "Techniki", title: "Techniki i strategie", en: "Advertising techniques and strategies" },
  { id: 4, short: "Język", title: "Język i środki perswazji", en: "Advertising language and persuasive expressions" },
  { id: 5, short: "Psychologia", title: "Psychologia konsumenta", en: "Consumer psychology and behaviour" },
  { id: 6, short: "Digital", title: "Marketing cyfrowy", en: "Digital marketing and social media" },
  { id: 7, short: "Design", title: "Design i komunikacja wizualna", en: "Advertising design and visual communication" },
  { id: 8, short: "Wyniki", title: "Skuteczność i wyniki", en: "Advertising effectiveness and performance" },
  { id: 9, short: "Etyka", title: "Etyka i kontrowersje", en: "Ethics and controversial advertising" },
  { id: 10, short: "Biznes", title: "Biznes, marka i konkurencja", en: "Business, branding and competition" },
  { id: 11, short: "Czasowniki", title: "Czasowniki", en: "Advertising verbs" },
  { id: 12, short: "Kolokacje", title: "Kolokacje i wyrażenia", en: "Collocations and useful expressions" },
  { id: 13, short: "Społeczeństwo", title: "Reklama i społeczeństwo", en: "Advertising and society" },
  { id: 14, short: "Przymiotniki", title: "Przymiotniki", en: "Adjectives for discussing advertising" },
  { id: 15, short: "Pojęcia", title: "Rzeczowniki i pojęcia", en: "Nouns and concepts" },
];

const LINES = `
Advertising campaign|kampania reklamowa
Advertising agency|agencja reklamowa
Advertiser|reklamodawca
Advertisement / advert|reklama
Commercial|reklama komercyjna
Promotional material|materiał promocyjny
Marketing strategy|strategia marketingowa
Brand awareness|świadomość marki
Brand recognition|rozpoznawalność marki
Brand identity|tożsamość marki
Brand image|wizerunek marki
Brand loyalty|lojalność wobec marki
Brand positioning|pozycjonowanie marki
Target audience|grupa docelowa
Target market|rynek docelowy
Consumer behaviour|zachowania konsumentów
Market research|badanie rynku
Market segmentation|segmentacja rynku
Advertising industry|branża reklamowa
Promotional campaign|kampania promocyjna
Print advertising|reklama prasowa
Television commercial|reklama telewizyjna
Radio advertising|reklama radiowa
Outdoor advertising|reklama zewnętrzna
Billboard|billboard
Digital advertising|reklama cyfrowa
Online advertising|reklama internetowa
Social media advertising|reklama w mediach społecznościowych
Display advertising|reklama graficzna w internecie
Native advertising|reklama natywna
Influencer marketing|marketing influencerski
Endorsement|rekomendacja / poparcie
Product placement|lokowanie produktu
Sponsorship|sponsoring
Direct marketing|marketing bezpośredni
Email marketing|marketing e-mailowy
Guerrilla marketing|marketing partyzancki
Viral advertising|reklama wirusowa
Comparative advertising|reklama porównawcza
Covert advertising|reklama ukryta
Persuasion|perswazja
Manipulation|manipulacja
Emotional appeal|odwołanie do emocji
Rational appeal|odwołanie do rozsądku
Fear appeal|odwołanie do strachu
Celebrity endorsement|rekomendacja celebryty
Storytelling|opowiadanie historii
Brand storytelling|budowanie wizerunku marki poprzez historie
Subliminal advertising|reklama podprogowa
Repetition|powtarzalność
Exaggeration|wyolbrzymienie
Humour-based advertising|reklama oparta na humorze
Shock advertising|reklama szokująca
Scarcity marketing|marketing oparty na ograniczonej dostępności
Urgency-driven marketing|marketing wykorzystujący presję czasu
Personalisation|personalizacja
Retargeting|ponowne kierowanie reklam
Cross-promotion|wzajemna promocja
Word-of-mouth marketing|marketing szeptany
Customer engagement|zaangażowanie klientów
Catchphrase|chwytliwe hasło
Slogan|slogan reklamowy
Tagline|krótkie hasło marki
Catchy|chwytliwy
Compelling|przekonujący
Persuasive|perswazyjny
Captivating|urzekający
Memorable|łatwy do zapamiętania
Intriguing|intrygujący
Attention-grabbing|przyciągający uwagę
Hard-hitting|mocny, dosadny
Misleading|wprowadzający w błąd
Exaggerated|przesadzony
Enticing|kuszący
Convincing|przekonujący
Impactful|wywierający duże wrażenie
Evocative|przywołujący emocje lub skojarzenia
Provocative|prowokacyjny
Engaging|angażujący
Aspirational|odwołujący się do aspiracji
Consumerism|konsumpcjonizm
Consumer demand|popyt konsumencki
Purchasing behaviour|zachowania zakupowe
Buying habits|nawyki zakupowe
Impulse buying|zakupy pod wpływem impulsu
Brand preference|preferencje dotyczące marek
Consumer perception|postrzeganie przez konsumentów
Buying decision|decyzja zakupowa
Purchase intention|zamiar zakupu
Customer satisfaction|zadowolenie klienta
Customer retention|utrzymanie klientów
Customer acquisition|pozyskiwanie klientów
Consumer trust|zaufanie konsumentów
Peer pressure|presja rówieśnicza
Social status|status społeczny
Aspirational lifestyle|styl życia, do którego się aspiruje
Psychological trigger|bodziec psychologiczny
Emotional attachment|więź emocjonalna
Perceived value|postrzegana wartość
Brand association|skojarzenie z marką
Search engine optimisation (SEO)|optymalizacja pod kątem wyszukiwarek
Search engine marketing (SEM)|marketing w wyszukiwarkach
Pay-per-click (PPC)|płatność za kliknięcie
Click-through rate (CTR)|współczynnik klikalności
Conversion rate|współczynnik konwersji
Landing page|strona docelowa
Traffic generation|generowanie ruchu na stronie
Web traffic|ruch na stronie internetowej
Algorithm|algorytm
Sponsored content|treści sponsorowane
Affiliate marketing|marketing afiliacyjny
Content marketing|marketing treści
User-generated content|treści tworzone przez użytkowników
Hashtag campaign|kampania hashtagowa
Online presence|obecność w internecie
Digital footprint|ślad cyfrowy
Engagement rate|współczynnik zaangażowania
Organic reach|zasięg organiczny
Paid reach|zasięg płatny
Social media influencer|influencer działający w mediach społecznościowych
Visual appeal|atrakcyjność wizualna
Visual identity|identyfikacja wizualna
Graphic design|projektowanie graficzne
Typography|typografia
Colour scheme|kolorystyka
Layout|układ graficzny
Composition|kompozycja
Imagery|materiał obrazowy
Visual storytelling|opowiadanie historii za pomocą obrazu
Brand logo|logo marki
Packaging design|projektowanie opakowań
Aesthetic appeal|atrakcyjność estetyczna
Visual hierarchy|hierarchia wizualna
Minimalist design|minimalistyczny projekt
Eye-catching|przyciągający wzrok
High-resolution image|obraz o wysokiej rozdzielczości
Brand consistency|spójność marki
Creative concept|koncepcja kreatywna
Visual representation|przedstawienie wizualne
Artistic direction|kierownictwo artystyczne
Advertising effectiveness|skuteczność reklamy
Campaign performance|wyniki kampanii
Return on investment (ROI)|zwrot z inwestycji
Cost per click (CPC)|koszt kliknięcia
Cost per impression (CPM)|koszt tysiąca wyświetleń
Conversion|konwersja
Lead generation|pozyskiwanie potencjalnych klientów
Sales figures|wyniki sprzedaży
Revenue growth|wzrost przychodów
Market share|udział w rynku
Brand exposure|ekspozycja marki
Reach|zasięg
Impressions|liczba wyświetleń
Audience engagement|zaangażowanie odbiorców
Performance metrics|wskaźniki efektywności
Data-driven marketing|marketing oparty na danych
A/B testing|testowanie porównawcze
Campaign optimisation|optymalizacja kampanii
Audience insights|informacje o odbiorcach
Analytics|analityka
False advertising|fałszywa reklama
Deceptive advertising|reklama wprowadzająca w błąd
Misrepresentation|przedstawianie czegoś w fałszywym świetle
Ethical standards|standardy etyczne
Consumer protection|ochrona konsumentów
Advertising regulations|przepisy dotyczące reklamy
Corporate responsibility|odpowiedzialność przedsiębiorstwa
Transparency|przejrzystość
Exploitation|wykorzystywanie
Vulnerable consumers|podatni na manipulację konsumenci
Body image|obraz własnego ciała
Unrealistic expectations|nierealistyczne oczekiwania
Stereotyping|stereotypizacja
Gender stereotypes|stereotypy płciowe
Objectification|uprzedmiotowienie
Greenwashing|pozorowanie ekologiczności
Manipulative tactics|manipulacyjne techniki
Hidden advertising|ukryta reklama
Intrusive advertising|nachalna reklama
Advertising ban|zakaz reklamy
Competitive advantage|przewaga konkurencyjna
Market positioning|pozycjonowanie na rynku
Market leader|lider rynku
Market penetration|penetracja rynku
Market demand|popyt rynkowy
Product launch|wprowadzenie produktu na rynek
Product differentiation|różnicowanie produktu
Unique selling proposition (USP)|unikalna propozycja sprzedaży
Value proposition|propozycja wartości
Brand equity|kapitał marki
Brand reputation|reputacja marki
Brand ambassador|ambasador marki
Brand extension|rozszerzenie marki
Brand revitalisation|odświeżenie marki
Rebranding|zmiana wizerunku marki
Product range|asortyment produktów
Competitive pricing|ceny konkurencyjne
Sales promotion|promocja sprzedaży
Customer base|baza klientów
Market dominance|dominacja na rynku
To promote|promować
To advertise|reklamować
To persuade|przekonywać
To influence|wpływać
To target|kierować do określonej grupy
To attract|przyciągać
To captivate|oczarowywać
To appeal to|odwoływać się do
To reinforce|wzmacniać
To manipulate|manipulować
To exaggerate|wyolbrzymiać
To highlight|podkreślać
To showcase|prezentować
To endorse|rekomendować
To generate|generować
To stimulate|stymulować
To boost|zwiększać
To enhance|ulepszać
To maximise|maksymalizować
To undermine|podważać / osłabiać
To launch a campaign|rozpocząć kampanię
To raise brand awareness|zwiększać świadomość marki
To build brand loyalty|budować lojalność wobec marki
To target a specific demographic|kierować reklamę do określonej grupy demograficznej
To influence purchasing decisions|wpływać na decyzje zakupowe
To drive sales|napędzać sprzedaż
To generate demand|generować popyt
To create a buzz|wywołać poruszenie
To grab consumers' attention|przyciągać uwagę konsumentów
To leave a lasting impression|pozostawić trwałe wrażenie
To appeal to emotions|odwoływać się do emocji
To exploit consumer insecurities|wykorzystywać niepewność konsumentów
To shape public opinion|kształtować opinię publiczną
To influence consumer behaviour|wpływać na zachowania konsumentów
To stand out from the crowd|wyróżniać się na tle innych
To gain a competitive edge|zdobywać przewagę konkurencyjną
To convey a message|przekazywać komunikat
To convey brand values|przekazywać wartości marki
To boost brand visibility|zwiększać widoczność marki
To drive consumer engagement|zwiększać zaangażowanie konsumentów
Consumer culture|kultura konsumpcyjna
Mass consumption|masowa konsumpcja
Materialism|materializm
Consumer society|społeczeństwo konsumpcyjne
Advertising saturation|przesycenie reklamami
Information overload|nadmiar informacji
Media influence|wpływ mediów
Public perception|postrzeganie społeczne
Social responsibility|odpowiedzialność społeczna
Cultural values|wartości kulturowe
Societal expectations|oczekiwania społeczne
Lifestyle marketing|marketing stylu życia
Conspicuous consumption|konsumpcja na pokaz
Instant gratification|natychmiastowa gratyfikacja
Peer influence|wpływ rówieśników
Social conformity|konformizm społeczny
Media literacy|umiejętność krytycznego odbioru mediów
Critical thinking|krytyczne myślenie
Consumer awareness|świadomość konsumencka
Advertising ethics|etyka reklamy
Intrusive|nachalny
Ubiquitous|wszechobecny
Pervasive|wszechobecny, przenikający
Deceptive|zwodniczy
Subtle|subtelny
Overt|jawny
Covert|ukryty
Compelling|przekonujący
Innovative|innowacyjny
Innovative|nowatorski
Exploitative|wyzyskujący
Cost-effective|opłacalny
Lucrative|dochodowy
Persuasive|perswazyjny
Disruptive|przełomowy
Targeted|ukierunkowany
Tailored|dostosowany
Saturated|przesycony
Misleading|mylący
Far-reaching|dalekosiężny
Consumer manipulation|manipulacja konsumentami
Advertising expenditure|wydatki na reklamę
Advertising revenue|przychody z reklamy
Promotional incentive|zachęta promocyjna
Marketability|atrakcyjność rynkowa
Commercialisation|komercjalizacja
Consumer scepticism|sceptycyzm konsumencki
Advertising backlash|negatywna reakcja na reklamę
Publicity stunt|chwyt reklamowy
Brand endorsement|rekomendacja marki
Consumer insight|wiedza o potrzebach konsumentów
Advertising expenditure|nakłady reklamowe
Market appeal|atrakcyjność rynkowa
Brand differentiation|wyróżnianie marki
Advertising landscape|krajobraz reklamowy
Commercial persuasion|perswazja komercyjna
Consumer vulnerability|podatność konsumentów
Advertising credibility|wiarygodność reklamy
Brand perception|postrzeganie marki
Promotional strategy|strategia promocyjna
`.trim();

export const TERMS: Term[] = LINES.split("\n").map((line, index) => {
  const bar = line.indexOf("|");
  const en = line.slice(0, bar);
  const pl = line.slice(bar + 1);
  const id = index + 1;
  return { id, en, pl, section: Math.floor(index / 20) + 1 };
});

export function sectionOf(id: number): Section {
  return SECTIONS[Math.floor((id - 1) / 20)] ?? SECTIONS[0];
}
