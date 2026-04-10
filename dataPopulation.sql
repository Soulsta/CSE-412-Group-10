--
-- PostgreSQL database dump
--

\restrict 5erjF3Cji7j7SLFhKb4XTM3U9zZ6ARUZCJSZP02xG4Iful3oSHauJZ1joUHhrpr

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: arnav
--

CREATE TABLE public.users (
    userid character varying(50) NOT NULL,
    firstname character varying(50),
    lastname character varying(50),
    email character varying(100)
);


ALTER TABLE public.users OWNER TO arnav;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: arnav
--

COPY public.users (userid, firstname, lastname, email) FROM stdin;
nlucia0	Nikolaus	Lucia	nlucia0@dell.com
bebbutt1	Brandice	Ebbutt	bebbutt1@sfgate.com
rbrunet2	Reube	Brunet	rbrunet2@usatoday.com
hhallmark3	Herby	Hallmark	hhallmark3@usatoday.com
tcaswill4	Torey	Caswill	tcaswill4@dagondesign.com
byurocjhin5	Benjy	Yurocjhin	byurocjhin5@about.me
rdorbin6	Ruthe	Dorbin	rdorbin6@tripadvisor.com
semer7	Shayne	Emer	semer7@hc360.com
mtiley8	Milena	Tiley	mtiley8@trellian.com
lbeavis9	Lizzie	Beavis	lbeavis9@free.fr
hstanlocka	Harwell	Stanlock	hstanlocka@mlb.com
rquinceyb	Rea	Quincey	rquinceyb@typepad.com
gropartzc	Gaston	Ropartz	gropartzc@soundcloud.com
gtrumpeterd	Gustie	Trumpeter	gtrumpeterd@github.com
mmarrowe	Mohandis	Marrow	mmarrowe@illinois.edu
gvainesf	Gusti	Vaines	gvainesf@godaddy.com
ccouvertg	Carolynn	Couvert	ccouvertg@istockphoto.com
lmessiterh	Lorianne	Messiter	lmessiterh@imgur.com
aoldalli	Anet	Oldall	aoldalli@wordpress.org
dflowerdenj	Deerdre	Flowerden	dflowerdenj@wordpress.org
lspinask	Laetitia	Spinas	lspinask@webmd.com
hgiuriol	Hubie	Giurio	hgiuriol@europa.eu
cmontrosem	Cybil	Montrose	cmontrosem@army.mil
btimebyn	Bobby	Timeby	btimebyn@indiegogo.com
rdillinghamo	Rad	Dillingham	rdillinghamo@xinhuanet.com
bscardifieldp	Bonni	Scardifield	bscardifieldp@hc360.com
hberreyq	Hedvig	Berrey	hberreyq@friendfeed.com
vtrevillionr	Vidovik	Trevillion	vtrevillionr@discovery.com
fcestards	Freemon	Cestard	fcestards@studiopress.com
egleesont	Erick	Gleeson	egleesont@cpanel.net
skentonu	Stanwood	Kenton	skentonu@princeton.edu
dsperlingv	Dale	Sperling	dsperlingv@digg.com
nhuntleyw	Nancee	Huntley	nhuntleyw@redcross.org
cdemanchex	Chiquia	Demanche	cdemanchex@constantcontact.com
cnuthy	Claiborne	Nuth	cnuthy@freewebs.com
dstearleyz	Deborah	Stearley	dstearleyz@pagesperso-orange.fr
afiles10	Ashbey	Files	afiles10@youtu.be
griquet11	Gare	Riquet	griquet11@tripod.com
lgraybeal12	Lanny	Graybeal	lgraybeal12@indiatimes.com
bkingswoode13	Bertrando	Kingswoode	bkingswoode13@fc2.com
mpurcell14	Marinna	Purcell	mpurcell14@yelp.com
cbearblock15	Colleen	Bearblock	cbearblock15@instagram.com
jreeken16	Josi	Reeken	jreeken16@hugedomains.com
nbasil17	Noell	Basil	nbasil17@bbc.co.uk
ddenkin18	Deloris	Denkin	ddenkin18@independent.co.uk
eleyre19	Emilia	Leyre	eleyre19@dell.com
cshillom1a	Carleen	Shillom	cshillom1a@google.com.au
bstanaway1b	Bernard	Stanaway	bstanaway1b@tumblr.com
aridgwell1c	Ailee	Ridgwell	aridgwell1c@ed.gov
mbennington1d	Marinna	Bennington	mbennington1d@reference.com
aburvill1e	Antonia	Burvill	aburvill1e@drupal.org
chullins1f	Catriona	Hullins	chullins1f@ucoz.com
rgilffilland1g	Rochell	Gilffilland	rgilffilland1g@reverbnation.com
kexrol1h	Kirk	Exrol	kexrol1h@bravesites.com
jruoff1i	Janeva	Ruoff	jruoff1i@abc.net.au
rtamsett1j	Robb	Tamsett	rtamsett1j@boston.com
selwill1k	Skell	Elwill	selwill1k@ameblo.jp
obrave1l	Othilia	Brave	obrave1l@salon.com
ecapron1m	Elyssa	Capron	ecapron1m@blogger.com
aperutto1n	Anselm	Perutto	aperutto1n@jalbum.net
sfevier1o	Sallyanne	Fevier	sfevier1o@cyberchimps.com
rdavidoff1p	Rockey	Davidoff	rdavidoff1p@cnbc.com
beatock1q	Benedetto	Eatock	beatock1q@squarespace.com
npedreschi1r	Nolana	Pedreschi	npedreschi1r@a8.net
tburgoin1s	Tommy	Burgoin	tburgoin1s@facebook.com
fofallon1t	Faunie	O'Fallon	fofallon1t@nationalgeographic.com
awardle1u	Arnold	Wardle	awardle1u@marketwatch.com
sjermy1v	Sosanna	Jermy	sjermy1v@fc2.com
ggligorijevic1w	Gerhardt	Gligorijevic	ggligorijevic1w@unicef.org
rbayston1x	Remus	Bayston	rbayston1x@jalbum.net
awarrior1y	Andrea	Warrior	awarrior1y@census.gov
nlammers1z	Nisse	Lammers	nlammers1z@msu.edu
kmeriot20	Kimberly	Meriot	kmeriot20@cnet.com
rmully21	Rosetta	Mully	rmully21@wikia.com
pmikalski22	Prue	Mikalski	pmikalski22@ft.com
mantonijevic23	Marylou	Antonijevic	mantonijevic23@digg.com
obankes24	Odessa	Bankes	obankes24@smh.com.au
hgrainger25	Hall	Grainger	hgrainger25@bigcartel.com
avardy26	Adelbert	Vardy	avardy26@princeton.edu
hpirazzi27	Henka	Pirazzi	hpirazzi27@twitpic.com
gsyder28	Gaylor	Syder	gsyder28@joomla.org
eilchenko29	Elicia	Ilchenko	eilchenko29@columbia.edu
mkinzett2a	Mari	Kinzett	mkinzett2a@twitter.com
pfielder2b	Peyter	Fielder	pfielder2b@ihg.com
rferrolli2c	Roscoe	Ferrolli	rferrolli2c@techcrunch.com
ldillicate2d	Ly	Dillicate	ldillicate2d@moonfruit.com
bstedson2e	Bartram	Stedson	bstedson2e@discuz.net
sluetkemeyer2f	Suzi	Luetkemeyer	sluetkemeyer2f@theglobeandmail.com
terswell2g	Tobiah	Erswell	terswell2g@yandex.ru
rkobisch2h	Ryan	Kobisch	rkobisch2h@mit.edu
bcalladine2i	Bertie	Calladine	bcalladine2i@cbsnews.com
sstooders2j	Sula	Stooders	sstooders2j@house.gov
inockells2k	Isidro	Nockells	inockells2k@t-online.de
jsleep2l	Johannes	Sleep	jsleep2l@wikimedia.org
bravenscraft2m	Branden	Ravenscraft	bravenscraft2m@gravatar.com
cwick2n	Cornelle	Wick	cwick2n@hatena.ne.jp
jspritt2o	Jeanine	Spritt	jspritt2o@fda.gov
fyarmouth2p	Fanchon	Yarmouth	fyarmouth2p@adobe.com
ibixley2q	Ivory	Bixley	ibixley2q@jiathis.com
mrowsell2r	Melonie	Rowsell	mrowsell2r@so-net.ne.jp
ababel1	Arnav	Babel	ababel1@asu.edu
\.


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: arnav
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- PostgreSQL database dump complete
--

\unrestrict 5erjF3Cji7j7SLFhKb4XTM3U9zZ6ARUZCJSZP02xG4Iful3oSHauJZ1joUHhrpr

