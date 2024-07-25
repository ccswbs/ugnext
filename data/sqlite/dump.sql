PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "programs_undergraduate"
(
    id      TEXT PRIMARY KEY not null,
    title   TEXT not null,
    acronym TEXT,
    url     TEXT not null,
    degrees TEXT,
    types   TEXT not null,
    tags    TEXT
);
INSERT INTO programs_undergraduate VALUES('agriculture','Agriculture','AGRS','https://www.uoguelph.ca/programs/bachelor-of-science-in-agriculture/','["Bachelor of Science in Agriculture"]','["major","minor","co-op"]','["agriculture","botany","bioscience"]');
INSERT INTO programs_undergraduate VALUES('animal-biology','Animal Biology','ABIO','https://www.uoguelph.ca/programs/animal-biology/','["Bachelor of Science"]','["major"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('animal-science','Animal Science','ANSC','https://www.uoguelph.ca/programs/animal-science/','["Bachelor of Science in Agriculture"]','["major","co-op"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('anthropology','Anthropology','ANTH','https://www.uoguelph.ca/programs/anthropology/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["poli*","cultur*","human","socio*","antho*","public","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('applied-geomatics','Applied Geomatics','AG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/applied-geomatics-ag/','[]','["minor"]','["geography","technology"]');
INSERT INTO programs_undergraduate VALUES('applied-human-nutrition','Applied Human Nutrition','AHN','https://www.uoguelph.ca/programs/applied-human-nutrition/','["Bachelor of Applied Science"]','["major"]','["health","diet*","nutrition*","food"]');
INSERT INTO programs_undergraduate VALUES('art-history','Art History','ARTH','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/art-history-arth/','["Bachelor of Arts"]','["major","minor"]','["arts","history"]');
INSERT INTO programs_undergraduate VALUES('arts-and-sciences','Arts and Sciences','AS','https://www.uoguelph.ca/programs/bachelor-of-arts-and-sciences/','["Bachelor of Arts and Sciences"]','["major"]','["science","arts"]');
INSERT INTO programs_undergraduate VALUES('arts-management','Arts Management','AM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/arts-management-am/','[]','["minor"]','["arts","business"]');
INSERT INTO programs_undergraduate VALUES('bio-medical-science','Bio-Medical Science','BIOM','https://www.uoguelph.ca/programs/biomedical-science/','["Bachelor of Science"]','["major"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*","cogniti*","diet*"]');
INSERT INTO programs_undergraduate VALUES('biochemistry','Biochemistry','BIOC','https://www.uoguelph.ca/programs/biochemistry/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biochem*","chem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","clinic*","patho*","pharma*"]');
INSERT INTO programs_undergraduate VALUES('biological-and-pharmaceutical-chemistry','Biological and Pharmaceutical Chemistry','BPCH','https://www.uoguelph.ca/programs/biological-and-pharmaceutical-chemistry/','["Bachelor of Science"]','["major","co-op"]','["biology","chemistry","health","medical","science"]');
INSERT INTO programs_undergraduate VALUES('biological-engineering','Biological Engineering','BIOE','https://www.uoguelph.ca/programs/biological-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["biology","engineering","science","chemistry"]');
INSERT INTO programs_undergraduate VALUES('biological-science','Biological Science','BIOS','https://www.uoguelph.ca/programs/biological-science/','["Bachelor of Science"]','["major"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","natur*","ecol*","wild*","cell*","biodivers*","conserva*","animal*","enviro*","medic*","biomolecu*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","sustain*","mammal*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*","cogniti*","diet*"]');
INSERT INTO programs_undergraduate VALUES('biology','Biology','BIOL','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/biology-biol/','[]','["minor"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('biomedical-engineering','Biomedical Engineering','BME','https://www.uoguelph.ca/programs/biomedical-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["biology","engineering","science"]');
INSERT INTO programs_undergraduate VALUES('biomedical-toxicology','Biomedical Toxicology','BTOX','https://www.uoguelph.ca/programs/biomedical-toxicology/','["Bachelor of Science"]','["major","co-op"]','["biology","health","medical","science","biochemistry","pharmacology"]');
INSERT INTO programs_undergraduate VALUES('biotechnology','Biotechnology','BIOT','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/biotechnology-biot/','[]','["minor"]','["biology","science","technology"]');
INSERT INTO programs_undergraduate VALUES('black-canadian-studies','Black Canadian Studies','BLCK','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/black-canadian-studies-blck/','[]','["minor"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('business','Business','BUS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-bus/','[]','["minor"]','["business","finance"]');
INSERT INTO programs_undergraduate VALUES('business-data-analytics','Business Data Analytics','BDA','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-data-analytics-bda/','[]','["minor"]','["business","finance","statistics"]');
INSERT INTO programs_undergraduate VALUES('business-economics','Business Economics','BECN','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-economics-becn/','[]','["minor"]','["business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('chemistry','Chemistry','CHEM','https://www.uoguelph.ca/programs/chemistry/','["Bachelor of Science"]','["major","co-op","minor"]','["chemistry","science","chemical physics","nanoscience"]');
INSERT INTO programs_undergraduate VALUES('child-studies','Child Studies','CSTU','https://www.uoguelph.ca/programs/child-studies/','["Bachelor of Applied Science"]','["major"]','["child*","youth","educat*","teach*","early","relation*","socio*","social","cultur*","psych*","sex*","health","family","pedagog*"]');
INSERT INTO programs_undergraduate VALUES('classical-studies','Classical Studies','CLAS','https://www.uoguelph.ca/programs/classical-studies/','["Bachelor of Arts"]','["major","minor"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('computer-engineering','Computer Engineering','CENG','https://www.uoguelph.ca/programs/computer-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["technology","engineering","programming","computer science","artificial intelligence","ai","design"]');
INSERT INTO programs_undergraduate VALUES('computer-science','Computer Science','CS','https://www.uoguelph.ca/programs/computer-science/','["Bachelor of Computing"]','["major","co-op"]','["technology","programming","engineering","software development","software engineering","software","web development","artificial intelligence","ai","mathematics","software design","data","analytics"]');
INSERT INTO programs_undergraduate VALUES('creative-writing','Creative Writing','CW','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/creative-writing-cw/','["Bachelor of Arts"]','["major","minor"]','["arts"]');
INSERT INTO programs_undergraduate VALUES('criminal-justice-and-public-policy','Criminal Justice and Public Policy','CJPP','https://www.uoguelph.ca/programs/criminal-justice-and-public-policy/','["Bachelor of Arts"]','["major","co-op","minor"]','["poli*","crim*","govern*","law","power","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('crop-science','Crop Science','CRSC','https://www.uoguelph.ca/programs/crop-science/','["Bachelor of Science in Agriculture"]','["major","co-op"]','["agriculture","botany","bioscience","science"]');
INSERT INTO programs_undergraduate VALUES('culture-and-technology-studies','Culture and Technology Studies','CTS','https://www.uoguelph.ca/programs/culture-and-technology-studies/','["Bachelor of Arts"]','["major","co-op","minor"]','["humanities","technology","culture"]');
INSERT INTO programs_undergraduate VALUES('ecology','Ecology','ECOL','https://www.uoguelph.ca/programs/ecology/','["Bachelor of Science in Environmental Sciences"]','["major","co-op","minor"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('economics','Economics','ECON','https://www.uoguelph.ca/programs/economics/','["Bachelor of Arts"]','["major","co-op","minor"]','["business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('engineering-systems-and-computing','Engineering Systems and Computing','ESC','https://www.uoguelph.ca/programs/engineering-systems-and-computing/','["Bachelor of Engineering"]','["major","co-op"]','["technology","engineering","programming","software","software engineering","artificial intelligence","ai","web development","software design"]');
INSERT INTO programs_undergraduate VALUES('english','English','ENGL','https://www.uoguelph.ca/programs/english/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('entrepreneurship','Entrepreneurship','ENT','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/entrepreneurship-ent/','[]','["minor"]','["business","finance"]');
INSERT INTO programs_undergraduate VALUES('environment-and-resource-management','Environment and Resource Management','ERM','https://www.uoguelph.ca/programs/environment-and-resource-management/','["Bachelor of Science in Environmental Sciences"]','["major","co-op"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","science"]');
INSERT INTO programs_undergraduate VALUES('environmental-biology','Environmental Biology','ENVB','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-biology-envb/','["Bachelor of Science"]','["major"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('environmental-economics-and-policy','Environmental Economics and Policy','EEP','https://www.uoguelph.ca/programs/environmental-economics-and-policy/','["Bachelor of Science in Environmental Sciences"]','["major","co-op"]','["business","finance","economics","science"]');
INSERT INTO programs_undergraduate VALUES('environmental-engineering','Environmental Engineering','ENVE','https://www.uoguelph.ca/programs/environmental-engineering/','["Bachelor of Engineering"]','["major","co-op","minor"]','["engineering","science"]');
INSERT INTO programs_undergraduate VALUES('environmental-geomatics','Environmental Geomatics','EG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-geomatics-eg/','["Bachelor of Science"]','["major","co-op"]','["geography","technology","science"]');
INSERT INTO programs_undergraduate VALUES('environmental-governance','Environmental Governance','EGOV','https://www.uoguelph.ca/programs/environmental-governance/','["Bachelor of Arts"]','["major","co-op"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","poli*"]');
INSERT INTO programs_undergraduate VALUES('environmental-management','Environmental Management','EM','https://www.uoguelph.ca/programs/environmental-management/','["Bachelor of Bio-Resource Management"]','["major","co-op"]','["business"]');
INSERT INTO programs_undergraduate VALUES('environmental-sciences','Environmental Sciences','ENVS','https://www.uoguelph.ca/programs/environmental-sciences/','["Bachelor of Science in Environmental Sciences"]','["major","co-op"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('equine-management','Equine Management','EQM','https://www.uoguelph.ca/programs/equine-management/','["Bachelor of Bio-Resource Management"]','["major","co-op"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('european-culture-and-civilization','European Culture and Civilization','ECC','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/european-culture-civilization-ecc/','[]','["minor"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('european-studies','European Studies','EURS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/european-studies-eurs/','["Bachelor of Arts"]','["major"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('family-and-child-studies','Family and Child Studies','FCS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/family-child-studies-fcs/','[]','["minor"]','["humanities"]');
INSERT INTO programs_undergraduate VALUES('family-studies-and-human-development','Family Studies and Human Development','FSHD','https://www.uoguelph.ca/programs/family-studies-and-human-development/','["Bachelor of Applied Science"]','["major"]','["child*","youth","adult","life","relation*","cultur*","psych*","socio*","development","gerontology","aging","sex*","health"]');
INSERT INTO programs_undergraduate VALUES('food-and-agricultural-business','Food and Agricultural Business','FAB','https://www.uoguelph.ca/programs/food-and-agricultural-business/','["Bachelor of Commerce"]','["major","co-op"]','["agriculture","food","business"]');
INSERT INTO programs_undergraduate VALUES('food-engineering','Food Engineering','FENG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/food-engineering-feng/','[]','["minor"]','["food","engineering"]');
INSERT INTO programs_undergraduate VALUES('food-industry-management','Food Industry Management','FIM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/food-industry-management-fim/','["Bachelor of Bio-Resource Management"]','["major","co-op"]','["food","business","management"]');
INSERT INTO programs_undergraduate VALUES('food-science','Food Science','FOOD','https://www.uoguelph.ca/programs/food-science/','["Bachelor of Science"]','["major","co-op"]','["food","science"]');
INSERT INTO programs_undergraduate VALUES('food-agricultural-and-resource-economics','Food, Agricultural and Resource Economics','FARE','https://www.uoguelph.ca/programs/food-agricultural-resource-economics/','["Bachelor of Arts"]','["major","co-op"]','["agriculture","food","business","economics"]');
INSERT INTO programs_undergraduate VALUES('french-studies','French Studies','FREN','https://www.uoguelph.ca/programs/french-studies/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('geography','Geography','GEOG','https://www.uoguelph.ca/programs/geography/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","science"]');
INSERT INTO programs_undergraduate VALUES('german','German','GERM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/german-germ/','[]','["minor"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('government-economics-and-management','Government, Economics and Management','GEM','https://www.uoguelph.ca/programs/government-economics-and-management/','["Bachelor of Commerce"]','["major","co-op"]','["business","economics","politics","management","law"]');
INSERT INTO programs_undergraduate VALUES('history','History','HIST','https://www.uoguelph.ca/programs/history/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["humanities","history"]');
INSERT INTO programs_undergraduate VALUES('horticulture','Horticulture','HRT','https://www.uoguelph.ca/programs/horticulture/','["Bachelor of Science in Agriculture"]','["major","co-op"]','["agriculture","botany","bioscience","science"]');
INSERT INTO programs_undergraduate VALUES('hospitality-and-tourism-management','Hospitality and Tourism Management','HTM','https://www.uoguelph.ca/programs/hospitality-and-tourism-management/','["Bachelor of Commerce"]','["major","co-op"]','["business","tourism","management"]');
INSERT INTO programs_undergraduate VALUES('human-kinetics','Human Kinetics','HK','https://www.uoguelph.ca/programs/human-kinetics/','["Bachelor of Science"]','["major"]','["biol*","science*","life*","living","research*","biomedic*","health*","cell*","medic*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","immun*","virolog*","virus","infect*","dna","diet*"]');
INSERT INTO programs_undergraduate VALUES('human-resources','Human Resources','HR','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/human-resources-hr/','[]','["minor"]','["business","management"]');
INSERT INTO programs_undergraduate VALUES('indigenous-environmental-science-and-practice','Indigenous Environmental Science and Practice','IESP','https://www.uoguelph.ca/programs/bachelor-of-indigenous-environmental-science-and-practice/','["Bachelor of Indigenous Environmental Science and Practice"]','["major"]','["humanities","culture","science"]');
INSERT INTO programs_undergraduate VALUES('international-business','International Business','IB','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/international-business-ib/','[]','["minor"]','["business"]');
INSERT INTO programs_undergraduate VALUES('international-development-studies','International Development Studies','IDS','https://www.uoguelph.ca/programs/international-development-studies/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["poli*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","govern*"]');
INSERT INTO programs_undergraduate VALUES('italian','Italian','ITAL','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/italian-ital/','[]','["minor"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('justice-and-legal-studies','Justice and Legal Studies','JLS','https://www.uoguelph.ca/programs/justice-and-legal-studies/','["Bachelor of Arts"]','["major","co-op"]','["poli*","crim*","govern*","law","power","public","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('landscape-architecture','Landscape Architecture','LA','https://www.uoguelph.ca/programs/bachelor-of-landscape-architecture/','["Bachelor of Landscape Architecture"]','["major"]','["architecture","design"]');
INSERT INTO programs_undergraduate VALUES('linguistics','Linguistics','LING','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/linguistics-ling/','[]','["minor"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('management','Management','MGMT','https://www.uoguelph.ca/programs/management/','["Bachelor of Commerce"]','["major","co-op"]','["business","management"]');
INSERT INTO programs_undergraduate VALUES('management-economics-and-finance','Management Economics and Finance','MEF','https://www.uoguelph.ca/programs/management-economics-and-finance/','["Bachelor of Commerce"]','["major","co-op"]','["business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('marine-and-freshwater-biology','Marine and Freshwater Biology','MFB','https://www.uoguelph.ca/programs/marine-and-freshwater-biology/','["Bachelor of Science"]','["major","co-op"]','["biol*","science*","life*","living","research*","natur*","ecol*","wild*","biodivers*","conserva*","animal*","enviro*","ocean*","aqua*","fish*","sustain*","mammal*","sea*","water*","evolution*"]');
INSERT INTO programs_undergraduate VALUES('marketing','Marketing','MKTG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/marketing-mktg/','[]','["minor"]','["business","marketing"]');
INSERT INTO programs_undergraduate VALUES('marketing-management','Marketing Management','MKMN','https://www.uoguelph.ca/programs/marketing-management/','["Bachelor of Commerce"]','["major","co-op"]','["business","marketing"]');
INSERT INTO programs_undergraduate VALUES('mathematical-economics','Mathematical Economics','MAEC','https://www.uoguelph.ca/programs/mathematical-economics/','["Bachelor of Arts"]','["major","co-op"]','["business","economics","mathematics"]');
INSERT INTO programs_undergraduate VALUES('bachelor-of-mathematics','Bachelor of Mathematics','BMATH','https://www.uoguelph.ca/programs/bachelor-of-mathematics/','["Bachelor of Mathematics"]','["major","minor"]','["mathematics","artificial intelligence","ai","data","analytics"]');
INSERT INTO programs_undergraduate VALUES('mathematics','Mathematics','MATH','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/mathematics-math/','["Bachelor of Arts"]','["minor","area-of-concentration"]','["mathematics"]');
INSERT INTO programs_undergraduate VALUES('mechanical-engineering','Mechanical Engineering','MECH','https://www.uoguelph.ca/programs/mechanical-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["robotics","design"]');
INSERT INTO programs_undergraduate VALUES('media-and-cinema-studies','Media and Cinema Studies','MCST','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/media-cinema-studies-mcst/','[]','["minor"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('microbiology','Microbiology','MICR','https://www.uoguelph.ca/programs/microbiology/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna"]');
INSERT INTO programs_undergraduate VALUES('molecular-biology-and-genetics','Molecular Biology and Genetics','MBG','https://www.uoguelph.ca/programs/molecular-biology-and-genetics/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","biodivers*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*"]');
INSERT INTO programs_undergraduate VALUES('museum-studies','Museum Studies','MS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/museum-studies-ms/','[]','["minor"]','["humanities","arts","culture","history"]');
INSERT INTO programs_undergraduate VALUES('music','Music','MUSC','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/music-musc/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('neuroscience','Neuroscience','NEUR','https://www.uoguelph.ca/programs/neuroscience/','["Bachelor of Science"]','["major","co-op","minor"]','["psych*","neuro*","brain","cogni*","human","behav*"]');
INSERT INTO programs_undergraduate VALUES('nutritional-and-nutraceutical-sciences','Nutritional and Nutraceutical Sciences','NANS','https://www.uoguelph.ca/programs/nutritional-and-nutraceutical-sciences/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biomedic*","health*","medic*","biomolecu*","physi*","kinesio*","disease","clinic*","patho*","exercise","nutri*","micro*","pharma*","diet*","nutraceut*","food","supplement*"]');
INSERT INTO programs_undergraduate VALUES('one-health','One Health','ONEH','https://www.uoguelph.ca/programs/bachelor-of-one-health/','["Bachelor of One Health"]','["major","minor"]','["health","science","biology"]');
INSERT INTO programs_undergraduate VALUES('philosophy','Philosophy','PHIL','https://www.uoguelph.ca/programs/philosophy/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities"]');
INSERT INTO programs_undergraduate VALUES('physical-science','Physical Science','PSCI','https://www.uoguelph.ca/programs/physical-science/','["Bachelor of Science"]','["major"]','["science","physics","chemistry","math","space","quantum","quantum mechanics","medical physics"]');
INSERT INTO programs_undergraduate VALUES('physics','Physics','PHYS','https://www.uoguelph.ca/programs/physics/','["Bachelor of Science"]','["major","co-op","minor"]','["physics","science","math","space","quantum","quantum mechanics","medical physics","theoretical physics","chemical physics","nanoscience","bio medical physics"]');
INSERT INTO programs_undergraduate VALUES('plant-science','Plant Science','PLSC','https://www.uoguelph.ca/programs/plant-science/','["Bachelor of Science"]','["major","co-op","minor"]','["agriculture","biology","science"]');
INSERT INTO programs_undergraduate VALUES('political-science','Political Science','POLS','https://www.uoguelph.ca/programs/political-science/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["poli*","crim*","govern*","law","power","justice","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('project-management','Project Management','PM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/project-management-pm/','[]','["minor"]','["business","management"]');
INSERT INTO programs_undergraduate VALUES('psychology','Psychology','PSYC','https://www.uoguelph.ca/programs/psychology/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["psych*","neuro*","brain","cogni*","human","behav*","cultur*"]');
INSERT INTO programs_undergraduate VALUES('real-estate','Real Estate','RE','https://www.uoguelph.ca/programs/real-estate/','["Bachelor of Commerce"]','["major","co-op"]','["marketing","business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('sexualities-genders-and-social-change','Sexualities, Genders and Social Change','SXGN','https://www.uoguelph.ca/programs/sexualities-genders-and-social-change/','["Bachelor of Arts"]','["major","minor"]','["humanities","culture"]');
INSERT INTO programs_undergraduate VALUES('sociology','Sociology','SOC','https://www.uoguelph.ca/programs/sociology/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["poli*","crim*","govern*","law","power","institution*","affairs","socio*","justice","public"]');
INSERT INTO programs_undergraduate VALUES('software-engineering','Software Engineering','SENG','https://www.uoguelph.ca/programs/software-engineering/','["Bachelor of Computing"]','["major","co-op"]','["programming","technology","engineering","web development","computer science","artificial intelligence","ai","software design"]');
INSERT INTO programs_undergraduate VALUES('spanish-and-hispanic-studies','Spanish and Hispanic Studies','SPAH','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/spanish-hispanic-studies-spah/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","language","culture"]');
INSERT INTO programs_undergraduate VALUES('sport-and-event-management','Sport and Event Management','SPMT','https://www.uoguelph.ca/programs/sport-and-event-management/','["Bachelor of Commerce"]','["major","co-op","minor"]','["business","management","sports"]');
INSERT INTO programs_undergraduate VALUES('statistics','Statistics','STAT','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/statistics-stat/','["Bachelor of Arts"]','["minor","area-of-concentration"]','["mathematics","statistics"]');
INSERT INTO programs_undergraduate VALUES('studio-art','Studio Art','SART','https://www.uoguelph.ca/programs/studio-art/','["Bachelor of Arts"]','["major","minor"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('sustainable-business','Sustainable Business','SB','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/sustainable-business-sb/','[]','["minor"]','["business"]');
INSERT INTO programs_undergraduate VALUES('theatre-studies','Theatre Studies','THST','https://www.uoguelph.ca/programs/theatre-studies/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('veterinary-medicine','Veterinary Medicine','VM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/veterinary-medicine-vm/','["Doctor of Veterinary Medicine"]','["major"]','["health","science","biology"]');
INSERT INTO programs_undergraduate VALUES('water-resources-engineering','Water Resources Engineering','WRE','https://www.uoguelph.ca/programs/water-resources-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["engineering"]');
INSERT INTO programs_undergraduate VALUES('wildlife-biology-and-conservation','Wildlife Biology and Conservation','WBC','https://www.uoguelph.ca/programs/wildlife-biology-and-conservation/','["Bachelor of Science"]','["major","co-op"]','["biol*","science*","life*","living","research*","natur*","ecol*","wild*","biodivers*","conserva*","animal*","enviro*","ocean*","aqua*","fish*","sustain*","mammal*","sea*","water*","evolution*"]');
INSERT INTO programs_undergraduate VALUES('zoology','Zoology','ZOO','https://www.uoguelph.ca/programs/zoology/','["Bachelor of Science"]','["major","minor"]','["biol*","science*","life*","living","research*","natur*","ecol*","wild*","biodivers*","conserva*","animal*","enviro*","fish*","sustain*","mammal*","evolution*","dna"]');
CREATE TABLE IF NOT EXISTS "programs_graduate"
(
    id      TEXT PRIMARY KEY not null,
    title   TEXT not null,
    url     TEXT not null,
    degrees TEXT,
    types   TEXT not null,
    tags    TEXT
);
INSERT INTO programs_graduate VALUES('accounting','Accounting','https://graduatestudies.uoguelph.ca/programs/accounting','["Graduate Diploma"]','["course-based"]','["business","finance"]');
INSERT INTO programs_graduate VALUES('animal-biosciences','Animal Biosciences','https://graduatestudies.uoguelph.ca/programs/aps','["MSc","PhD"]','["thesis-based","course-based"]','["biology","science"]');
INSERT INTO programs_graduate VALUES('applied-nutrition','Applied Nutrition','https://graduatestudies.uoguelph.ca/programs/applied-nutrition','["MAN"]','["course-based"]','["health","food"]');
INSERT INTO programs_graduate VALUES('art-history-and-visual-culture','Art History and Visual Culture','https://graduatestudies.uoguelph.ca/programs/avc','["MA"]','["thesis-based","course-based"]','["arts","culture","history"]');
INSERT INTO programs_graduate VALUES('artificial-intelligence','Artificial Intelligence','https://graduatestudies.uoguelph.ca/programs/csai','["MSc","MASc"]','["collaborative-specialization"]','["technology","science","mathematics","programming","ai"]');
INSERT INTO programs_graduate VALUES('bioinformatics','Bioinformatics','https://graduatestudies.uoguelph.ca/programs/binf','["MBINF","MSc","PhD"]','["course-based"]','["biol*","science*","life*","living","research*","informat*","data","statistic*","programming","analys*"]');
INSERT INTO programs_graduate VALUES('biomedical-sciences','Biomedical Sciences','https://graduatestudies.uoguelph.ca/programs/biom','["MBS","MSc","PhD","DVSc"]','["course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('biophysics','Biophysics','https://graduatestudies.uoguelph.ca/programs/biop','["MSc","PhD"]','["thesis-based"]','["biology","physics","science"]');
INSERT INTO programs_graduate VALUES('biotechnology','Biotechnology','https://graduatestudies.uoguelph.ca/programs/biotechnology','["MBIOT"]','["course-based"]','["biology","science","technology"]');
INSERT INTO programs_graduate VALUES('business-administration','Business Administration','https://graduatestudies.uoguelph.ca/programs/bus','["MBA"]','["course-based"]','["business"]');
INSERT INTO programs_graduate VALUES('capacity-development-and-extension','Capacity Development and Extension','https://graduatestudies.uoguelph.ca/programs/cde','["MSc"]','["thesis-based","course-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('chemistry','Chemistry','https://graduatestudies.uoguelph.ca/programs/chbi','["MSc","PhD"]','["thesis-based"]','["chemistry","science"]');
INSERT INTO programs_graduate VALUES('clinical-studies','Clinical Studies','https://graduatestudies.uoguelph.ca/programs/clin','["MSc","DVSc"]','["thesis-based","course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('computational-sciences','Computational Sciences','https://graduatestudies.uoguelph.ca/programs/computational-science-phd','["PhD"]','["course-based"]','["technology","science","mathematics"]');
INSERT INTO programs_graduate VALUES('computer-science','Computer Science','https://graduatestudies.uoguelph.ca/programs/cis','["MSc","PhD"]','["thesis-based"]','["technology","science","mathematics","programming"]');
INSERT INTO programs_graduate VALUES('conservation-leadership','Conservation Leadership','https://graduatestudies.uoguelph.ca/Programs/ConservationLeadership','["MCL"]','["course-based"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","science"]');
INSERT INTO programs_graduate VALUES('creative-writing','Creative Writing','https://graduatestudies.uoguelph.ca/programs/crwr','["MFA"]','["course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('criminology-and-criminal-justice-policy','Criminology and Criminal Justice Policy','https://graduatestudies.uoguelph.ca/programs/ccjp','["MA"]','["course-based","thesis-based"]','["poli*","crim*","govern*","law","power","public","affairs","socio*"]');
INSERT INTO programs_graduate VALUES('critical-studies-in-improvisation','Critical Studies in Improvisation','https://graduatestudies.uoguelph.ca/programs/impr','["MA","PhD"]','["course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('cybersecurity-and-threat-intelligence','Cybersecurity and Threat Intelligence','https://graduatestudies.uoguelph.ca/programs/mcti','["MCTI"]','["course-based"]','["technology","science","mathematics","programming"]');
INSERT INTO programs_graduate VALUES('data-science','Data Science','https://graduatestudies.uoguelph.ca/programs/data-science','["MDS"]','["course-based"]','["technology","statistics","mathematics","programming","artificial intelligence","ai"]');
INSERT INTO programs_graduate VALUES('economics','Economics','https://graduatestudies.uoguelph.ca/programs/econ','["MA","PhD"]','["course-based"]','["business","economics","finance"]');
INSERT INTO programs_graduate VALUES('engineering','Engineering','https://graduatestudies.uoguelph.ca/programs/engg','["MEng","MASc","PhD"]','["course-based"]','["technology","engineering","artificial intelligence","ai"]');
INSERT INTO programs_graduate VALUES('english','English','https://graduatestudies.uoguelph.ca/programs/engl','["MA"]','["thesis-based"]','["arts","humanities","language"]');
INSERT INTO programs_graduate VALUES('environmental-sciences','Environmental Sciences','https://graduatestudies.uoguelph.ca/programs/envs','["MES","MSc","PhD"]','["course-based"]','["biology","science"]');
INSERT INTO programs_graduate VALUES('european-studies','European Studies','https://graduatestudies.uoguelph.ca/programs/eurs','["MA"]','["course-based"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('family-relations-and-applied-nutrition','Family Relations and Applied Nutrition','https://graduatestudies.uoguelph.ca/programs/fran','["MAN","MSc","PhD"]','["course-based","thesis-based"]','["health","food","humanities","science"]');
INSERT INTO programs_graduate VALUES('food-safety-and-quality-assurance','Food Safety and Quality Assurance','https://graduatestudies.uoguelph.ca/programs/fsqu','["MSc","Graduate Diploma"]','["course-based"]','["food","science"]');
INSERT INTO programs_graduate VALUES('food-science','Food Science','https://graduatestudies.uoguelph.ca/programs/food','["MSc","PhD"]','["thesis-based"]','["food","science","nutrition"]');
INSERT INTO programs_graduate VALUES('food-agricultural-and-resource-economics','Food, Agricultural and Resource Economics','https://graduatestudies.uoguelph.ca/programs/fare','["MFARE","MSc","PhD"]','["course-based"]','["food","business","agriculture","economics"]');
INSERT INTO programs_graduate VALUES('french','French','https://graduatestudies.uoguelph.ca/programs/fren','["MA"]','["course-based"]','["humanities","language"]');
INSERT INTO programs_graduate VALUES('geography','Geography','https://graduatestudies.uoguelph.ca/programs/geog','["MA","MSc","PhD"]','["course-based","thesis-based"]','["geography","science"]');
INSERT INTO programs_graduate VALUES('history','History','https://graduatestudies.uoguelph.ca/programs/hist','["MA","PhD"]','["thesis-based"]','["humanities","history"]');
INSERT INTO programs_graduate VALUES('human-health-and-nutritional-sciences','Human Health and Nutritional Sciences','https://graduatestudies.uoguelph.ca/programs/hhns','["MSc","PhD"]','["thesis-based","course-based"]','["biol*","science*","life*","living","research*","biomedic*","health*","cell*","medic*","biomolecu*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","micro*","immun*","virolog*","virus","infect*","dna","pharma*","cogniti*","diet*"]');
INSERT INTO programs_graduate VALUES('integrative-biology','Integrative Biology','https://graduatestudies.uoguelph.ca/programs/ibio','["MSc","PhD"]','["thesis-based"]','["biol*","science*","life*","living","research*","natur*","eco*","wild*","biodivers*","conserva*","animal*","enviro*","sustain*","mammal*","evolution*"]');
INSERT INTO programs_graduate VALUES('international-development-studies','International Development Studies','https://graduatestudies.uoguelph.ca/programs/idev','["PhD","MSc","MA"]','["collaborative-specialization"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('landscape-architecture','Landscape Architecture','https://graduatestudies.uoguelph.ca/programs/ldar','["MLA"]','["course-based"]','["architecture","design"]');
INSERT INTO programs_graduate VALUES('latin-american-and-caribbean-studies','Latin American and Caribbean Studies','https://graduatestudies.uoguelph.ca/programs/lacs','["MA"]','["course-based"]','["humanities","culture","history"]');
INSERT INTO programs_graduate VALUES('leadership','Leadership','https://graduatestudies.uoguelph.ca/programs/lead','["MA"]','["course-based"]','["humanities","business"]');
INSERT INTO programs_graduate VALUES('literary-studies-theatre-studies-in-english','Literary Studies/Theatre Studies in English','https://graduatestudies.uoguelph.ca/programs/sets','["PhD"]','["thesis-based"]','["arts","humanities"]');
INSERT INTO programs_graduate VALUES('management','Management','https://graduatestudies.uoguelph.ca/programs/mgmt','["MSc","PhD"]','["course-based"]','["business","management"]');
INSERT INTO programs_graduate VALUES('market-research','Market Research','https://graduatestudies.uoguelph.ca/programs/marketresearch','["Graduate Diploma"]','["course-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('marketing-and-consumer-studies','Marketing and Consumer Studies','https://graduatestudies.uoguelph.ca/programs/cost','["MSc","Graduate Diploma"]','["thesis-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('mathematics-and-statistics','Mathematics and Statistics','https://graduatestudies.uoguelph.ca/programs/math','["MSc","PhD"]','["thesis-based"]','["mathematics","statistics","artificial intelligence","ai","data"]');
INSERT INTO programs_graduate VALUES('molecular-and-cellular-biology','Molecular and Cellular Biology','https://graduatestudies.uoguelph.ca/programs/mcb','["MSc","PhD"]','["thesis-based"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*"]');
INSERT INTO programs_graduate VALUES('neuroscience','Neuroscience','https://graduatestudies.uoguelph.ca/programs/neur','["MSc","PhD","MBS"]','["collaborative-specialization"]','["biol*","science*","life*","living","research*","neuro*","brain","cogniti*"]');
INSERT INTO programs_graduate VALUES('one-health','One Health','https://graduatestudies.uoguelph.ca/programs/onehealth','["MSc","PhD","MES","MA","MASc","MEng"]','["collaborative-specialization"]','["biol*","science*","life*","living","research*","natur*","eco*","wild*","biodivers*","conserva*","animal*","enviro*","sustain*","mammal*","evolution*","health*","medic*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","infect*","dna","pharma*"]');
INSERT INTO programs_graduate VALUES('pathobiology','Pathobiology','https://graduatestudies.uoguelph.ca/programs/path','["MSc","PhD","DVSc","Graduate Diploma"]','["thesis-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('philosophy','Philosophy','https://graduatestudies.uoguelph.ca/programs/phil','["MA","PhD"]','["course-based"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('physics','Physics','https://graduatestudies.uoguelph.ca/programs/phys','["MSc","PhD"]','["course-based","thesis-based"]','["physics","science"]');
INSERT INTO programs_graduate VALUES('planning','Planning','https://www.uoguelph.ca/programs/master-of-planning','["MPlan"]','["course-based"]','["humanities","geography","rural","environmental design"]');
INSERT INTO programs_graduate VALUES('political-science','Political Science','https://graduatestudies.uoguelph.ca/programs/pols','["MA","PhD"]','["course-based","thesis-based"]','["humanities","politics"]');
INSERT INTO programs_graduate VALUES('population-medicine','Population Medicine','https://graduatestudies.uoguelph.ca/programs/popmed','["MSc","PhD","DVSc"]','["thesis-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('project-management','Project Management','https://graduatestudies.uoguelph.ca/programs/project-management','["MPM","Graduate Diploma"]','["course-based"]','["business","management"]');
INSERT INTO programs_graduate VALUES('psychology','Psychology','https://graduatestudies.uoguelph.ca/programs/psyc','["MA","MSc","PhD"]','["thesis-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('public-health','Public Health','https://graduatestudies.uoguelph.ca/programs/phlt','["MPH","DVM/MPH Combined Degree","Graduate Diploma"]','["course-based"]','["health","medical","science","biology"]');
INSERT INTO programs_graduate VALUES('public-issues-anthropology','Public Issues Anthropology','https://graduatestudies.uoguelph.ca/programs/pia','["MA"]','["thesis-based"]','["poli*","cultur*","human","antho*","affairs","socio*"]');
INSERT INTO programs_graduate VALUES('regenerative-medicine','Regenerative Medicine','https://graduatestudies.uoguelph.ca/programs/regenerative-medicine','["MSc","PhD","DVSc","MASc","MBS"]','["collaborative-specialization"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*"]');
INSERT INTO programs_graduate VALUES('relational-and-psychotherapy-training-program','Relational and Psychotherapy Training Program','https://graduatestudies.uoguelph.ca/programs/relational-and-psychotherapy-training-program','["MP","MRFT","MA"]','["course-based"]','["health","medical","psychology"]');
INSERT INTO programs_graduate VALUES('rural-planning-and-development','Rural Planning and Development','https://graduatestudies.uoguelph.ca/programs/rpdprof','["MSc","MPLAN"]','["course-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('rural-studies','Rural Studies','https://graduatestudies.uoguelph.ca/programs/rpdprof-stu','["PhD"]','["thesis-based","course-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('sexuality-genders-and-bodies','Sexuality, Genders and Bodies','https://graduatestudies.uoguelph.ca/programs/Sexualities-Genders-And-Bodies','["MA","PhD","MSc"]','["collaborative-specialization"]','["poli*","indigen*","justice","feminis*","decolon*","interdisciplinary"]');
INSERT INTO programs_graduate VALUES('social-practice-and-transformational-change','Social Practice and Transformational Change','https://graduatestudies.uoguelph.ca/programs/sptc','["PhD"]','["thesis-based"]','["poli*","indigen*","justice","feminis*","decolon*","interdisciplinary","sex*","disab*","gender","lgb*","psych*","queer","socio*","anthro*","geograph*","family","relation*","critical"]');
INSERT INTO programs_graduate VALUES('sociology','Sociology','https://graduatestudies.uoguelph.ca/programs/soca','["MA","PhD"]','["thesis-based"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('studio-art','Studio Art','https://graduatestudies.uoguelph.ca/programs/sart','["MFA"]','["course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('sustainable-agriculture','Sustainable Agriculture','https://www.uoguelph.ca/programs/master-sustainable-agriculture/','["MSAg"]','["course-based"]','["agriculture","biology","science"]');
INSERT INTO programs_graduate VALUES('theatre-studies','Theatre Studies','https://graduatestudies.uoguelph.ca/programs/thst','["MA"]','["thesis-based","course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('tourism-and-hospitality','Tourism and Hospitality','https://graduatestudies.uoguelph.ca/programs/trmh','["MSc","Graduate Diploma"]','["thesis-based","course-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('tourism-research','Tourism Research','https://graduatestudies.uoguelph.ca/programs/tres','["Graduate Diploma"]','["course-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('toxicology','Toxicology','https://graduatestudies.uoguelph.ca/programs/tox','["MSc","PhD","MBS"]','["collaborative-specialization"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('veterinary-medicine-public-health','Veterinary Medicine / Public Health','https://graduatestudies.uoguelph.ca/programs/DVMMPH','["DVM","MPH"]','["course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('veterinary-science','Veterinary Science','https://graduatestudies.uoguelph.ca/programs/vets','["DVSc"]','["course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('wildlife-biology','Wildlife Biology','https://calendar.uoguelph.ca/graduate-calendar/graduate-programs/wildlife-biology/','["MWB"]','["course-based"]','["biol*","science*","life*","living","research*","natur*","eco*","wild*","biodivers*","conserva*","animal*","enviro*","fish*","sustain*","mammal*"]');
INSERT INTO programs_graduate VALUES('plant-agriculture','Plant Agriculture','https://graduatestudies.uoguelph.ca/programs/plnt','["MSc","PhD","MPAg"]','["course-based"]','["crops","crop science","biochemistry","plant genetics"]');
CREATE TABLE IF NOT EXISTS "programs_certificate_and_diplomas"
(
    id      TEXT PRIMARY KEY not null,
    title   TEXT not null,
    url     TEXT not null,
    types   TEXT not null,
    tags    TEXT
);
INSERT INTO programs_certificate_and_diplomas VALUES('accounting','Accounting','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/accounting-acct/','["certificate"]','["business","finance"]');
INSERT INTO programs_certificate_and_diplomas VALUES('agriculture','Agriculture','https://www.ridgetownc.com/future/dagr/','["associate-diploma","co-op"]','["agriculture","botany"]');
INSERT INTO programs_certificate_and_diplomas VALUES('business','Business','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-bus/','["certificate"]','["business","finance"]');
INSERT INTO programs_certificate_and_diplomas VALUES('environmental-citizenship','Environmental Citizenship','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-citizenship-ect/','["certificate"]','["humanities","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('environmental-conservation','Environmental Conservation','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-conservation-ecv/','["certificate"]','["biology","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('environmental-technician','Environmental Technician','https://www.ridgetownc.com/future/denm/','["associate-diploma","co-op"]','["agriculture","botany","environment"]');
INSERT INTO programs_certificate_and_diplomas VALUES('equine-care-management','Equine Care & Management','https://www.ridgetownc.com/future/denm/','["associate-diploma","co-op"]','["business","nutrition","animal","management"]');
INSERT INTO programs_certificate_and_diplomas VALUES('food-science','Food Science','https://www.uoguelph.ca/programs/food-science/','["certificate"]','["food","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('german-language-and-culture','German Language and Culture','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/german-germ/','["certificate"]','["humanities","language"]');
INSERT INTO programs_certificate_and_diplomas VALUES('horticulture','Horticulture','https://www.ridgetownc.com/future/dhrt/','["associate-diploma","co-op"]','["landscaping","botany","plant"]');
INSERT INTO programs_certificate_and_diplomas VALUES('hospitality-and-tourism-management','Hospitality and Tourism Management','https://www.uoguelph.ca/programs/hospitality-and-tourism-management/','["certificate"]','["business","tourism","management"]');
INSERT INTO programs_certificate_and_diplomas VALUES('indigenous-environmental-governance','Indigenous Environmental Governance','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/indigenous-environmental-governance-ieg/','["certificate"]','["humanities","culture"]');
INSERT INTO programs_certificate_and_diplomas VALUES('leadership','Leadership','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/leadership-lead/','["certificate"]','["humanities","management"]');
INSERT INTO programs_certificate_and_diplomas VALUES('organic-agriculture','Organic Agriculture','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/organic-agriculture-oagr/','["certificate"]','["agriculture","biology","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('public-policy-and-administration','Public Policy and Administration','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/public-policy-administration-ppa#certificatetext','["certificate"]','["humanities","politics","law"]');
INSERT INTO programs_certificate_and_diplomas VALUES('spanish-language-and-culture','Spanish Language and Culture','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/spanish-hispanic-studies-spah#certificatetext','["certificate"]','["humanities","language","culture"]');
INSERT INTO programs_certificate_and_diplomas VALUES('applied-statistics','Applied Statistics','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/statistics-stat#diplomatext','["diploma"]','["mathematics","statistics"]');
INSERT INTO programs_certificate_and_diplomas VALUES('turfgrass-management','Turfgrass Management','https://www.uoguelph.ca/programs/turfgrass-management/','["associate-diploma","co-op"]','["landscaping","botany","plant"]');
INSERT INTO programs_certificate_and_diplomas VALUES('veterinary-technology','Veterinary Technology','https://www.ridgetownc.com/future/dvt/','["associate-diploma"]','["animal","vet","biology"]');
CREATE TABLE IF NOT EXISTS "programs_continuing_education"
(
    id      TEXT PRIMARY KEY not null,
    title   TEXT not null,
    url     TEXT not null,
    types   TEXT not null,
    tags    TEXT
);
INSERT INTO programs_continuing_education VALUES('dairy-herdsperson-apprenticeship','Dairy Herdsperson Apprenticeship','https://www.ridgetownc.com/future/adh/','["apprenticeship"]','["agriculture","botany","animal"]');
INSERT INTO programs_continuing_education VALUES('ice-cream-technology','Ice Cream Technology','https://www.uoguelph.ca/foodscience/ice-cream-technology-short-course','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('cheese-making-technology','Cheese Making Technology','https://www.uoguelph.ca/foodscience/cheese-making-courses','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('beer-brewing','Beer Brewing','https://www.uoguelph.ca/foodscience/brewing','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('chocolate-science','Chocolate Science','https://www.uoguelph.ca/foodscience/chocolate','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('canadian-feed-industry-education-program','Canadian Feed Industry Education Program','https://courses.opened.uoguelph.ca/contentManagement.do?method=load&code=CM000063','["short-course"]','["livestock","animal","agriculture"]');
INSERT INTO programs_continuing_education VALUES('counselling-and-human-sexuality','Counselling and Human Sexuality','https://courses.opened.uoguelph.ca/contentManagement.do?method=load&code=CM000025','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('creative-writing','Creative Writing','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=583604','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('equine-studies','Equine Studies','https://courses.opened.uoguelph.ca/contentManagement.do?method=load&code=CM000020','["diploma"]','["horse","animal"]');
INSERT INTO programs_continuing_education VALUES('equine-science','Equine Science','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=610688','["certificate"]','["horse","animal"]');
INSERT INTO programs_continuing_education VALUES('equine-welfare','Equine Welfare','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=611375','["certificate"]','["horse","animal"]');
INSERT INTO programs_continuing_education VALUES('english-language-programs','English Language Programs','https://opened.uoguelph.ca/student-resources/guelph-elp','["certificate","short-course"]','["language"]');
INSERT INTO programs_continuing_education VALUES('environmental-citizenship','Environmental Citizenship','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=625466','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('environmental-conservation','Environmental Conservation','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=626394','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('dna-barcoding','DNA Barcoding','https://courses.opened.uoguelph.ca/public/category/programStream.do?method=load&selectedProgramAreaId=16994&selectedProgramStreamId=12732257','["short-course"]','[]');
INSERT INTO programs_continuing_education VALUES('advanced-principles-of-toxicology','Advanced Principles of Toxicology','https://courses.opened.uoguelph.ca/search/publicCourseSearchDetails.do?method=load&courseId=17780&selectedProgramAreaId=16994&selectedProgramStreamId=17127','["short-course"]','[]');
INSERT INTO programs_continuing_education VALUES('food-science','Food Science','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=655668','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('geographical-epidemiology','Geographical Epidemiology','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=655668','["short-course"]','[]');
INSERT INTO programs_continuing_education VALUES('plant-based-nutrition','Plant-Based Nutrition','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=29839235','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('horticulture-diploma','Horticulture','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=18118724&selectedProgramAreaId=16989&selectedProgramStreamId=','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('landscape-design-diploma','Landscape Design','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=18143026&selectedProgramAreaId=16989&selectedProgramStreamId=','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('horticulture-certificate','Horticulture','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=15952899&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('landscape-design-certificate','Landscape Design','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=18143158&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('maintaining-golf-courses','Maintaining Golf Courses','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=701097&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('sustainable-urban-agriculture','Sustainable Urban Agriculture','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=615989&selectedProgramAreaId=16975&selectedProgramStreamId=17124','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('sustainable-urban-horticulture','Sustainable Urban Horticulture','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=702165&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('turf-managers','Turf Managers','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=14958241','["short-course","certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('accounting','Accounting','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=26779164','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('business','Business','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=621077','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('disability-management','Disability Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129861','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('hospitality-studies','Hospitality Studies','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=627258','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('information-management-privacy-and-access','Information Management, Privacy and Access','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129924','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('leadership','Leadership','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=646478','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('supply-chain-management-for-public-procurement','Supply Chain Management for Public Procurement','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=474252','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('data-science','Data Science','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=8353906','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('human-resources-management','Human Resources Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=590230','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('advanced-interpersonal-skills-for-psw-practice','Advanced Interpersonal Skills for PSW Practice','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=34640456','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('facilities-management','Facilities Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129911','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('human-resources-management-for-school-board-administration','Human Resources Management for School Board Administration','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129911','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('information-and-communication-technology-management','Information and Communication Technology Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129941','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('pupil-transportation-management','Pupil Transportation Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=465245','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('school-board-administration','School Board Administration','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=605466','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('knowledge-mobilization','Knowledge Mobilization','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=453705','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('public-policy-and-administration','Public Policy and Administration','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=654157','["diploma"]','[]');
CREATE TABLE admission_requirements_student_types
(
    id    TEXT PRIMARY KEY NOT NULL,
    name  TEXT             NOT NULL,
    location_dependent INTEGER check (location_dependent in (TRUE, FALSE)) NOT NULL,
    program_dependent INTEGER check (program_dependent IN (TRUE, FALSE)) NOT NULL
);
INSERT INTO admission_requirements_student_types VALUES('high-school','High School Student/Graduate',1,1);
INSERT INTO admission_requirements_student_types VALUES('university','University Student/Graduate',0,1);
INSERT INTO admission_requirements_student_types VALUES('college','College Student/Graduate',0,1);
INSERT INTO admission_requirements_student_types VALUES('internal','Current or Previous University of Guelph Student',0,1);
INSERT INTO admission_requirements_student_types VALUES('mature','Mature Student',0,0);
INSERT INTO admission_requirements_student_types VALUES('home-schooled','Home Schooled Student',0,0);
CREATE TABLE admission_requirements_undergraduate
(
    student_type TEXT NULL,
    location TEXT NULL,
    program TEXT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(student_type) REFERENCES admission_requirements_student_types(id),
    FOREIGN KEY(location) REFERENCES admission_requirements_locations(name),
    FOREIGN KEY(program) REFERENCES programs_undergraduate(title),
    PRIMARY KEY(student_type, location, program)
);
CREATE TABLE IF NOT EXISTS "admission_requirements_locations"
(
    name TEXT not null,
    type TEXT not null,
    id   TEXT not null primary key,
    check (type IN ('domestic', 'international', 'curriculum'))
);
INSERT INTO admission_requirements_locations VALUES('Ontario','domestic','ontario');
INSERT INTO admission_requirements_locations VALUES('Alberta','domestic','alberta');
INSERT INTO admission_requirements_locations VALUES('British Columbia','domestic','british-columbia');
INSERT INTO admission_requirements_locations VALUES('Manitoba','domestic','manitoba');
INSERT INTO admission_requirements_locations VALUES('New Brunswick','domestic','new-brunswick');
INSERT INTO admission_requirements_locations VALUES('Newfoundland and Labrador','domestic','newfoundland-and-labrador');
INSERT INTO admission_requirements_locations VALUES('Nova Scotia','domestic','nova-scotia');
INSERT INTO admission_requirements_locations VALUES('Prince Edward Island','domestic','prince-edward-island');
INSERT INTO admission_requirements_locations VALUES('Quebec','domestic','quebec');
INSERT INTO admission_requirements_locations VALUES('Saskatchewan','domestic','saskatchewan');
INSERT INTO admission_requirements_locations VALUES('Afghanistan','international','afghanistan');
INSERT INTO admission_requirements_locations VALUES('Argentina','international','argentina');
INSERT INTO admission_requirements_locations VALUES('Austria','international','austria');
INSERT INTO admission_requirements_locations VALUES('Azerbaijan','international','azerbaijan');
INSERT INTO admission_requirements_locations VALUES('Bahrain','international','bahrain');
INSERT INTO admission_requirements_locations VALUES('Bahamas','international','bahamas');
INSERT INTO admission_requirements_locations VALUES('Bangladesh','international','bangladesh');
INSERT INTO admission_requirements_locations VALUES('Barbados','international','barbados');
INSERT INTO admission_requirements_locations VALUES('Bermuda','international','bermuda');
INSERT INTO admission_requirements_locations VALUES('Bolivia','international','bolivia');
INSERT INTO admission_requirements_locations VALUES('Botswana','international','botswana');
INSERT INTO admission_requirements_locations VALUES('Brazil','international','brazil');
INSERT INTO admission_requirements_locations VALUES('Cameroon','international','cameroon');
INSERT INTO admission_requirements_locations VALUES('Caribbean','international','caribbean');
INSERT INTO admission_requirements_locations VALUES('Chile','international','chile');
INSERT INTO admission_requirements_locations VALUES('China','international','china');
INSERT INTO admission_requirements_locations VALUES('Colombia','international','colombia');
INSERT INTO admission_requirements_locations VALUES('Costa Rica','international','costa-rica');
INSERT INTO admission_requirements_locations VALUES('Dominican Republic','international','dominican-republic');
INSERT INTO admission_requirements_locations VALUES('Ecuador','international','ecuador');
INSERT INTO admission_requirements_locations VALUES('Egypt','international','egypt');
INSERT INTO admission_requirements_locations VALUES('El Savador','international','el-savador');
INSERT INTO admission_requirements_locations VALUES('Ethiopia','international','ethiopia');
INSERT INTO admission_requirements_locations VALUES('France','international','france');
INSERT INTO admission_requirements_locations VALUES('Germany','international','germany');
INSERT INTO admission_requirements_locations VALUES('Ghana','international','ghana');
INSERT INTO admission_requirements_locations VALUES('Greece','international','greece');
INSERT INTO admission_requirements_locations VALUES('Guatemala','international','guatemala');
INSERT INTO admission_requirements_locations VALUES('Hong Kong','international','hong-kong');
INSERT INTO admission_requirements_locations VALUES('Haiti','international','haiti');
INSERT INTO admission_requirements_locations VALUES('India','international','india');
INSERT INTO admission_requirements_locations VALUES('Indonesia','international','indonesia');
INSERT INTO admission_requirements_locations VALUES('Iran','international','iran');
INSERT INTO admission_requirements_locations VALUES('Iraq','international','iraq');
INSERT INTO admission_requirements_locations VALUES('Ireland','international','ireland');
INSERT INTO admission_requirements_locations VALUES('Italy','international','italy');
INSERT INTO admission_requirements_locations VALUES('Japan','international','japan');
INSERT INTO admission_requirements_locations VALUES('Jamaica','international','jamaica');
INSERT INTO admission_requirements_locations VALUES('Jordan','international','jordan');
INSERT INTO admission_requirements_locations VALUES('Kazakhstan','international','kazakhstan');
INSERT INTO admission_requirements_locations VALUES('Kenya','international','kenya');
INSERT INTO admission_requirements_locations VALUES('Kuwait','international','kuwait');
INSERT INTO admission_requirements_locations VALUES('Latvia','international','latvia');
INSERT INTO admission_requirements_locations VALUES('Lebanon','international','lebanon');
INSERT INTO admission_requirements_locations VALUES('Libya','international','libya');
INSERT INTO admission_requirements_locations VALUES('Malaysia','international','malaysia');
INSERT INTO admission_requirements_locations VALUES('Mauritius','international','mauritius');
INSERT INTO admission_requirements_locations VALUES('Mexico','international','mexico');
INSERT INTO admission_requirements_locations VALUES('Middle East','international','middle-east');
INSERT INTO admission_requirements_locations VALUES('Netherlands','international','netherlands');
INSERT INTO admission_requirements_locations VALUES('New Zealand','international','new-zealand');
INSERT INTO admission_requirements_locations VALUES('Nigeria','international','nigeria');
INSERT INTO admission_requirements_locations VALUES('Norway','international','norway');
INSERT INTO admission_requirements_locations VALUES('Oman','international','oman');
INSERT INTO admission_requirements_locations VALUES('Pakistan','international','pakistan');
INSERT INTO admission_requirements_locations VALUES('Palestine','international','palestine');
INSERT INTO admission_requirements_locations VALUES('Panama','international','panama');
INSERT INTO admission_requirements_locations VALUES('Peru','international','peru');
INSERT INTO admission_requirements_locations VALUES('Philippines','international','philippines');
INSERT INTO admission_requirements_locations VALUES('Poland','international','poland');
INSERT INTO admission_requirements_locations VALUES('Portugal','international','portugal');
INSERT INTO admission_requirements_locations VALUES('Qatar','international','qatar');
INSERT INTO admission_requirements_locations VALUES('Russia','international','russia');
INSERT INTO admission_requirements_locations VALUES('Saudia Arabia','international','saudia-arabia');
INSERT INTO admission_requirements_locations VALUES('Singapore','international','singapore');
INSERT INTO admission_requirements_locations VALUES('South Africa','international','south-africa');
INSERT INTO admission_requirements_locations VALUES('South Korea','international','south-korea');
INSERT INTO admission_requirements_locations VALUES('Sri Lanka','international','sri-lanka');
INSERT INTO admission_requirements_locations VALUES('Sweden','international','sweden');
INSERT INTO admission_requirements_locations VALUES('Switzerland','international','switzerland');
INSERT INTO admission_requirements_locations VALUES('Syria','international','syria');
INSERT INTO admission_requirements_locations VALUES('Taiwan','international','taiwan');
INSERT INTO admission_requirements_locations VALUES('Tanzania','international','tanzania');
INSERT INTO admission_requirements_locations VALUES('Thailand','international','thailand');
INSERT INTO admission_requirements_locations VALUES('Trinidad','international','trinidad');
INSERT INTO admission_requirements_locations VALUES('Turkey','international','turkey');
INSERT INTO admission_requirements_locations VALUES('UAE','international','uae');
INSERT INTO admission_requirements_locations VALUES('Uganda','international','uganda');
INSERT INTO admission_requirements_locations VALUES('Ukraine','international','ukraine');
INSERT INTO admission_requirements_locations VALUES('United States of America','international','united-states-of-america');
INSERT INTO admission_requirements_locations VALUES('United Kingdom','international','united-kingdom');
INSERT INTO admission_requirements_locations VALUES('Uzbekistan','international','uzbekistan');
INSERT INTO admission_requirements_locations VALUES('Venezuela','international','venezuela');
INSERT INTO admission_requirements_locations VALUES('Vietnam','international','vietnam');
INSERT INTO admission_requirements_locations VALUES('Yemen','international','yemen');
INSERT INTO admission_requirements_locations VALUES('Zambia','international','zambia');
INSERT INTO admission_requirements_locations VALUES('Zimbabwe','international','zimbabwe');
INSERT INTO admission_requirements_locations VALUES('Advanced Placement','curriculum','advanced-placement');
INSERT INTO admission_requirements_locations VALUES('American Curriculum','curriculum','american-curriculum');
INSERT INTO admission_requirements_locations VALUES('Chinese Curriculum','curriculum','chinese-curriculum');
INSERT INTO admission_requirements_locations VALUES('European Baccalaureate','curriculum','european-baccalaureate');
INSERT INTO admission_requirements_locations VALUES('French Baccalaureate','curriculum','french-baccalaureate');
INSERT INTO admission_requirements_locations VALUES('International Baccalaureate','curriculum','international-baccalaureate');
INSERT INTO admission_requirements_locations VALUES('British Patterned Education (GCE)','curriculum','british-patterned-education');
COMMIT;
