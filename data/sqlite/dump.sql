PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE programs_undergraduate
(
    title    TEXT PRIMARY KEY NOT NULL,
    acronym TEXT,
    url     TEXT             NOT NULL,
    degrees TEXT,
    types   TEXT             NOT NULL,
    tags    TEXT
);
INSERT INTO programs_undergraduate VALUES('Agriculture','AGRS','https://www.uoguelph.ca/programs/bachelor-of-science-in-agriculture/','["Bachelor of Science in Agriculture"]','["major","minor","co-op"]','["agriculture","botany","bioscience"]');
INSERT INTO programs_undergraduate VALUES('Animal Biology','ABIO','https://www.uoguelph.ca/programs/animal-biology/','["Bachelor of Science"]','["major"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('Animal Science','ANSC','https://www.uoguelph.ca/programs/animal-science/','["Bachelor of Science in Agriculture"]','["major","co-op"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('Anthropology','ANTH','https://www.uoguelph.ca/programs/anthropology/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["poli*","cultur*","human","socio*","antho*","public","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('Applied Geomatics','AG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/applied-geomatics-ag/','[]','["minor"]','["geography","technology"]');
INSERT INTO programs_undergraduate VALUES('Applied Human Nutrition','AHN','https://www.uoguelph.ca/programs/applied-human-nutrition/','["Bachelor of Applied Science"]','["major"]','["health","diet*","nutrition*","food"]');
INSERT INTO programs_undergraduate VALUES('Art History','ARTH','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/art-history-arth/','["Bachelor of Arts"]','["major","minor"]','["arts","history"]');
INSERT INTO programs_undergraduate VALUES('Arts and Sciences','AS','https://www.uoguelph.ca/programs/bachelor-of-arts-and-sciences/','["Bachelor of Arts and Sciences"]','["major"]','["science","arts"]');
INSERT INTO programs_undergraduate VALUES('Arts Management','AM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/arts-management-am/','[]','["minor"]','["arts","business"]');
INSERT INTO programs_undergraduate VALUES('Bio-Medical Science','BIOM','https://www.uoguelph.ca/programs/biomedical-science/','["Bachelor of Science"]','["major"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*","cogniti*","diet*"]');
INSERT INTO programs_undergraduate VALUES('Biochemistry','BIOC','https://www.uoguelph.ca/programs/biochemistry/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biochem*","chem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","clinic*","patho*","pharma*"]');
INSERT INTO programs_undergraduate VALUES('Biological and Pharmaceutical Chemistry','BPCH','https://www.uoguelph.ca/programs/biological-and-pharmaceutical-chemistry/','["Bachelor of Science"]','["major","co-op"]','["biology","chemistry","health","medical","science"]');
INSERT INTO programs_undergraduate VALUES('Biological Engineering','BIOE','https://www.uoguelph.ca/programs/biological-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["biology","engineering","science","chemistry"]');
INSERT INTO programs_undergraduate VALUES('Biological Science','BIOS','https://www.uoguelph.ca/programs/biological-science/','["Bachelor of Science"]','["major"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","natur*","ecol*","wild*","cell*","biodivers*","conserva*","animal*","enviro*","medic*","biomolecu*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","sustain*","mammal*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*","cogniti*","diet*"]');
INSERT INTO programs_undergraduate VALUES('Biology','BIOL','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/biology-biol/','[]','["minor"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('Biomedical Engineering','BME','https://www.uoguelph.ca/programs/biomedical-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["biology","engineering","science"]');
INSERT INTO programs_undergraduate VALUES('Biomedical Toxicology','BTOX','https://www.uoguelph.ca/programs/biomedical-toxicology/','["Bachelor of Science"]','["major","co-op"]','["biology","health","medical","science","biochemistry","pharmacology"]');
INSERT INTO programs_undergraduate VALUES('Biotechnology','BIOT','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/biotechnology-biot/','[]','["minor"]','["biology","science","technology"]');
INSERT INTO programs_undergraduate VALUES('Black Canadian Studies','BLCK','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/black-canadian-studies-blck/','[]','["minor"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('Business','BUS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-bus/','[]','["minor"]','["business","finance"]');
INSERT INTO programs_undergraduate VALUES('Business Data Analytics','BDA','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-data-analytics-bda/','[]','["minor"]','["business","finance","statistics"]');
INSERT INTO programs_undergraduate VALUES('Business Economics','BECN','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-economics-becn/','[]','["minor"]','["business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('Chemistry','CHEM','https://www.uoguelph.ca/programs/chemistry/','["Bachelor of Science"]','["major","co-op","minor"]','["chemistry","science","chemical physics","nanoscience"]');
INSERT INTO programs_undergraduate VALUES('Child Studies','CSTU','https://www.uoguelph.ca/programs/child-studies/','["Bachelor of Applied Science"]','["major"]','["child*","youth","educat*","teach*","early","relation*","socio*","social","cultur*","psych*","sex*","health","family","pedagog*"]');
INSERT INTO programs_undergraduate VALUES('Classical Studies','CLAS','https://www.uoguelph.ca/programs/classical-studies/','["Bachelor of Arts"]','["major","minor"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('Computer Engineering','CENG','https://www.uoguelph.ca/programs/computer-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["technology","engineering","programming","computer science","artificial intelligence","ai","design"]');
INSERT INTO programs_undergraduate VALUES('Computer Science','CS','https://www.uoguelph.ca/programs/computer-science/','["Bachelor of Computing"]','["major","co-op"]','["technology","programming","engineering","software development","software engineering","software","web development","artificial intelligence","ai","mathematics","software design","data","analytics"]');
INSERT INTO programs_undergraduate VALUES('Creative Writing','CW','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/creative-writing-cw/','["Bachelor of Arts"]','["major","minor"]','["arts"]');
INSERT INTO programs_undergraduate VALUES('Criminal Justice and Public Policy','CJPP','https://www.uoguelph.ca/programs/criminal-justice-and-public-policy/','["Bachelor of Arts"]','["major","co-op","minor"]','["poli*","crim*","govern*","law","power","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('Crop Science','CRSC','https://www.uoguelph.ca/programs/crop-science/','["Bachelor of Science in Agriculture"]','["major","co-op"]','["agriculture","botany","bioscience","science"]');
INSERT INTO programs_undergraduate VALUES('Culture and Technology Studies','CTS','https://www.uoguelph.ca/programs/culture-and-technology-studies/','["Bachelor of Arts"]','["major","co-op","minor"]','["humanities","technology","culture"]');
INSERT INTO programs_undergraduate VALUES('Ecology','ECOL','https://www.uoguelph.ca/programs/ecology/','["Bachelor of Science in Environmental Sciences"]','["major","co-op","minor"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('Economics','ECON','https://www.uoguelph.ca/programs/economics/','["Bachelor of Arts"]','["major","co-op","minor"]','["business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('Engineering Systems and Computing','ESC','https://www.uoguelph.ca/programs/engineering-systems-and-computing/','["Bachelor of Engineering"]','["major","co-op"]','["technology","engineering","programming","software","software engineering","artificial intelligence","ai","web development","software design"]');
INSERT INTO programs_undergraduate VALUES('English','ENGL','https://www.uoguelph.ca/programs/english/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('Entrepreneurship','ENT','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/entrepreneurship-ent/','[]','["minor"]','["business","finance"]');
INSERT INTO programs_undergraduate VALUES('Environment and Resource Management','ERM','https://www.uoguelph.ca/programs/environment-and-resource-management/','["Bachelor of Science in Environmental Sciences"]','["major","co-op"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","science"]');
INSERT INTO programs_undergraduate VALUES('Environmental Biology','ENVB','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-biology-envb/','["Bachelor of Science"]','["major"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('Environmental Economics and Policy','EEP','https://www.uoguelph.ca/programs/environmental-economics-and-policy/','["Bachelor of Science in Environmental Sciences"]','["major","co-op"]','["business","finance","economics","science"]');
INSERT INTO programs_undergraduate VALUES('Environmental Engineering','ENVE','https://www.uoguelph.ca/programs/environmental-engineering/','["Bachelor of Engineering"]','["major","co-op","minor"]','["engineering","science"]');
INSERT INTO programs_undergraduate VALUES('Environmental Geomatics','EG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-geomatics-eg/','["Bachelor of Science"]','["major","co-op"]','["geography","technology","science"]');
INSERT INTO programs_undergraduate VALUES('Environmental Governance','EGOV','https://www.uoguelph.ca/programs/environmental-governance/','["Bachelor of Arts"]','["major","co-op"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","poli*"]');
INSERT INTO programs_undergraduate VALUES('Environmental Management','EM','https://www.uoguelph.ca/programs/environmental-management/','["Bachelor of Bio-Resource Management"]','["major","co-op"]','["business"]');
INSERT INTO programs_undergraduate VALUES('Environmental Sciences','ENVS','https://www.uoguelph.ca/programs/environmental-sciences/','["Bachelor of Science in Environmental Sciences"]','["major","co-op"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('Equine Management','EQM','https://www.uoguelph.ca/programs/equine-management/','["Bachelor of Bio-Resource Management"]','["major","co-op"]','["biology","science"]');
INSERT INTO programs_undergraduate VALUES('European Culture and Civilization','ECC','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/european-culture-civilization-ecc/','[]','["minor"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('European Studies','EURS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/european-studies-eurs/','["Bachelor of Arts"]','["major"]','["humanities","history","culture"]');
INSERT INTO programs_undergraduate VALUES('Family and Child Studies','FCS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/family-child-studies-fcs/','[]','["minor"]','["humanities"]');
INSERT INTO programs_undergraduate VALUES('Family Studies and Human Development','FSHD','https://www.uoguelph.ca/programs/family-studies-and-human-development/','["Bachelor of Applied Science"]','["major"]','["child*","youth","adult","life","relation*","cultur*","psych*","socio*","development","gerontology","aging","sex*","health"]');
INSERT INTO programs_undergraduate VALUES('Food and Agricultural Business','FAB','https://www.uoguelph.ca/programs/food-and-agricultural-business/','["Bachelor of Commerce"]','["major","co-op"]','["agriculture","food","business"]');
INSERT INTO programs_undergraduate VALUES('Food Engineering','FENG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/food-engineering-feng/','[]','["minor"]','["food","engineering"]');
INSERT INTO programs_undergraduate VALUES('Food Industry Management','FIM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/food-industry-management-fim/','["Bachelor of Bio-Resource Management"]','["major","co-op"]','["food","business","management"]');
INSERT INTO programs_undergraduate VALUES('Food Science','FOOD','https://www.uoguelph.ca/programs/food-science/','["Bachelor of Science"]','["major","co-op"]','["food","science"]');
INSERT INTO programs_undergraduate VALUES('Food, Agricultural and Resource Economics','FARE','https://www.uoguelph.ca/programs/food-agricultural-resource-economics/','["Bachelor of Arts"]','["major","co-op"]','["agriculture","food","business","economics"]');
INSERT INTO programs_undergraduate VALUES('French Studies','FREN','https://www.uoguelph.ca/programs/french-studies/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('Geography','GEOG','https://www.uoguelph.ca/programs/geography/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","science"]');
INSERT INTO programs_undergraduate VALUES('German','GERM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/german-germ/','[]','["minor"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('Government, Economics and Management','GEM','https://www.uoguelph.ca/programs/government-economics-and-management/','["Bachelor of Commerce"]','["major","co-op"]','["business","economics","politics","management","law"]');
INSERT INTO programs_undergraduate VALUES('History','HIST','https://www.uoguelph.ca/programs/history/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["humanities","history"]');
INSERT INTO programs_undergraduate VALUES('Horticulture','HRT','https://www.uoguelph.ca/programs/horticulture/','["Bachelor of Science in Agriculture"]','["major","co-op"]','["agriculture","botany","bioscience","science"]');
INSERT INTO programs_undergraduate VALUES('Hospitality and Tourism Management','HTM','https://www.uoguelph.ca/programs/hospitality-and-tourism-management/','["Bachelor of Commerce"]','["major","co-op"]','["business","tourism","management"]');
INSERT INTO programs_undergraduate VALUES('Human Kinetics','HK','https://www.uoguelph.ca/programs/human-kinetics/','["Bachelor of Science"]','["major"]','["biol*","science*","life*","living","research*","biomedic*","health*","cell*","medic*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","immun*","virolog*","virus","infect*","dna","diet*"]');
INSERT INTO programs_undergraduate VALUES('Human Resources','HR','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/human-resources-hr/','[]','["minor"]','["business","management"]');
INSERT INTO programs_undergraduate VALUES('Indigenous Environmental Science and Practice','IESP','https://www.uoguelph.ca/programs/bachelor-of-indigenous-environmental-science-and-practice/','["Bachelor of Indigenous Environmental Science and Practice"]','["major"]','["humanities","culture","science"]');
INSERT INTO programs_undergraduate VALUES('International Business','IB','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/international-business-ib/','[]','["minor"]','["business"]');
INSERT INTO programs_undergraduate VALUES('International Development Studies','IDS','https://www.uoguelph.ca/programs/international-development-studies/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["poli*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","govern*"]');
INSERT INTO programs_undergraduate VALUES('Italian','ITAL','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/italian-ital/','[]','["minor"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('Justice and Legal Studies','JLS','https://www.uoguelph.ca/programs/justice-and-legal-studies/','["Bachelor of Arts"]','["major","co-op"]','["poli*","crim*","govern*","law","power","public","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('Landscape Architecture','LA','https://www.uoguelph.ca/programs/bachelor-of-landscape-architecture/','["Bachelor of Landscape Architecture"]','["major"]','["architecture","design"]');
INSERT INTO programs_undergraduate VALUES('Linguistics','LING','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/linguistics-ling/','[]','["minor"]','["humanities","language"]');
INSERT INTO programs_undergraduate VALUES('Management','MGMT','https://www.uoguelph.ca/programs/management/','["Bachelor of Commerce"]','["major","co-op"]','["business","management"]');
INSERT INTO programs_undergraduate VALUES('Management Economics and Finance','MEF','https://www.uoguelph.ca/programs/management-economics-and-finance/','["Bachelor of Commerce"]','["major","co-op"]','["business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('Marine and Freshwater Biology','MFB','https://www.uoguelph.ca/programs/marine-and-freshwater-biology/','["Bachelor of Science"]','["major","co-op"]','["biol*","science*","life*","living","research*","natur*","ecol*","wild*","biodivers*","conserva*","animal*","enviro*","ocean*","aqua*","fish*","sustain*","mammal*","sea*","water*","evolution*"]');
INSERT INTO programs_undergraduate VALUES('Marketing','MKTG','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/marketing-mktg/','[]','["minor"]','["business","marketing"]');
INSERT INTO programs_undergraduate VALUES('Marketing Management','MKMN','https://www.uoguelph.ca/programs/marketing-management/','["Bachelor of Commerce"]','["major","co-op"]','["business","marketing"]');
INSERT INTO programs_undergraduate VALUES('Mathematical Economics','MAEC','https://www.uoguelph.ca/programs/mathematical-economics/','["Bachelor of Arts"]','["major","co-op"]','["business","economics","mathematics"]');
INSERT INTO programs_undergraduate VALUES('Bachelor of Mathematics','BMATH','https://www.uoguelph.ca/programs/bachelor-of-mathematics/','["Bachelor of Mathematics"]','["major","minor"]','["mathematics","artificial intelligence","ai","data","analytics"]');
INSERT INTO programs_undergraduate VALUES('Mathematics','MATH','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/mathematics-math/','["Bachelor of Arts"]','["minor","area-of-concentration"]','["mathematics"]');
INSERT INTO programs_undergraduate VALUES('Mechanical Engineering','MECH','https://www.uoguelph.ca/programs/mechanical-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["robotics","design"]');
INSERT INTO programs_undergraduate VALUES('Media and Cinema Studies','MCST','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/media-cinema-studies-mcst/','[]','["minor"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('Microbiology','MICR','https://www.uoguelph.ca/programs/microbiology/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna"]');
INSERT INTO programs_undergraduate VALUES('Molecular Biology and Genetics','MBG','https://www.uoguelph.ca/programs/molecular-biology-and-genetics/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","biodivers*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*"]');
INSERT INTO programs_undergraduate VALUES('Museum Studies','MS','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/museum-studies-ms/','[]','["minor"]','["humanities","arts","culture","history"]');
INSERT INTO programs_undergraduate VALUES('Music','MUSC','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/music-musc/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('Neuroscience','NEUR','https://www.uoguelph.ca/programs/neuroscience/','["Bachelor of Science"]','["major","co-op","minor"]','["psych*","neuro*","brain","cogni*","human","behav*"]');
INSERT INTO programs_undergraduate VALUES('Nutritional and Nutraceutical Sciences','NANS','https://www.uoguelph.ca/programs/nutritional-and-nutraceutical-sciences/','["Bachelor of Science"]','["major","co-op","minor"]','["biol*","science*","life*","living","research*","biomedic*","health*","medic*","biomolecu*","physi*","kinesio*","disease","clinic*","patho*","exercise","nutri*","micro*","pharma*","diet*","nutraceut*","food","supplement*"]');
INSERT INTO programs_undergraduate VALUES('One Health','ONEH','https://www.uoguelph.ca/programs/bachelor-of-one-health/','["Bachelor of One Health"]','["major","minor"]','["health","science","biology"]');
INSERT INTO programs_undergraduate VALUES('Philosophy','PHIL','https://www.uoguelph.ca/programs/philosophy/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities"]');
INSERT INTO programs_undergraduate VALUES('Physical Science','PSCI','https://www.uoguelph.ca/programs/physical-science/','["Bachelor of Science"]','["major"]','["science","physics","chemistry","math","space","quantum","quantum mechanics","medical physics"]');
INSERT INTO programs_undergraduate VALUES('Physics','PHYS','https://www.uoguelph.ca/programs/physics/','["Bachelor of Science"]','["major","co-op","minor"]','["physics","science","math","space","quantum","quantum mechanics","medical physics","theoretical physics","chemical physics","nanoscience","bio medical physics"]');
INSERT INTO programs_undergraduate VALUES('Plant Science','PLSC','https://www.uoguelph.ca/programs/plant-science/','["Bachelor of Science"]','["major","co-op","minor"]','["agriculture","biology","science"]');
INSERT INTO programs_undergraduate VALUES('Political Science','POLS','https://www.uoguelph.ca/programs/political-science/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["poli*","crim*","govern*","law","power","justice","affairs","socio*"]');
INSERT INTO programs_undergraduate VALUES('Project Management','PM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/project-management-pm/','[]','["minor"]','["business","management"]');
INSERT INTO programs_undergraduate VALUES('Psychology','PSYC','https://www.uoguelph.ca/programs/psychology/','["Bachelor of Arts"]','["major","co-op","minor","area-of-concentration"]','["psych*","neuro*","brain","cogni*","human","behav*","cultur*"]');
INSERT INTO programs_undergraduate VALUES('Real Estate','RE','https://www.uoguelph.ca/programs/real-estate/','["Bachelor of Commerce"]','["major","co-op"]','["marketing","business","finance","economics"]');
INSERT INTO programs_undergraduate VALUES('Sexualities, Genders and Social Change','SXGN','https://www.uoguelph.ca/programs/sexualities-genders-and-social-change/','["Bachelor of Arts"]','["major","minor"]','["humanities","culture"]');
INSERT INTO programs_undergraduate VALUES('Sociology','SOC','https://www.uoguelph.ca/programs/sociology/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["poli*","crim*","govern*","law","power","institution*","affairs","socio*","justice","public"]');
INSERT INTO programs_undergraduate VALUES('Software Engineering','SENG','https://www.uoguelph.ca/programs/software-engineering/','["Bachelor of Computing"]','["major","co-op"]','["programming","technology","engineering","web development","computer science","artificial intelligence","ai","software design"]');
INSERT INTO programs_undergraduate VALUES('Spanish and Hispanic Studies','SPAH','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/spanish-hispanic-studies-spah/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","language","culture"]');
INSERT INTO programs_undergraduate VALUES('Sport and Event Management','SPMT','https://www.uoguelph.ca/programs/sport-and-event-management/','["Bachelor of Commerce"]','["major","co-op","minor"]','["business","management","sports"]');
INSERT INTO programs_undergraduate VALUES('Statistics','STAT','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/statistics-stat/','["Bachelor of Arts"]','["minor","area-of-concentration"]','["mathematics","statistics"]');
INSERT INTO programs_undergraduate VALUES('Studio Art','SART','https://www.uoguelph.ca/programs/studio-art/','["Bachelor of Arts"]','["major","minor"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('Sustainable Business','SB','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/sustainable-business-sb/','[]','["minor"]','["business"]');
INSERT INTO programs_undergraduate VALUES('Theatre Studies','THST','https://www.uoguelph.ca/programs/theatre-studies/','["Bachelor of Arts"]','["major","minor","area-of-concentration"]','["humanities","arts","culture"]');
INSERT INTO programs_undergraduate VALUES('Veterinary Medicine','VM','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/veterinary-medicine-vm/','["Doctor of Veterinary Medicine"]','["major"]','["health","science","biology"]');
INSERT INTO programs_undergraduate VALUES('Water Resources Engineering','WRE','https://www.uoguelph.ca/programs/water-resources-engineering/','["Bachelor of Engineering"]','["major","co-op"]','["engineering"]');
INSERT INTO programs_undergraduate VALUES('Wildlife Biology and Conservation','WBC','https://www.uoguelph.ca/programs/wildlife-biology-and-conservation/','["Bachelor of Science"]','["major","co-op"]','["biol*","science*","life*","living","research*","natur*","ecol*","wild*","biodivers*","conserva*","animal*","enviro*","ocean*","aqua*","fish*","sustain*","mammal*","sea*","water*","evolution*"]');
INSERT INTO programs_undergraduate VALUES('Zoology','ZOO','https://www.uoguelph.ca/programs/zoology/','["Bachelor of Science"]','["major","minor"]','["biol*","science*","life*","living","research*","natur*","ecol*","wild*","biodivers*","conserva*","animal*","enviro*","fish*","sustain*","mammal*","evolution*","dna"]');
CREATE TABLE programs_graduate
(
    title    TEXT PRIMARY KEY NOT NULL,
    url     TEXT             NOT NULL,
    degrees TEXT,
    types   TEXT             NOT NULL,
    tags    TEXT
);
INSERT INTO programs_graduate VALUES('Accounting','https://graduatestudies.uoguelph.ca/programs/accounting','["Graduate Diploma"]','["course-based"]','["business","finance"]');
INSERT INTO programs_graduate VALUES('Animal Biosciences','https://graduatestudies.uoguelph.ca/programs/aps','["MSc","PhD"]','["thesis-based","course-based"]','["biology","science"]');
INSERT INTO programs_graduate VALUES('Applied Nutrition','https://graduatestudies.uoguelph.ca/programs/applied-nutrition','["MAN"]','["course-based"]','["health","food"]');
INSERT INTO programs_graduate VALUES('Art History and Visual Culture','https://graduatestudies.uoguelph.ca/programs/avc','["MA"]','["thesis-based","course-based"]','["arts","culture","history"]');
INSERT INTO programs_graduate VALUES('Artificial Intelligence','https://graduatestudies.uoguelph.ca/programs/csai','["MSc","MASc"]','["collaborative-specialization"]','["technology","science","mathematics","programming","ai"]');
INSERT INTO programs_graduate VALUES('Bioinformatics','https://graduatestudies.uoguelph.ca/programs/binf','["MBINF","MSc","PhD"]','["course-based"]','["biol*","science*","life*","living","research*","informat*","data","statistic*","programming","analys*"]');
INSERT INTO programs_graduate VALUES('Biomedical Sciences','https://graduatestudies.uoguelph.ca/programs/biom','["MBS","MSc","PhD","DVSc"]','["course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Biophysics','https://graduatestudies.uoguelph.ca/programs/biop','["MSc","PhD"]','["thesis-based"]','["biology","physics","science"]');
INSERT INTO programs_graduate VALUES('Biotechnology','https://graduatestudies.uoguelph.ca/programs/biotechnology','["MBIOT"]','["course-based"]','["biology","science","technology"]');
INSERT INTO programs_graduate VALUES('Business Administration','https://graduatestudies.uoguelph.ca/programs/bus','["MBA"]','["course-based"]','["business"]');
INSERT INTO programs_graduate VALUES('Capacity Development and Extension','https://graduatestudies.uoguelph.ca/programs/cde','["MSc"]','["thesis-based","course-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('Chemistry','https://graduatestudies.uoguelph.ca/programs/chbi','["MSc","PhD"]','["thesis-based"]','["chemistry","science"]');
INSERT INTO programs_graduate VALUES('Clinical Studies','https://graduatestudies.uoguelph.ca/programs/clin','["MSc","DVSc"]','["thesis-based","course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Computational Sciences','https://graduatestudies.uoguelph.ca/programs/computational-science-phd','["PhD"]','["course-based"]','["technology","science","mathematics"]');
INSERT INTO programs_graduate VALUES('Computer Science','https://graduatestudies.uoguelph.ca/programs/cis','["MSc","PhD"]','["thesis-based"]','["technology","science","mathematics","programming"]');
INSERT INTO programs_graduate VALUES('Conservation Leadership','https://graduatestudies.uoguelph.ca/Programs/ConservationLeadership','["MCL"]','["course-based"]','["geograph*","environment","climat*","conserv*","natur*","resource","land","water","sustain*","science"]');
INSERT INTO programs_graduate VALUES('Creative Writing','https://graduatestudies.uoguelph.ca/programs/crwr','["MFA"]','["course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('Criminology and Criminal Justice Policy','https://graduatestudies.uoguelph.ca/programs/ccjp','["MA"]','["course-based","thesis-based"]','["poli*","crim*","govern*","law","power","public","affairs","socio*"]');
INSERT INTO programs_graduate VALUES('Critical Studies in Improvisation','https://graduatestudies.uoguelph.ca/programs/impr','["MA","PhD"]','["course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('Cybersecurity and Threat Intelligence','https://graduatestudies.uoguelph.ca/programs/mcti','["MCTI"]','["course-based"]','["technology","science","mathematics","programming"]');
INSERT INTO programs_graduate VALUES('Data Science','https://graduatestudies.uoguelph.ca/programs/data-science','["MDS"]','["course-based"]','["technology","statistics","mathematics","programming","artificial intelligence","ai"]');
INSERT INTO programs_graduate VALUES('Economics','https://graduatestudies.uoguelph.ca/programs/econ','["MA","PhD"]','["course-based"]','["business","economics","finance"]');
INSERT INTO programs_graduate VALUES('Engineering','https://graduatestudies.uoguelph.ca/programs/engg','["MEng","MASc","PhD"]','["course-based"]','["technology","engineering","artificial intelligence","ai"]');
INSERT INTO programs_graduate VALUES('English','https://graduatestudies.uoguelph.ca/programs/engl','["MA"]','["thesis-based"]','["arts","humanities","language"]');
INSERT INTO programs_graduate VALUES('Environmental Sciences','https://graduatestudies.uoguelph.ca/programs/envs','["MES","MSc","PhD"]','["course-based"]','["biology","science"]');
INSERT INTO programs_graduate VALUES('European Studies','https://graduatestudies.uoguelph.ca/programs/eurs','["MA"]','["course-based"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('Family Relations and Applied Nutrition','https://graduatestudies.uoguelph.ca/programs/fran','["MAN","MSc","PhD"]','["course-based","thesis-based"]','["health","food","humanities","science"]');
INSERT INTO programs_graduate VALUES('Food Safety and Quality Assurance','https://graduatestudies.uoguelph.ca/programs/fsqu','["MSc","Graduate Diploma"]','["course-based"]','["food","science"]');
INSERT INTO programs_graduate VALUES('Food Science','https://graduatestudies.uoguelph.ca/programs/food','["MSc","PhD"]','["thesis-based"]','["food","science","nutrition"]');
INSERT INTO programs_graduate VALUES('Food, Agricultural and Resource Economics','https://graduatestudies.uoguelph.ca/programs/fare','["MFARE","MSc","PhD"]','["course-based"]','["food","business","agriculture","economics"]');
INSERT INTO programs_graduate VALUES('French','https://graduatestudies.uoguelph.ca/programs/fren','["MA"]','["course-based"]','["humanities","language"]');
INSERT INTO programs_graduate VALUES('Geography','https://graduatestudies.uoguelph.ca/programs/geog','["MA","MSc","PhD"]','["course-based","thesis-based"]','["geography","science"]');
INSERT INTO programs_graduate VALUES('History','https://graduatestudies.uoguelph.ca/programs/hist','["MA","PhD"]','["thesis-based"]','["humanities","history"]');
INSERT INTO programs_graduate VALUES('Human Health and Nutritional Sciences','https://graduatestudies.uoguelph.ca/programs/hhns','["MSc","PhD"]','["thesis-based","course-based"]','["biol*","science*","life*","living","research*","biomedic*","health*","cell*","medic*","biomolecu*","physi*","kinesio*","disease","gene*","clinic*","patho*","exercise","nutri*","sports","biomechanic*","athlet*","movement","rehab*","anatom*","micro*","immun*","virolog*","virus","infect*","dna","pharma*","cogniti*","diet*"]');
INSERT INTO programs_graduate VALUES('Integrative Biology','https://graduatestudies.uoguelph.ca/programs/ibio','["MSc","PhD"]','["thesis-based"]','["biol*","science*","life*","living","research*","natur*","eco*","wild*","biodivers*","conserva*","animal*","enviro*","sustain*","mammal*","evolution*"]');
INSERT INTO programs_graduate VALUES('International Development Studies','https://graduatestudies.uoguelph.ca/programs/idev','["PhD","MSc","MA"]','["collaborative-specialization"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('Landscape Architecture','https://graduatestudies.uoguelph.ca/programs/ldar','["MLA"]','["course-based"]','["architecture","design"]');
INSERT INTO programs_graduate VALUES('Latin American and Caribbean Studies','https://graduatestudies.uoguelph.ca/programs/lacs','["MA"]','["course-based"]','["humanities","culture","history"]');
INSERT INTO programs_graduate VALUES('Leadership','https://graduatestudies.uoguelph.ca/programs/lead','["MA"]','["course-based"]','["humanities","business"]');
INSERT INTO programs_graduate VALUES('Literary Studies/Theatre Studies in English','https://graduatestudies.uoguelph.ca/programs/sets','["PhD"]','["thesis-based"]','["arts","humanities"]');
INSERT INTO programs_graduate VALUES('Management','https://graduatestudies.uoguelph.ca/programs/mgmt','["MSc","PhD"]','["course-based"]','["business","management"]');
INSERT INTO programs_graduate VALUES('Market Research','https://graduatestudies.uoguelph.ca/programs/marketresearch','["Graduate Diploma"]','["course-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('Marketing and Consumer Studies','https://graduatestudies.uoguelph.ca/programs/cost','["MSc","Graduate Diploma"]','["thesis-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('Mathematics and Statistics','https://graduatestudies.uoguelph.ca/programs/math','["MSc","PhD"]','["thesis-based"]','["mathematics","statistics","artificial intelligence","ai","data"]');
INSERT INTO programs_graduate VALUES('Molecular and Cellular Biology','https://graduatestudies.uoguelph.ca/programs/mcb','["MSc","PhD"]','["thesis-based"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*"]');
INSERT INTO programs_graduate VALUES('Neuroscience','https://graduatestudies.uoguelph.ca/programs/neur','["MSc","PhD","MBS"]','["collaborative-specialization"]','["biol*","science*","life*","living","research*","neuro*","brain","cogniti*"]');
INSERT INTO programs_graduate VALUES('One Health','https://graduatestudies.uoguelph.ca/programs/onehealth','["MSc","PhD","MES","MA","MASc","MEng"]','["collaborative-specialization"]','["biol*","science*","life*","living","research*","natur*","eco*","wild*","biodivers*","conserva*","animal*","enviro*","sustain*","mammal*","evolution*","health*","medic*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","infect*","dna","pharma*"]');
INSERT INTO programs_graduate VALUES('Pathobiology','https://graduatestudies.uoguelph.ca/programs/path','["MSc","PhD","DVSc","Graduate Diploma"]','["thesis-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Philosophy','https://graduatestudies.uoguelph.ca/programs/phil','["MA","PhD"]','["course-based"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('Physics','https://graduatestudies.uoguelph.ca/programs/phys','["MSc","PhD"]','["course-based","thesis-based"]','["physics","science"]');
INSERT INTO programs_graduate VALUES('Planning','https://www.uoguelph.ca/programs/master-of-planning','["MPlan"]','["course-based"]','["humanities","geography","rural","environmental design"]');
INSERT INTO programs_graduate VALUES('Political Science','https://graduatestudies.uoguelph.ca/programs/pols','["MA","PhD"]','["course-based","thesis-based"]','["humanities","politics"]');
INSERT INTO programs_graduate VALUES('Population Medicine','https://graduatestudies.uoguelph.ca/programs/popmed','["MSc","PhD","DVSc"]','["thesis-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Project Management','https://graduatestudies.uoguelph.ca/programs/project-management','["MPM","Graduate Diploma"]','["course-based"]','["business","management"]');
INSERT INTO programs_graduate VALUES('Psychology','https://graduatestudies.uoguelph.ca/programs/psyc','["MA","MSc","PhD"]','["thesis-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('Public Health','https://graduatestudies.uoguelph.ca/programs/phlt','["MPH","DVM/MPH Combined Degree","Graduate Diploma"]','["course-based"]','["health","medical","science","biology"]');
INSERT INTO programs_graduate VALUES('Public Issues Anthropology','https://graduatestudies.uoguelph.ca/programs/pia','["MA"]','["thesis-based"]','["poli*","cultur*","human","antho*","affairs","socio*"]');
INSERT INTO programs_graduate VALUES('Regenerative Medicine','https://graduatestudies.uoguelph.ca/programs/regenerative-medicine','["MSc","PhD","DVSc","MASc","MBS"]','["collaborative-specialization"]','["biol*","science*","life*","living","research*","biochem*","biomedic*","health*","molecu*","cell*","medic*","biomolecu*","disease","gene*","clinic*","patho*","micro*","bacteria*","immun*","virolog*","virus","evolution*","infect*","dna","pharma*"]');
INSERT INTO programs_graduate VALUES('Relational and Psychotherapy Training Program','https://graduatestudies.uoguelph.ca/programs/relational-and-psychotherapy-training-program','["MP","MRFT","MA"]','["course-based"]','["health","medical","psychology"]');
INSERT INTO programs_graduate VALUES('Rural Planning and Development','https://graduatestudies.uoguelph.ca/programs/rpdprof','["MSc","MPLAN"]','["course-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('Rural Studies','https://graduatestudies.uoguelph.ca/programs/rpdprof-stu','["PhD"]','["thesis-based","course-based"]','["humanities"]');
INSERT INTO programs_graduate VALUES('Sexuality, Genders and Bodies','https://graduatestudies.uoguelph.ca/programs/Sexualities-Genders-And-Bodies','["MA","PhD","MSc"]','["collaborative-specialization"]','["poli*","indigen*","justice","feminis*","decolon*","interdisciplinary"]');
INSERT INTO programs_graduate VALUES('Social Practice and Transformational Change','https://graduatestudies.uoguelph.ca/programs/sptc','["PhD"]','["thesis-based"]','["poli*","indigen*","justice","feminis*","decolon*","interdisciplinary","sex*","disab*","gender","lgb*","psych*","queer","socio*","anthro*","geograph*","family","relation*","critical"]');
INSERT INTO programs_graduate VALUES('Sociology','https://graduatestudies.uoguelph.ca/programs/soca','["MA","PhD"]','["thesis-based"]','["humanities","culture"]');
INSERT INTO programs_graduate VALUES('Studio Art','https://graduatestudies.uoguelph.ca/programs/sart','["MFA"]','["course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('Sustainable Agriculture','https://www.uoguelph.ca/programs/master-sustainable-agriculture/','["MSAg"]','["course-based"]','["agriculture","biology","science"]');
INSERT INTO programs_graduate VALUES('Theatre Studies','https://graduatestudies.uoguelph.ca/programs/thst','["MA"]','["thesis-based","course-based"]','["arts","humanities","culture"]');
INSERT INTO programs_graduate VALUES('Tourism and Hospitality','https://graduatestudies.uoguelph.ca/programs/trmh','["MSc","Graduate Diploma"]','["thesis-based","course-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('Tourism Research','https://graduatestudies.uoguelph.ca/programs/tres','["Graduate Diploma"]','["course-based"]','["business","marketing"]');
INSERT INTO programs_graduate VALUES('Toxicology','https://graduatestudies.uoguelph.ca/programs/tox','["MSc","PhD","MBS"]','["collaborative-specialization"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Veterinary Medicine / Public Health','https://graduatestudies.uoguelph.ca/programs/DVMMPH','["DVM","MPH"]','["course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Veterinary Science','https://graduatestudies.uoguelph.ca/programs/vets','["DVSc"]','["course-based"]','["biology","science","health","medical"]');
INSERT INTO programs_graduate VALUES('Wildlife Biology','https://calendar.uoguelph.ca/graduate-calendar/graduate-programs/wildlife-biology/','["MWB"]','["course-based"]','["biol*","science*","life*","living","research*","natur*","eco*","wild*","biodivers*","conserva*","animal*","enviro*","fish*","sustain*","mammal*"]');
INSERT INTO programs_graduate VALUES('Plant Agriculture','https://graduatestudies.uoguelph.ca/programs/plnt','["MSc","PhD","MPAg"]','["course-based"]','["crops","crop science","biochemistry","plant genetics"]');
CREATE TABLE programs_certificate_and_diplomas
(
    title    TEXT PRIMARY KEY NOT NULL,
    url     TEXT             NOT NULL,
    types   TEXT             NOT NULL,
    tags    TEXT
);
INSERT INTO programs_certificate_and_diplomas VALUES('Accounting','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/accounting-acct/','["certificate"]','["business","finance"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Agriculture','https://www.ridgetownc.com/future/dagr/','["associate-diploma","co-op"]','["agriculture","botany"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Business','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/business-bus/','["certificate"]','["business","finance"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Environmental Citizenship','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-citizenship-ect/','["certificate"]','["humanities","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Environmental Conservation','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/environmental-conservation-ecv/','["certificate"]','["biology","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Environmental Technician','https://www.ridgetownc.com/future/denm/','["associate-diploma","co-op"]','["agriculture","botany","environment"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Equine Care & Management','https://www.ridgetownc.com/future/denm/','["associate-diploma","co-op"]','["business","nutrition","animal","management"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Food Science','https://www.uoguelph.ca/programs/food-science/','["certificate"]','["food","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('German Language and Culture','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/german-germ/','["certificate"]','["humanities","language"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Horticulture','https://www.ridgetownc.com/future/dhrt/','["associate-diploma","co-op"]','["landscaping","botany","plant"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Hospitality and Tourism Management','https://www.uoguelph.ca/programs/hospitality-and-tourism-management/','["certificate"]','["business","tourism","management"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Indigenous Environmental Governance','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/indigenous-environmental-governance-ieg/','["certificate"]','["humanities","culture"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Leadership','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/leadership-lead/','["certificate"]','["humanities","management"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Organic Agriculture','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/organic-agriculture-oagr/','["certificate"]','["agriculture","biology","science"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Public Policy and Administration','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/public-policy-administration-ppa#certificatetext','["certificate"]','["humanities","politics","law"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Spanish Language and Culture','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/spanish-hispanic-studies-spah#certificatetext','["certificate"]','["humanities","language","culture"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Applied Statistics','https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/statistics-stat#diplomatext','["diploma"]','["mathematics","statistics"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Turfgrass Management','https://www.uoguelph.ca/programs/turfgrass-management/','["associate-diploma","co-op"]','["landscaping","botany","plant"]');
INSERT INTO programs_certificate_and_diplomas VALUES('Veterinary Technology','https://www.ridgetownc.com/future/dvt/','["associate-diploma"]','["animal","vet","biology"]');
CREATE TABLE programs_continuing_education
(
    title    TEXT PRIMARY KEY NOT NULL,
    url     TEXT             NOT NULL,
    types   TEXT             NOT NULL,
    tags    TEXT
);
INSERT INTO programs_continuing_education VALUES('Dairy Herdsperson Apprenticeship','https://www.ridgetownc.com/future/adh/','["apprenticeship"]','["agriculture","botany","animal"]');
INSERT INTO programs_continuing_education VALUES('Ice Cream Technology','https://www.uoguelph.ca/foodscience/ice-cream-technology-short-course','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('Cheese Making Technology','https://www.uoguelph.ca/foodscience/cheese-making-courses','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('Beer Brewing','https://www.uoguelph.ca/foodscience/brewing','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('Chocolate Science','https://www.uoguelph.ca/foodscience/chocolate','["short-course"]','["food","business","management"]');
INSERT INTO programs_continuing_education VALUES('Canadian Feed Industry Education Program','https://courses.opened.uoguelph.ca/contentManagement.do?method=load&code=CM000063','["short-course"]','["livestock","animal","agriculture"]');
INSERT INTO programs_continuing_education VALUES('Counselling and Human Sexuality','https://courses.opened.uoguelph.ca/contentManagement.do?method=load&code=CM000025','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Creative Writing','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=583604','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Equine Studies','https://courses.opened.uoguelph.ca/contentManagement.do?method=load&code=CM000020','["diploma"]','["horse","animal"]');
INSERT INTO programs_continuing_education VALUES('Equine Science','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=610688','["certificate"]','["horse","animal"]');
INSERT INTO programs_continuing_education VALUES('Equine Welfare','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=611375','["certificate"]','["horse","animal"]');
INSERT INTO programs_continuing_education VALUES('English Language Programs','https://opened.uoguelph.ca/student-resources/guelph-elp','["certificate","short-course"]','["language"]');
INSERT INTO programs_continuing_education VALUES('Environmental Citizenship','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=625466','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Environmental Conservation','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=626394','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('DNA Barcoding','https://courses.opened.uoguelph.ca/public/category/programStream.do?method=load&selectedProgramAreaId=16994&selectedProgramStreamId=12732257','["short-course"]','[]');
INSERT INTO programs_continuing_education VALUES('Advanced Principles of Toxicology','https://courses.opened.uoguelph.ca/search/publicCourseSearchDetails.do?method=load&courseId=17780&selectedProgramAreaId=16994&selectedProgramStreamId=17127','["short-course"]','[]');
INSERT INTO programs_continuing_education VALUES('Food Science','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=655668','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Geographical Epidemiology','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=655668','["short-course"]','[]');
INSERT INTO programs_continuing_education VALUES('Plant-Based Nutrition','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=29839235','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Horticulture (Diploma)','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=18118724&selectedProgramAreaId=16989&selectedProgramStreamId=','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('Landscape Design (Diploma)','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=18143026&selectedProgramAreaId=16989&selectedProgramStreamId=','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('Horticulture (Certificate)','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=15952899&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Landscape Design (Certificate)','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=18143158&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Maintaining Golf Courses','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=701097&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Sustainable Urban Agriculture','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=615989&selectedProgramAreaId=16975&selectedProgramStreamId=17124','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Sustainable Urban Horticulture','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=702165&selectedProgramAreaId=16989&selectedProgramStreamId=','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Turf Managers','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=14958241','["short-course","certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Accounting','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=26779164','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Business','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=621077','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Disability Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129861','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Hospitality Studies','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=627258','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Information Management, Privacy and Access','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129924','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Leadership','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=646478','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Supply Chain Management for Public Procurement','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=474252','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Data Science','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=8353906','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Human Resources Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=590230','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('Advanced Interpersonal Skills for PSW Practice','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=34640456','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Facilities Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129911','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Human Resources Management for School Board Administration','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129911','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Information and Communication Technology Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=129941','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Pupil Transportation Management','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=465245','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('School Board Administration','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=605466','["diploma"]','[]');
INSERT INTO programs_continuing_education VALUES('Knowledge Mobilization','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=453705','["certificate"]','[]');
INSERT INTO programs_continuing_education VALUES('Public Policy and Administration','https://courses.opened.uoguelph.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=654157','["diploma"]','[]');
CREATE TABLE admission_requirements_student_types
(
    id    TEXT PRIMARY KEY NOT NULL,
    name  TEXT             NOT NULL
);
INSERT INTO admission_requirements_student_types VALUES('high-school','High School Student/Graduate');
INSERT INTO admission_requirements_student_types VALUES('university','University Student/Graduate');
INSERT INTO admission_requirements_student_types VALUES('college','College Student/Graduate');
INSERT INTO admission_requirements_student_types VALUES('internal','Current University of Guelph Student/Graduate');
CREATE TABLE admission_requirements_provinces
(
    name TEXT PRIMARY KEY NOT NULL
);
INSERT INTO admission_requirements_provinces VALUES('Ontario');
INSERT INTO admission_requirements_provinces VALUES('Alberta');
INSERT INTO admission_requirements_provinces VALUES('British Columbia');
INSERT INTO admission_requirements_provinces VALUES('Manitoba');
INSERT INTO admission_requirements_provinces VALUES('New Brunswick');
INSERT INTO admission_requirements_provinces VALUES('Newfoundland and Labrador');
INSERT INTO admission_requirements_provinces VALUES('Nova Scotia');
INSERT INTO admission_requirements_provinces VALUES('Prince Edward Island');
INSERT INTO admission_requirements_provinces VALUES('Quebec');
INSERT INTO admission_requirements_provinces VALUES('Saskatchewan');
CREATE TABLE admission_requirements_countries
(
    name TEXT PRIMARY KEY NOT NULL
);
INSERT INTO admission_requirements_countries VALUES('Afghanistan');
INSERT INTO admission_requirements_countries VALUES('Argentina');
INSERT INTO admission_requirements_countries VALUES('Austria');
INSERT INTO admission_requirements_countries VALUES('Azerbaijan');
INSERT INTO admission_requirements_countries VALUES('Bahrain');
INSERT INTO admission_requirements_countries VALUES('Bahamas');
INSERT INTO admission_requirements_countries VALUES('Bangladesh');
INSERT INTO admission_requirements_countries VALUES('Barbados');
INSERT INTO admission_requirements_countries VALUES('Bermuda');
INSERT INTO admission_requirements_countries VALUES('Bolivia');
INSERT INTO admission_requirements_countries VALUES('Botswana');
INSERT INTO admission_requirements_countries VALUES('Brazil');
INSERT INTO admission_requirements_countries VALUES('Cameroon');
INSERT INTO admission_requirements_countries VALUES('Caribbean');
INSERT INTO admission_requirements_countries VALUES('Chile');
INSERT INTO admission_requirements_countries VALUES('China');
INSERT INTO admission_requirements_countries VALUES('Colombia');
INSERT INTO admission_requirements_countries VALUES('Costa Rica');
INSERT INTO admission_requirements_countries VALUES('Dominican Republic');
INSERT INTO admission_requirements_countries VALUES('Ecuador');
INSERT INTO admission_requirements_countries VALUES('Egypt');
INSERT INTO admission_requirements_countries VALUES('El Savador');
INSERT INTO admission_requirements_countries VALUES('England');
INSERT INTO admission_requirements_countries VALUES('Ethiopia');
INSERT INTO admission_requirements_countries VALUES('France');
INSERT INTO admission_requirements_countries VALUES('Germany');
INSERT INTO admission_requirements_countries VALUES('Ghana');
INSERT INTO admission_requirements_countries VALUES('Greece');
INSERT INTO admission_requirements_countries VALUES('Guatemala');
INSERT INTO admission_requirements_countries VALUES('Hong Kong');
INSERT INTO admission_requirements_countries VALUES('Haiti');
INSERT INTO admission_requirements_countries VALUES('India');
INSERT INTO admission_requirements_countries VALUES('Indonesia');
INSERT INTO admission_requirements_countries VALUES('Iran');
INSERT INTO admission_requirements_countries VALUES('Iraq');
INSERT INTO admission_requirements_countries VALUES('Ireland');
INSERT INTO admission_requirements_countries VALUES('Italy');
INSERT INTO admission_requirements_countries VALUES('Japan');
INSERT INTO admission_requirements_countries VALUES('Jamaica');
INSERT INTO admission_requirements_countries VALUES('Jordan');
INSERT INTO admission_requirements_countries VALUES('Kazakhstan');
INSERT INTO admission_requirements_countries VALUES('Kenya');
INSERT INTO admission_requirements_countries VALUES('Kuwait');
INSERT INTO admission_requirements_countries VALUES('Latvia');
INSERT INTO admission_requirements_countries VALUES('Lebanon');
INSERT INTO admission_requirements_countries VALUES('Libya');
INSERT INTO admission_requirements_countries VALUES('Malaysia');
INSERT INTO admission_requirements_countries VALUES('Mauritius');
INSERT INTO admission_requirements_countries VALUES('Mexico');
INSERT INTO admission_requirements_countries VALUES('Middle East');
INSERT INTO admission_requirements_countries VALUES('Netherlands');
INSERT INTO admission_requirements_countries VALUES('New Zealand');
INSERT INTO admission_requirements_countries VALUES('Nigeria');
INSERT INTO admission_requirements_countries VALUES('Norway');
INSERT INTO admission_requirements_countries VALUES('Oman');
INSERT INTO admission_requirements_countries VALUES('Pakistan');
INSERT INTO admission_requirements_countries VALUES('Palestine');
INSERT INTO admission_requirements_countries VALUES('Panama');
INSERT INTO admission_requirements_countries VALUES('Peru');
INSERT INTO admission_requirements_countries VALUES('Philippines');
INSERT INTO admission_requirements_countries VALUES('Poland');
INSERT INTO admission_requirements_countries VALUES('Portugal');
INSERT INTO admission_requirements_countries VALUES('Qatar');
INSERT INTO admission_requirements_countries VALUES('Russia');
INSERT INTO admission_requirements_countries VALUES('Saudia Arabia');
INSERT INTO admission_requirements_countries VALUES('Singapore');
INSERT INTO admission_requirements_countries VALUES('South Africa');
INSERT INTO admission_requirements_countries VALUES('South Korea');
INSERT INTO admission_requirements_countries VALUES('Sri Lanka');
INSERT INTO admission_requirements_countries VALUES('Sweden');
INSERT INTO admission_requirements_countries VALUES('Switzerland');
INSERT INTO admission_requirements_countries VALUES('Syria');
INSERT INTO admission_requirements_countries VALUES('Taiwan');
INSERT INTO admission_requirements_countries VALUES('Tanzania');
INSERT INTO admission_requirements_countries VALUES('Thailand');
INSERT INTO admission_requirements_countries VALUES('Trinidad');
INSERT INTO admission_requirements_countries VALUES('Turkey');
INSERT INTO admission_requirements_countries VALUES('UAE');
INSERT INTO admission_requirements_countries VALUES('Uganda');
INSERT INTO admission_requirements_countries VALUES('Ukraine');
INSERT INTO admission_requirements_countries VALUES('United States of America');
INSERT INTO admission_requirements_countries VALUES('United Kingdom');
INSERT INTO admission_requirements_countries VALUES('Uzbekistan');
INSERT INTO admission_requirements_countries VALUES('Venezuela');
INSERT INTO admission_requirements_countries VALUES('Vietnam');
INSERT INTO admission_requirements_countries VALUES('Yemen');
INSERT INTO admission_requirements_countries VALUES('Zambia');
INSERT INTO admission_requirements_countries VALUES('Zimbabwe');
CREATE TABLE admission_requirements_curriculums
(
    name TEXT PRIMARY KEY NOT NULL
);
INSERT INTO admission_requirements_curriculums VALUES('Advanced Placement');
INSERT INTO admission_requirements_curriculums VALUES('American Curriculum');
INSERT INTO admission_requirements_curriculums VALUES('Chinese Curriculum');
INSERT INTO admission_requirements_curriculums VALUES('European Baccalaureate');
INSERT INTO admission_requirements_curriculums VALUES('French Baccalaureate');
INSERT INTO admission_requirements_curriculums VALUES('International Baccalaureate');
INSERT INTO admission_requirements_curriculums VALUES('British Patterned Education (GCE)');
COMMIT;
